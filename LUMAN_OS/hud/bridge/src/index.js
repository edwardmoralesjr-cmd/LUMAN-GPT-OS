const DEFAULT_PRIVATE_REPO = 'edwardmoralesjr-cmd/LUMAN-GPT-Command-Center';
const DEFAULT_PRIVATE_OPEN_LOOPS_PATH = 'LUMAN_PRIVATE_VAULT/STATE/OPEN_LOOPS.md';
const BRIDGE_VERSION = '1.0';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = buildCors(request, env);

    if (request.method === 'OPTIONS') {
      if (!cors.allowed) return json({ error: 'origin_not_allowed' }, 403, cors.headers);
      return new Response(null, { status: 204, headers: cors.headers });
    }

    if (!cors.allowed) return json({ error: 'origin_not_allowed' }, 403, cors.headers);

    const identity = authorize(request, env, url);
    if (!identity.ok) return json({ error: identity.error }, identity.status, cors.headers);

    if (request.method !== 'GET') {
      return json({ error: 'read_only_bridge' }, 405, cors.headers);
    }

    if (url.pathname === '/health') {
      return json({
        ok: true,
        version: BRIDGE_VERSION,
        authenticated: true,
        identity: maskEmail(identity.email),
        mode: 'read-only',
      }, 200, cors.headers);
    }

    if (url.pathname === '/v1/context') {
      const bounds = parseWindow(url);
      if (!bounds.ok) return json({ error: bounds.error }, 400, cors.headers);

      const [privateBrain, calendar, gmail] = await Promise.all([
        sourceResult('private_brain', () => getPrivateOpenLoops(env)),
        sourceResult('calendar', () => getCalendarContext(env, bounds)),
        sourceResult('gmail', () => getInboxSignals(env)),
      ]);

      return json({
        version: BRIDGE_VERSION,
        generated_at: new Date().toISOString(),
        identity: {
          authenticated: true,
          email: maskEmail(identity.email),
        },
        sources: {
          private_brain: sourceStatus(privateBrain),
          calendar: sourceStatus(calendar),
          gmail: sourceStatus(gmail),
        },
        today: {
          calendar: calendar.ok ? calendar.value : [],
          inbox_signals: gmail.ok ? gmail.value : [],
        },
        private_minimum: {
          upcoming_commitments: privateBrain.ok ? privateBrain.value : [],
        },
        authority_note: 'Bridge ranking and display order are context aids, not human priority authority.',
      }, 200, cors.headers);
    }

    return json({ error: 'not_found' }, 404, cors.headers);
  },
};

function buildCors(request, env) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = String(env.HUD_ORIGIN || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

  const allowed = !origin || allowedOrigins.includes(origin);
  const headers = {
    'Vary': 'Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  };

  if (origin && allowed) headers['Access-Control-Allow-Origin'] = origin;
  return { allowed, headers };
}

function authorize(request, env, url) {
  const accessEmail = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  const required = String(env.REQUIRE_CF_ACCESS ?? 'true').toLowerCase() !== 'false';
  const isLocalDev = ['127.0.0.1', 'localhost'].includes(url.hostname);
  const devEmail = String(env.DEV_AUTH_EMAIL || '').trim();

  let email = accessEmail.trim();
  if (!email && !required && isLocalDev && devEmail) email = devEmail;

  if (!email) return { ok: false, status: 401, error: 'authentication_required' };

  const allowedEmails = String(env.ALLOWED_EMAIL || '')
    .split(',')
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length && !allowedEmails.includes(email.toLowerCase())) {
    return { ok: false, status: 403, error: 'identity_not_allowed' };
  }

  return { ok: true, email };
}

function parseWindow(url) {
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setUTCHours(0, 0, 0, 0);
  const defaultEnd = new Date(defaultStart.getTime() + 24 * 60 * 60 * 1000);

  const start = url.searchParams.get('time_min') ? new Date(url.searchParams.get('time_min')) : defaultStart;
  const end = url.searchParams.get('time_max') ? new Date(url.searchParams.get('time_max')) : defaultEnd;

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: 'invalid_time_window' };
  }
  if (end <= start) return { ok: false, error: 'invalid_time_window' };
  if (end.getTime() - start.getTime() > 48 * 60 * 60 * 1000) {
    return { ok: false, error: 'time_window_too_large' };
  }

  return { ok: true, start: start.toISOString(), end: end.toISOString() };
}

async function sourceResult(name, fn) {
  try {
    return { ok: true, name, value: await fn() };
  } catch (error) {
    return {
      ok: false,
      name,
      error: safeErrorCode(error),
    };
  }
}

function sourceStatus(result) {
  return result.ok
    ? { status: 'connected' }
    : { status: 'error', error: result.error };
}

