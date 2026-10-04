// Online rooms for Trifecta. Cloudflare Pages Function backed by D1 (binding name: DB).
import * as E from '../../game.js';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});

async function ensureTable(DB) {
  await DB.prepare(
    'CREATE TABLE IF NOT EXISTS trifecta_rooms (code TEXT PRIMARY KEY, state TEXT NOT NULL, ver INTEGER NOT NULL, updated INTEGER NOT NULL)'
  ).run();
}

const cleanName = (s, fallback) => {
  const t = String(s || '').replace(/[^\p{L}\p{N} _.'-]/gu, '').trim().slice(0, 14);
  return t || fallback;
};

function viewFor(s, idx, now) {
  const v = JSON.parse(JSON.stringify(s));
  delete v._t;
  if (v.phase === 'pick') {
    v.valid = {};
    for (const k of E.ALL_SLOTS) if (s.claims[k] === undefined || s.claims[k] === idx) v.valid[k] = E.validValues(s, idx, k);
    for (const k of Object.keys(v.crit)) {
      if (v.claims[k] !== idx) v.crit[k] = true; // other players' choices stay hidden until everyone has chosen
    }
  }
  v.you = idx;
  v.now = now;
  return v;
}

async function load(DB, code) {
  const row = await DB.prepare('SELECT state, ver FROM trifecta_rooms WHERE code = ?').bind(code).first();
  if (!row) return null;
  return { s: JSON.parse(row.state), ver: row.ver };
}

async function save(DB, code, s, ver, now) {
  s.v = (s.v || 0) + 1;
  const r = await DB.prepare('UPDATE trifecta_rooms SET state = ?, ver = ver + 1, updated = ? WHERE code = ? AND ver = ?')
    .bind(JSON.stringify(s), now, code, ver).run();
  return (r.meta?.changes ?? 0) > 0;
}

// Run fn(state, now) against the room with optimistic concurrency. fn returns {res, changed}.
async function withRoom(DB, code, fn) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const row = await load(DB, code);
    if (!row) return { res: { ok: false, error: 'noroom' }, s: null };
    const now = Date.now();
    const ticked = E.tick(row.s, now);
    const out = fn(row.s, now);
    if (ticked) out.changed = true;
    if (!out.changed) return { res: out.res, s: row.s, now };
    if (await save(DB, code, row.s, row.ver, now)) return { res: out.res, s: row.s, now };
  }
  return { res: { ok: false, error: 'busy' }, s: null };
}

function tokenIdx(s, token) {
  if (!token) return -1;
  return (s._t || []).indexOf(token);
}

const rid = () => [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, '0')).join('');

