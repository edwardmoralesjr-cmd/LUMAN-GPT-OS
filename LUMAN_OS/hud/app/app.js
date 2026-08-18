const REPO_RAW = 'https://raw.githubusercontent.com/edwardmoralesjr-cmd/LUMAN-GPT-OS/main/';
const BRIDGE_STORAGE_KEY = 'luman_bridge_url_v1';

const SOURCES = {
  priorities: '00_CORE/ACTIVE_PRIORITIES.md',
  loops: '00_CORE/OPEN_LOOPS.md',
  registry: 'LUMAN_OS/system_settings/PROJECT_REGISTRY.md',
  constitution: 'LUMAN_OS/system_settings/HUMAN_SOVEREIGNTY_CONSTITUTION.md',
};

const els = {
  clock: document.querySelector('#clock'),
  date: document.querySelector('#date'),
  refreshBtn: document.querySelector('#refreshBtn'),
  constitutionStatus: document.querySelector('#constitutionStatus'),
  publicBrainStatus: document.querySelector('#publicBrainStatus'),
  privateBrainStatus: document.querySelector('#privateBrainStatus'),
  calendarStatus: document.querySelector('#calendarStatus'),
  gmailStatus: document.querySelector('#gmailStatus'),
  freshnessBadge: document.querySelector('#freshnessBadge'),
  topThree: document.querySelector('#topThree'),
  fronts: document.querySelector('#fronts'),
  projects: document.querySelector('#projects'),
  loops: document.querySelector('#loops'),
  buildGate: document.querySelector('#buildGate'),
  lastSync: document.querySelector('#lastSync'),
  askForm: document.querySelector('#askForm'),
  askInput: document.querySelector('#askInput'),
  commandOutput: document.querySelector('#commandOutput'),
  sourceFooter: document.querySelector('#sourceFooter'),
  bridgeUrl: document.querySelector('#bridgeUrl'),
  connectBridgeBtn: document.querySelector('#connectBridgeBtn'),
  bridgeLoginBtn: document.querySelector('#bridgeLoginBtn'),
  disconnectBridgeBtn: document.querySelector('#disconnectBridgeBtn'),
  bridgeIdentity: document.querySelector('#bridgeIdentity'),
  bridgeMessage: document.querySelector('#bridgeMessage'),
  calendarToday: document.querySelector('#calendarToday'),
  inboxSignals: document.querySelector('#inboxSignals'),
  privateCommitments: document.querySelector('#privateCommitments'),
};

function setClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  els.date.textContent = now.toLocaleDateString([], {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

setClock();
setInterval(setClock, 30_000);

async function fetchText(path) {
  const response = await fetch(`${REPO_RAW}${path}?v=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

function section(md, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp(`^##\\s+${escaped}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`, 'mi');
  return md.match(rx)?.[1]?.trim() || '';
}

function firstCodeBlock(text) {
  return text.match(/```(?:text)?\s*([\s\S]*?)```/i)?.[1]?.trim() || '';
}

function numberedLines(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => /^\[?\d+\]?\s*[.)]?\s+/.test(line) || /^\[\d+\]\s+/.test(line))
    .map(line => line.replace(/^\[?(\d+)\]?[.)]?\s+/, '').trim())
    .filter(Boolean);
}

function cleanMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();
}

function statusMarkup(label, state = 'good') {
  return `<span class="dot ${state}"></span>${escapeHtml(label)}`;
}

function renderTopThree(md) {
  const block = firstCodeBlock(section(md, 'Current Top 3'));
  const items = numberedLines(block).slice(0, 3);
  els.topThree.classList.remove('skeleton-list');
  els.topThree.innerHTML = items.length
    ? items.map(item => `<li>${escapeHtml(cleanMarkdown(item))}</li>`).join('')
    : '<li>Current Top 3 not found in source.</li>';
}

function renderFronts(md) {
  const block = firstCodeBlock(section(md, 'Current Strategic Fronts'));
  const items = numberedLines(block).slice(0, 3);
  els.fronts.innerHTML = items.length
    ? items.map((item, i) => `
      <div class="front">
        <span class="front-index">FRONT 0${i + 1}</span>
        ${escapeHtml(cleanMarkdown(item))}
      </div>`).join('')
    : '<div class="front">Strategic fronts not found in source.</div>';
}

