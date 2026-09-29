import { onRequest } from './room.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/room') return onRequest({ request, env });
    return env.ASSETS.fetch(request);
  },
};
