import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { normalizeState, type GameState } from '../state/GameState';

const DB_NAME = 'gatherers-ascension-db';
const STORE_NAME = 'saves';
const LOCAL_KEY = 'primary';

export interface CloudStatus {
  configured: boolean;
  user: User | null;
}

export class SaveService {
  private dbPromise: Promise<IDBDatabase>;
  private supabase: SupabaseClient | null = null;
  private currentUser: User | null = null;

  constructor() {
    this.dbPromise = this.openDatabase();
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
    if (url && key) this.supabase = createClient(url, key);
  }

  async init(): Promise<CloudStatus> {
    if (!this.supabase) return { configured: false, user: null };
    const { data } = await this.supabase.auth.getSession();
    this.currentUser = data.session?.user ?? null;
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser = session?.user ?? null;
      window.dispatchEvent(new CustomEvent('cloud-auth-changed', { detail: this.status }));
    });
    return this.status;
  }

  get status(): CloudStatus {
    return { configured: Boolean(this.supabase), user: this.currentUser };
  }

  async signInWithGitHub(): Promise<void> {
    if (!this.supabase) throw new Error('Cloud saves are not configured yet.');
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo },
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    if (!this.supabase) return;
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async saveLocal(state: GameState): Promise<void> {
    const db = await this.dbPromise;
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(structuredClone(state), LOCAL_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Local save failed.'));
    });
  }

  async loadLocal(): Promise<GameState | null> {
    const db = await this.dbPromise;
    return new Promise<GameState | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(LOCAL_KEY);
      request.onsuccess = () => resolve(request.result ? normalizeState(request.result as GameState) : null);
      request.onerror = () => reject(request.error ?? new Error('Local load failed.'));
    });
  }

  async saveCloud(state: GameState): Promise<void> {
    if (!this.supabase || !this.currentUser) throw new Error('Sign in before saving to the cloud.');
    const { error } = await this.supabase.from('game_saves').upsert({
      user_id: this.currentUser.id,
      slot: 'primary',
      state,
      updated_at: new Date(state.updatedAt).toISOString(),
    }, { onConflict: 'user_id,slot' });
    if (error) throw error;
  }

  async loadCloud(): Promise<GameState | null> {
    if (!this.supabase || !this.currentUser) return null;
    const { data, error } = await this.supabase
      .from('game_saves')
      .select('state')
      .eq('user_id', this.currentUser.id)
      .eq('slot', 'primary')
      .maybeSingle();
    if (error) throw error;
    return data?.state ? normalizeState(data.state as GameState) : null;
  }

  async reconcile(local: GameState | null): Promise<GameState | null> {
    if (!this.currentUser) return local;
    const cloud = await this.loadCloud();
    if (!cloud) {
      if (local) await this.saveCloud(local);
      return local;
    }
    if (!local || cloud.updatedAt > local.updatedAt) {
      await this.saveLocal(cloud);
      return cloud;
    }
    if (local.updatedAt > cloud.updatedAt) await this.saveCloud(local);
    return local;
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Could not open local save database.'));
    });
  }
}
