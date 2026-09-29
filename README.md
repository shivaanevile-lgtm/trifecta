# Trifecta

Football clue game. Two or three players choose a club, a country or a position at the same time,
then race to name a footballer who fits every clue. Ten rounds, most points wins.

Files
wrangler.jsonc     Worker config (static assets, D1 binding DB)
src/worker.js      Worker entry: sends /api/room to room.js, everything else to the static files
src/room.js       online rooms (D1 database)
public/index.html  the page and its styling
public/app.js      the screens and the QR code maker
public/game.js     the footballer database and the game rules (used by the page and by room.js)

Deploy: Cloudflare Workers, import this repo, deploy command `npx wrangler deploy`.
The D1 binding comes from wrangler.jsonc (change database_id if you use another database).
The earlier Cloudflare Pages version is in git history at commit 05de9e6.