function renderBuildGate(md) {
  const current = firstCodeBlock(section(md, 'Current System Build Gate'));
  const dev = firstCodeBlock(section(md, 'Active LUMAN Development Gate'));
  const content = [current, dev].filter(Boolean).join('\n\n');
  els.buildGate.classList.remove('skeleton');
  els.buildGate.textContent = content || 'No current HUD development gate found.';

  const sync = md.match(/Last synchronized:\s*([^\n]+)/i)?.[1]?.trim();
  const freshness = md.match(/Freshness basis:\s*([^\n]+)/i)?.[1]?.trim();
  els.lastSync.textContent = sync
    ? `Source synchronized ${sync}${freshness ? ` · ${freshness}` : ''}`
    : 'Live raw-source read';
}

function parseProjectRows(md) {
  const rows = md.split('\n').filter(line => /^\|\s*[A-Z]+-\d+\s*\|/.test(line));
  return rows.map(line => {
    const cells = line.split('|').slice(1, -1).map(cell => cleanMarkdown(cell.trim()));
    return {
      id: cells[0] || '',
      domain: cells[1] || '',
      name: cells[2] || '',
      state: cells[3] || '',
      source: cells[4] || '',
      nextGate: cells[5] || '',
    };
  });
}

function renderProjects(md) {
  const priorityIds = ['SYS-009', 'MUSIC-002', 'BOOK-003', 'LIFE-001', 'BOOK-009', 'BOOK-002'];
  const all = parseProjectRows(md);
  const chosen = priorityIds
    .map(id => all.find(project => project.id === id))
    .filter(Boolean);

  const fallback = all.filter(project => /Active|Foundation/.test(project.state)).slice(0, 6);
  const projects = chosen.length >= 4 ? chosen : fallback;

  els.projects.innerHTML = projects.length
    ? projects.map(project => `
      <article class="project-card">
        <div class="project-id">${escapeHtml(project.id)} · ${escapeHtml(project.domain)}</div>
        <div class="project-name">${escapeHtml(project.name)}</div>
        <div class="project-state">${escapeHtml(project.state)}</div>
        <div class="project-gate">${escapeHtml(project.nextGate)}</div>
      </article>`).join('')
    : '<div class="project-card">No active projects parsed.</div>';
}

function parseLoops(md) {
  const lines = md.split('\n');
  const results = [];
  let currentH3 = '';
  let inCurrent = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (/^##\s+Current Open Loops/i.test(line)) {
      inCurrent = true;
      continue;
    }
    if (inCurrent && /^##\s+/.test(line)) break;
    if (!inCurrent) continue;
    if (/^###\s+/.test(line)) {
      currentH3 = line.replace(/^###\s+/, '').trim();
      continue;
    }
    const match = line.match(/^\d+\.\s+(.+)/);
    if (match && currentH3 && !/Remaining Legacy-Surface Cleanup/i.test(currentH3)) {
      results.push({ section: currentH3, text: cleanMarkdown(match[1]) });
    }
  }
  return results;
}

function renderLoops(md) {
  const loops = parseLoops(md);
  const preferred = ['LUMAN System Build', 'Human Foundation', 'Visionary Shipping', 'Infinite Bloom Source Codex'];
  const sorted = [
    ...loops.filter(item => preferred.includes(item.section)),
    ...loops.filter(item => !preferred.includes(item.section)),
  ].slice(0, 9);

  els.loops.innerHTML = sorted.length
    ? sorted.map(item => `
      <div class="loop">
        <div class="loop-section">${escapeHtml(item.section)}</div>
        <div class="loop-text">${escapeHtml(item.text)}</div>
      </div>`).join('')
    : '<div class="loop">No public open loops parsed.</div>';
}

function normalizeBridgeUrl(value) {
  const raw = String(value || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('Enter a valid bridge URL.');
  }

  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new Error('Bridge must use HTTPS except for localhost development.');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('Bridge URL must not contain credentials, query parameters, or fragments.');
  }
  return `${url.origin}${url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')}`;
}