async function getPrivateOpenLoops(env) {
  requireEnv(env, 'GITHUB_PRIVATE_TOKEN');
  const repo = env.PRIVATE_REPO || DEFAULT_PRIVATE_REPO;
  const path = env.PRIVATE_OPEN_LOOPS_PATH || DEFAULT_PRIVATE_OPEN_LOOPS_PATH;
  const url = `https://api.github.com/repos/${repo}/contents/${encodePath(path)}?ref=main`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_PRIVATE_TOKEN}`,
      'Accept': 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'LUMAN-Minimum-Data-Bridge',
    },
  });

  if (!response.ok) throw new Error(`private_github_${response.status}`);
  const markdown = await response.text();
  return parsePrivateOpenLoops(markdown).slice(0, 6);
}

function parsePrivateOpenLoops(markdown) {
  const lines = markdown.split('\n');
  const items = [];
  let current = null;
  let activeSection = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (/^##\s+Active Open Loops/i.test(line)) {
      activeSection = true;
      continue;
    }
    if (activeSection && /^##\s+/.test(line)) break;
    if (!activeSection) continue;

    const item = line.match(/^-\s*\[\s\]\s+(.+)/);
    if (item) {
      if (current) items.push(current);
      current = {
        title: cleanText(item[1], 140),
        next_gate: '',
        due_trigger: '',
      };
      continue;
    }

    if (!current) continue;
    const next = line.match(/^Next gate:\s*(.+)/i);
    const due = line.match(/^Due\/trigger:\s*(.+)/i);
    if (next) current.next_gate = cleanText(next[1], 180);
    if (due) current.due_trigger = cleanText(due[1], 120);
  }

  if (current) items.push(current);
  return items;
}

async function getCalendarContext(env, bounds) {
  const accessToken = await getGoogleAccessToken(env);
  const params = new URLSearchParams({
    timeMin: bounds.start,
    timeMax: bounds.end,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '8',
    fields: 'items(id,summary,start,end,status)',
  });

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error(`calendar_${response.status}`);
  const data = await response.json();

  return (data.items || [])
    .filter(event => event.status !== 'cancelled')
    .map(event => ({
      id: opaqueId(event.id || ''),
      title: cleanText(event.summary || 'Busy', 120),
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      all_day: Boolean(event.start?.date && !event.start?.dateTime),
    }));
}

async function getInboxSignals(env) {
  const accessToken = await getGoogleAccessToken(env);
  const query = 'newer_than:7d in:inbox -category:promotions -in:spam -in:trash';
  const params = new URLSearchParams({
    q: query,
    maxResults: '20',
    fields: 'messages(id,threadId)',
  });

  const listResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!listResponse.ok) throw new Error(`gmail_list_${listResponse.status}`);
  const list = await listResponse.json();
  const ids = (list.messages || []).slice(0, 20);

  const metadata = await Promise.all(ids.map(message => getGmailMetadata(accessToken, message.id)));
  return metadata
    .filter(Boolean)
    .map(rankInboxSignal)
    .sort((a, b) => b.attention_score - a.attention_score || Date.parse(b.received_at) - Date.parse(a.received_at))
    .slice(0, 6)
    .map(({ attention_score, ...item }) => item);
}

async function getGmailMetadata(accessToken, id) {
  const params = new URLSearchParams();
  params.set('format', 'metadata');
  params.append('metadataHeaders', 'From');
  params.append('metadataHeaders', 'Subject');
  params.append('metadataHeaders', 'Date');
  params.set('fields', 'id,labelIds,internalDate,payload(headers)');

  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(id)}?${params}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;
  const data = await response.json();
  const headers = Object.fromEntries((data.payload?.headers || []).map(h => [String(h.name).toLowerCase(), h.value]));

  return {
    id: opaqueId(data.id || ''),
    sender: minimizeSender(headers.from || ''),
    subject: cleanText(headers.subject || '(no subject)', 160),
    received_at: data.internalDate ? new Date(Number(data.internalDate)).toISOString() : safeDate(headers.date),
    labels: Array.isArray(data.labelIds) ? data.labelIds : [],
  };
}

function rankInboxSignal(message) {
  const subject = message.subject.toLowerCase();
  const signals = [];
  let score = 0;

  if (message.labels.includes('UNREAD')) {
    signals.push('unread');
    score += 1;
  }
  if (message.labels.includes('IMPORTANT')) {
    signals.push('gmail-important-label');
    score += 1;
  }

  const actionTerms = ['action required', 'verify', 'verification', 'security', 'password', 'payment', 'invoice', 'deadline', 'respond', 'reply', 'review', 'approval', 'failed', 'error', 'alert'];
  if (actionTerms.some(term => subject.includes(term))) {
    signals.push('subject-action-signal');
    score += 2;
  }

  return {
    id: message.id,
    sender: message.sender,
    subject: message.subject,
    received_at: message.received_at,
    signals,
    attention_score: score,
    priority_authority: false,
  };
}

async function getGoogleAccessToken(env) {
  requireEnv(env, 'GOOGLE_CLIENT_ID');
  requireEnv(env, 'GOOGLE_CLIENT_SECRET');
  requireEnv(env, 'GOOGLE_REFRESH_TOKEN');

  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) throw new Error(`google_token_${response.status}`);
  const data = await response.json();
  if (!data.access_token) throw new Error('google_token_missing');
  return data.access_token;
}

function minimizeSender(raw) {
  const value = String(raw || '').trim();
  const display = value.match(/^\s*"?([^"<]+?)"?\s*</)?.[1]?.trim();
  if (display) return cleanText(display, 80);
  const email = value.match(/<?([^<>\s]+@[^<>\s]+)>?/i)?.[1] || '';
  if (email.includes('@')) return `@${email.split('@').pop().toLowerCase()}`;
  return cleanText(value || 'unknown sender', 80);
}

function cleanText(value, max) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function safeDate(value) {
  const date = new Date(value || '');
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function opaqueId(value) {
  if (!value) return '';
  let hash = 2166136261;
  for (const ch of String(value)) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `ctx_${(hash >>> 0).toString(16)}`;
}

function encodePath(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
}

function requireEnv(env, key) {
  if (!env[key]) throw new Error(`missing_${key.toLowerCase()}`);
}

function safeErrorCode(error) {
  const value = String(error?.message || error || 'source_error');
  if (/^missing_[a-z0-9_]+$/i.test(value)) return value;
  if (/^(private_github|calendar|gmail_list|google_token)_\d+$/.test(value)) return value;
  if (/^google_token_missing$/.test(value)) return value;
  return 'source_unavailable';
}

function maskEmail(email) {
  const [local, domain] = String(email || '').split('@');
  if (!local || !domain) return 'authenticated';
  return `${local.slice(0, 1)}***@${domain}`;
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders,
    },
  });
}