export async function onRequest({ request, env }) {
  const DB = env.DB;
  if (!DB) return json({ ok: false, error: 'nodb', message: 'D1 binding "DB" is missing on this Pages project.' }, 500);
  await ensureTable(DB);
  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      const code = (url.searchParams.get('code') || '').toUpperCase();
      const token = url.searchParams.get('token');
      const since = Number(url.searchParams.get('v') || -1);
      const { res, s, now } = await withRoom(DB, code, (st) => ({ res: null, changed: false }));
      if (!s) return json(res || { ok: false, error: 'noroom' });
      const idx = tokenIdx(s, token);
      if (idx < 0) return json({ ok: false, error: 'kicked' });
      if (s.v === since) return json({ ok: true, same: true, now });
      return json({ ok: true, state: viewFor(s, idx, now) });
    }

    const body = await request.json();
    const action = body.action;

    if (action === 'create') {
      const n = body.n === 3 ? 3 : 2;
      const now = Date.now();
      await DB.prepare('DELETE FROM trifecta_rooms WHERE updated < ?').bind(now - 6 * 3600 * 1000).run();
      const pickMs = [5, 7, 15].includes(Number(body.pickSec)) ? Number(body.pickSec) * 1000 : 15000;
      const s = E.newGame({ mode: 'online', players: Array.from({ length: n }, () => ({ name: null })), pickMs });
      const token = rid();
      s.players[0].name = cleanName(body.name, 'Player 1');
      s._t = [token, null, null].slice(0, n);
      for (let tries = 0; tries < 20; tries++) {
        let code = '';
        for (let i = 0; i < 4; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        try {
          await DB.prepare('INSERT INTO trifecta_rooms (code, state, ver, updated) VALUES (?, ?, 0, ?)')
            .bind(code, JSON.stringify(s), now).run();
          return json({ ok: true, code, token, state: viewFor(s, 0, now) });
        } catch (e) { /* code collision, retry */ }
      }
      return json({ ok: false, error: 'busy' });
    }

    const code = String(body.code || '').toUpperCase();

    if (action === 'join') {
      const r = await withRoom(DB, code, (s) => {
        if (s.phase !== 'lobby') return { res: { ok: false, error: 'started' }, changed: false };
        const slot = s.players.findIndex(p => !p.name);
        if (slot < 0) return { res: { ok: false, error: 'full' }, changed: false };
        const token = rid();
        s.players[slot].name = cleanName(body.name, 'Player ' + (slot + 1));
        s._t[slot] = token;
        return { res: { ok: true, token, idx: slot }, changed: true };
      });
      if (!r.res.ok) return json(r.res);
      return json({ ...r.res, code, state: viewFor(r.s, r.res.idx, r.now) });
    }

    const r = await withRoom(DB, code, (s, now) => {
      const me = tokenIdx(s, body.token);
      if (me < 0) return { res: { ok: false, error: 'kicked' }, changed: false };
      switch (action) {
        case 'start': {
          if (me !== 0) return { res: { ok: false, error: 'host' }, changed: false };
          if (s.phase !== 'lobby' || s.players.some(p => !p.name)) return { res: { ok: false, error: 'notready' }, changed: false };
          return { res: E.startGame(s, now), changed: true };
        }
        case 'kick': {
          const t = Number(body.idx);
          if (me !== 0 || s.phase !== 'lobby' || !(t > 0 && t < s.n)) return { res: { ok: false, error: 'host' }, changed: false };
          s.players[t].name = null; s._t[t] = null;
          return { res: { ok: true }, changed: true };
        }
        case 'leave': {
          if (s.phase !== 'lobby' || me === 0) return { res: { ok: true }, changed: false };
          s.players[me].name = null; s._t[me] = null;
          return { res: { ok: true }, changed: true };
        }
        case 'claim': {
          const res = E.claim(s, me, body.slot);
          return { res, changed: res.ok };
        }
        case 'pick': {
          const res = E.pick(s, me, body.slot, body.value, now);
          return { res, changed: res.ok };
        }
        case 'answer': {
          const res = E.answer(s, me, { id: body.id, text: body.text }, now);
          const changed = res.ok; // wrong answers lock the player => state changed
          return { res: res.ok ? { ok: true, correct: res.correct } : res, changed };
        }
        case 'redo': {
          const res = E.redoPick(s, me, now);
          return { res, changed: res.ok };
        }
        case 'autofill': {
          const res = E.fillRandom(s, now);
          return { res, changed: res.ok };
        }
        case 'skip': {
          const res = E.skip(s, me, now);
          return { res, changed: res.ok };
        }
        case 'next': {
          const res = E.next(s, now);
          return { res, changed: res.ok };
        }
        case 'rematch': {
          if (me !== 0 || s.phase !== 'over') return { res: { ok: false, error: 'host' }, changed: false };
          return { res: E.startGame(s, now), changed: true };
        }
        default:
          return { res: { ok: false, error: 'action' }, changed: false };
      }
    });
    if (!r.s) return json(r.res);
    const idx = tokenIdx(r.s, body.token);
    return json({ ...r.res, state: idx >= 0 ? viewFor(r.s, idx, r.now) : undefined });
  } catch (e) {
    return json({ ok: false, error: 'server', message: String(e && e.message || e) }, 500);
  }
}