function getSavedBridgeUrl() {
  try {
    return normalizeBridgeUrl(localStorage.getItem(BRIDGE_STORAGE_KEY) || '');
  } catch {
    localStorage.removeItem(BRIDGE_STORAGE_KEY);
    return '';
  }
}

function localDayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

function setBridgeDisconnected(message = 'Bridge not connected.') {
  els.privateBrainStatus.innerHTML = statusMarkup('BRIDGE REQUIRED', 'bridge');
  els.calendarStatus.innerHTML = statusMarkup('BRIDGE REQUIRED', 'bridge');
  els.gmailStatus.innerHTML = statusMarkup('BRIDGE REQUIRED', 'bridge');
  els.bridgeIdentity.textContent = 'Not connected';
  els.bridgeMessage.textContent = message;
  els.calendarToday.className = 'live-list muted-empty';
  els.calendarToday.textContent = 'Connect bridge to load today\'s bounded calendar view.';
  els.inboxSignals.className = 'live-list muted-empty';
  els.inboxSignals.textContent = 'Connect bridge to load bounded inbox metadata.';
  els.privateCommitments.className = 'live-list muted-empty';
  els.privateCommitments.textContent = 'Connect bridge to load minimum private open-loop context.';
}

function sourceStateMarkup(source) {
  if (source?.status === 'connected') return statusMarkup('CONNECTED', 'good');
  if (source?.status === 'error') return statusMarkup('SOURCE ERROR', 'bad');
  return statusMarkup('UNAVAILABLE', 'bad');
}

function formatCalendarTime(item) {
  if (!item.start) return 'Time unavailable';
  if (item.all_day) return 'All day';
  const start = new Date(item.start);
  const end = item.end ? new Date(item.end) : null;
  if (Number.isNaN(start.getTime())) return 'Time unavailable';
  const startText = start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const endText = end && !Number.isNaN(end.getTime())
    ? end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';
  return endText ? `${startText}–${endText}` : startText;
}

function formatReceived(value) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function renderBridgeContext(data) {
  els.privateBrainStatus.innerHTML = sourceStateMarkup(data.sources?.private_brain);
  els.calendarStatus.innerHTML = sourceStateMarkup(data.sources?.calendar);
  els.gmailStatus.innerHTML = sourceStateMarkup(data.sources?.gmail);
  els.bridgeIdentity.textContent = data.identity?.email ? `Authenticated · ${data.identity.email}` : 'Authenticated';
  els.bridgeMessage.textContent = `Minimum-data view generated ${new Date(data.generated_at).toLocaleString()}. Nothing from this response is written to public GitHub or browser storage.`;

  const calendar = Array.isArray(data.today?.calendar) ? data.today.calendar : [];
  if (data.sources?.calendar?.status !== 'connected') {
    els.calendarToday.className = 'live-list muted-empty';
    els.calendarToday.textContent = `Calendar source error: ${data.sources?.calendar?.error || 'unavailable'}`;
  } else if (!calendar.length) {
    els.calendarToday.className = 'live-list muted-empty';
    els.calendarToday.textContent = 'No scheduled items returned for today. Free time is not interpreted as unused capacity.';
  } else {
    els.calendarToday.className = 'live-list';
    els.calendarToday.innerHTML = calendar.map(item => `
      <div class="live-item">
        <div class="live-kicker">${escapeHtml(formatCalendarTime(item))}</div>
        <div class="live-title">${escapeHtml(item.title || 'Busy')}</div>
      </div>`).join('');
  }

  const inbox = Array.isArray(data.today?.inbox_signals) ? data.today.inbox_signals : [];
  if (data.sources?.gmail?.status !== 'connected') {
    els.inboxSignals.className = 'live-list muted-empty';
    els.inboxSignals.textContent = `Gmail source error: ${data.sources?.gmail?.error || 'unavailable'}`;
  } else if (!inbox.length) {
    els.inboxSignals.className = 'live-list muted-empty';
    els.inboxSignals.textContent = 'No inbox signals returned by the bounded view.';
  } else {
    els.inboxSignals.className = 'live-list';
    els.inboxSignals.innerHTML = inbox.map(item => `
      <div class="live-item">
        <div class="live-kicker">${escapeHtml(item.sender || 'Sender')} · ${escapeHtml(formatReceived(item.received_at))}</div>
        <div class="live-title">${escapeHtml(item.subject || '(no subject)')}</div>
        <div class="live-meta">${escapeHtml((item.signals || []).join(' · ') || 'metadata signal')} · not human priority authority</div>
      </div>`).join('');
  }

  const commitments = Array.isArray(data.private_minimum?.upcoming_commitments)
    ? data.private_minimum.upcoming_commitments
    : [];
  if (data.sources?.private_brain?.status !== 'connected') {
    els.privateCommitments.className = 'live-list muted-empty';
    els.privateCommitments.textContent = `Private brain source error: ${data.sources?.private_brain?.error || 'unavailable'}`;
  } else if (!commitments.length) {
    els.privateCommitments.className = 'live-list muted-empty';
    els.privateCommitments.textContent = 'No private open-loop commitments returned.';
  } else {
    els.privateCommitments.className = 'live-list';
    els.privateCommitments.innerHTML = commitments.map(item => `
      <div class="live-item">
        <div class="live-kicker">${escapeHtml(item.due_trigger || 'No due trigger')}</div>
        <div class="live-title">${escapeHtml(item.title || 'Private commitment')}</div>
        ${item.next_gate ? `<div class="live-meta">Next gate: ${escapeHtml(item.next_gate)}</div>` : ''}
      </div>`).join('');
  }
}

