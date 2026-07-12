import './style.css';
import './collection.css';
import './command-center.css';
import './font-scale.css';
import './economy-audio.css';
import { createGame } from './game/createGame';
import { GameStore } from './game/state/GameStore';
import { SaveService } from './game/systems/SaveService';
import { CommandCenterUI } from './game/ui/CommandCenterUI';
import { AudioManager } from './game/systems/AudioManager';
import type { GameState } from './game/state/GameState';

const store = new GameStore();
const saves = new SaveService();
const ui = new CommandCenterUI(store);
const audio = new AudioManager(store);
audio.initialize();

async function bootstrap(): Promise<void> {
  try {
    const local = await saves.loadLocal();
    const cloudStatus = await saves.init();
    ui.setCloudStatus(cloudStatus);
    const chosen = await saves.reconcile(local);
    if (chosen) store.hydrate(chosen);
    const offlineYield = store.processAutomation(Date.now());
    ui.setSaveStatus(chosen ? 'Progress restored' : 'New journey ready');
    if (offlineYield > 0) ui.toast('Network operations reconciled', `${offlineYield} materials were gathered while you were away.`);
  } catch (error) {
    console.error(error);
    ui.setSaveStatus('Save loaded with limited sync');
    ui.toast('Save warning', error instanceof Error ? error.message : 'The save system encountered a problem.');
  }

  createGame(store);

  let saveInFlight = false;
  const persist = async (cloud = false): Promise<void> => {
    if (saveInFlight) return;
    saveInFlight = true;
    try {
      await saves.saveLocal(store.snapshot as GameState);
      if (cloud && saves.status.user) await saves.saveCloud(store.snapshot as GameState);
      ui.setSaveStatus(cloud && saves.status.user ? 'Saved locally and to cloud' : 'Autosaved locally');
    } catch (error) {
      console.error(error);
      ui.setSaveStatus('Save failed');
      ui.toast('Save failed', error instanceof Error ? error.message : 'Unknown save error.');
    } finally {
      saveInFlight = false;
    }
  };

  window.setInterval(() => store.processAutomation(Date.now()), 1_000);
  window.setInterval(() => void persist(Boolean(saves.status.user)), 10_000);
  window.addEventListener('beforeunload', () => {
    audio.destroy();
    void saves.saveLocal(store.snapshot as GameState);
  });

  ui.bindCloudButton(async () => {
    try {
      const status = saves.status;
      if (!status.configured) {
        ui.toast('Cloud setup required', 'Add your Supabase URL and public key to .env, then enable GitHub OAuth.');
        return;
      }
      if (!status.user) {
        await saves.signInWithGitHub();
        return;
      }
      await persist(true);
      ui.toast('Cloud synchronized', 'Your latest progress is now tied to your GitHub sign-in.');
    } catch (error) {
      ui.toast('Cloud sync failed', error instanceof Error ? error.message : 'Unknown cloud error.');
    }
  });

  window.addEventListener('cloud-auth-changed', async (event) => {
    const status = (event as CustomEvent).detail;
    ui.setCloudStatus(status);
    if (status.user) {
      const merged = await saves.reconcile(store.snapshot as GameState);
      if (merged) store.hydrate(merged);
      ui.toast('GitHub save connected', 'Cloud progression is active on this device.');
    }
  });
}

void bootstrap();
