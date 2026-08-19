import { createRemoteJWKSet, jwtVerify } from 'jose';
import bridge from './index.js';

const jwksByTeamDomain = new Map();

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return bridge.fetch(request, env, ctx);
    }

    const access = await validateCloudflareAccess(request, env);
    if (!access.ok) {
      return accessError(request, env, access.error, access.status);
    }

    if (access.localBypass) {
      return bridge.fetch(request, env, ctx);
    }

    const headers = new Headers(request.headers);
    headers.set('Cf-Access-Authenticated-User-Email', access.email);
    headers.set('X-Luman-Access-Validated', 'true');

    return bridge.fetch(new Request(request, { headers }), env, ctx);
  },
};

async function validateCloudflareAccess(request, env) {
  const url = new URL(request.url);
  const required = String(env.REQUIRE_CF_ACCESS ?? 'true').toLowerCase() !== 'false';
  const isLocalDev = ['127.0.0.1', 'localhost'].includes(url.hostname);

  if (!required) {
    if (isLocalDev) return { ok: true, localBypass: true };
    return { ok: false, status: 403, error: 'access_required_in_production' };
  }

  const teamDomain = normalizeTeamDomain(env.TEAM_DOMAIN);
  const policyAud = String(env.POLICY_AUD || '').trim();

  if (!teamDomain || !policyAud) {
    return { ok: false, status: 503, error: 'access_validation_not_configured' };
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion') || '';
  if (!token) {
    return { ok: false, status: 401, error: 'access_jwt_required' };
  }

  try {
    const jwks = getRemoteJwks(teamDomain);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: teamDomain,
      audience: policyAud,
    });

    const email = String(payload.email || '').trim();
    if (!email) {
      return { ok: false, status: 403, error: 'access_identity_missing' };
    }

    const injectedEmail = String(
      request.headers.get('Cf-Access-Authenticated-User-Email') || ''
    ).trim();

    if (injectedEmail && injectedEmail.toLowerCase() !== email.toLowerCase()) {
      return { ok: false, status: 403, error: 'access_identity_mismatch' };
    }

    return { ok: true, email };
  } catch {
    return { ok: false, status: 403, error: 'access_jwt_invalid' };
  }
}

function getRemoteJwks(teamDomain) {
  if (!jwksByTeamDomain.has(teamDomain)) {
    const certsUrl = new URL('/cdn-cgi/access/certs', teamDomain);
    jwksByTeamDomain.set(teamDomain, createRemoteJWKSet(certsUrl));
  }
  return jwksByTeamDomain.get(teamDomain);
}

function normalizeTeamDomain(value) {
  let raw = String(value || '').trim().replace(/\/+$/, '');
  if (!raw) return '';
  if (!/^https:\/\//i.test(raw)) raw = `https://${raw}`;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) return '';
    if (url.pathname && url.pathname !== '/') return '';
    return url.origin;
  } catch {
    return '';
  }
}

function accessError(request, env, error, status) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = String(env.HUD_ORIGIN || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return new Response(JSON.stringify({ error }), { status, headers });
}
