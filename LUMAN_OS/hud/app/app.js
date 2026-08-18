const REPO_RAW = 'https://raw.githubusercontent.com/edwardmoralesjr-cmd/LUMAN-GPT-OS/main/';

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
  return `<span class="dot ${state}"></span>${label}`;
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

  const failed = results.filter(result => result.status === 'rejected').length;
  els.sourceFooter.textContent = failed
    ? `Public source read completed with ${failed} error(s). Private/live sources still require authenticated LUMAN bridge.`
    : 'Public state source: live GitHub main branch · Private, Calendar, and Gmail sources require authenticated LUMAN bridge.';

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

refresh();