async function fetchBridgeContext(bridgeUrl) {
  const bounds = localDayBounds();
  const params = new URLSearchParams({ time_min: bounds.timeMin, time_max: bounds.timeMax });
  const response = await fetch(`${bridgeUrl}/v1/context?${params}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    let reason = `bridge_http_${response.status}`;
    if (contentType.includes('application/json')) {
      const body = await response.json().catch(() => ({}));
      if (body?.error) reason = body.error;
    }
    throw new Error(reason);
  }
  if (!contentType.includes('application/json')) throw new Error('bridge_login_required');
  return response.json();
}

async function refreshBridge() {
  const bridgeUrl = getSavedBridgeUrl();
  els.bridgeUrl.value = bridgeUrl;
  if (!bridgeUrl) {
    setBridgeDisconnected('Bridge not configured. Enter the protected Worker URL to connect private/live context.');
    return false;
  }

  els.privateBrainStatus.innerHTML = statusMarkup('CHECKING', 'pending');
  els.calendarStatus.innerHTML = statusMarkup('CHECKING', 'pending');
  els.gmailStatus.innerHTML = statusMarkup('CHECKING', 'pending');
  els.bridgeIdentity.textContent = 'Authenticating…';
  els.bridgeMessage.textContent = 'Reading minimum-data context through authenticated bridge…';

  try {
    const data = await fetchBridgeContext(bridgeUrl);
    renderBridgeContext(data);
    return true;
  } catch (error) {
    const reason = String(error?.message || error || 'bridge_unavailable');
    els.privateBrainStatus.innerHTML = statusMarkup('UNAVAILABLE', 'bad');
    els.calendarStatus.innerHTML = statusMarkup('UNAVAILABLE', 'bad');
    els.gmailStatus.innerHTML = statusMarkup('UNAVAILABLE', 'bad');
    els.bridgeIdentity.textContent = 'Authentication needed';
    els.bridgeMessage.textContent = reason === 'bridge_login_required' || reason === 'authentication_required'
      ? 'Cloudflare Access authentication is required. Use “Open Access Login,” authenticate, then refresh.'
      : `Bridge unavailable: ${reason}. No private/live data was substituted or guessed.`;
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function refresh() {
  els.refreshBtn.disabled = true;
  els.refreshBtn.textContent = 'Refreshing…';
  els.publicBrainStatus.innerHTML = statusMarkup('CHECKING', 'pending');
  els.constitutionStatus.innerHTML = statusMarkup('CHECKING', 'pending');

  const results = await Promise.allSettled([
    fetchText(SOURCES.priorities),
    fetchText(SOURCES.loops),
    fetchText(SOURCES.registry),
    fetchText(SOURCES.constitution),
  ]);

  const [priorities, loops, registry, constitution] = results;

  if (priorities.status === 'fulfilled') {
    renderTopThree(priorities.value);
    renderFronts(priorities.value);
    renderBuildGate(priorities.value);
    els.publicBrainStatus.innerHTML = statusMarkup('CONNECTED', 'good');
    els.freshnessBadge.textContent = 'Live public source';
  } else {
    els.publicBrainStatus.innerHTML = statusMarkup('UNAVAILABLE', 'bad');
    els.freshnessBadge.textContent = 'Source error';
    els.buildGate.textContent = 'Unable to read current public operating state.';
  }

  if (loops.status === 'fulfilled') renderLoops(loops.value);
  else els.loops.innerHTML = '<div class="loop">Open-loop source unavailable.</div>';

  if (registry.status === 'fulfilled') renderProjects(registry.value);
  else els.projects.innerHTML = '<div class="project-card">Project Registry unavailable.</div>';

  if (constitution.status === 'fulfilled') {
    const active = /Human Sovereignty Constitution/i.test(constitution.value);
    els.constitutionStatus.innerHTML = statusMarkup(active ? 'ACTIVE' : 'LOADED', 'good');
  } else {
    els.constitutionStatus.innerHTML = statusMarkup('UNAVAILABLE', 'bad');
  }

  const bridgeConnected = await refreshBridge();
  const failed = results.filter(result => result.status === 'rejected').length;
  els.sourceFooter.textContent = failed
    ? `Public source read completed with ${failed} error(s). Bridge ${bridgeConnected ? 'connected' : 'not connected'}.`
    : `Public state: live GitHub main · Private/live bridge: ${bridgeConnected ? 'authenticated minimum-data context connected' : 'not connected'}.`;

  els.refreshBtn.disabled = false;
  els.refreshBtn.textContent = 'Refresh Sources';
}

function prepareCommand(command) {
  const value = command.trim();
  if (!value) return;
  els.askInput.value = value;
  els.commandOutput.innerHTML = `<strong>Prepared:</strong> ${escapeHtml(value)} · Run this through connected LUMAN/ChatGPT to execute with private and live-source authority.`;
  navigator.clipboard?.writeText(value).catch(() => {});
  els.askInput.focus();
  els.askInput.setSelectionRange(value.length, value.length);
}

document.querySelectorAll('.command').forEach(button => {
  button.addEventListener('click', () => prepareCommand(button.dataset.command || ''));
});

els.askForm.addEventListener('submit', event => {
  event.preventDefault();
  prepareCommand(els.askInput.value);
});

els.refreshBtn.addEventListener('click', refresh);

els.connectBridgeBtn.addEventListener('click', async () => {
  try {
    const url = normalizeBridgeUrl(els.bridgeUrl.value);
    if (!url) throw new Error('Enter a bridge URL.');
    localStorage.setItem(BRIDGE_STORAGE_KEY, url);
    els.bridgeUrl.value = url;
    await refreshBridge();
  } catch (error) {
    els.bridgeMessage.textContent = String(error?.message || error);
  }
});

els.bridgeLoginBtn.addEventListener('click', () => {
  try {
    const url = normalizeBridgeUrl(els.bridgeUrl.value || getSavedBridgeUrl());
    if (!url) throw new Error('Enter a bridge URL first.');
    window.open(`${url}/health`, '_blank', 'noopener,noreferrer');
    els.bridgeMessage.textContent = 'Access login opened in a new tab. After authentication succeeds, return here and refresh sources.';
  } catch (error) {
    els.bridgeMessage.textContent = String(error?.message || error);
  }
});

els.disconnectBridgeBtn.addEventListener('click', () => {
  localStorage.removeItem(BRIDGE_STORAGE_KEY);
  els.bridgeUrl.value = '';
  setBridgeDisconnected('Bridge disconnected. In-page private/live context has been cleared.');
});

els.bridgeUrl.value = getSavedBridgeUrl();
refresh();
