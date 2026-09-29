# Trifecta

Football clue game. Two or three players choose a club, a country or a position at the same time,
then race to name a footballer who fits every clue. Ten rounds, most points wins.

Files
index.html             the page and its styling
app.js                 the screens and the QR code maker
game.js                the footballer database and the game rules (used by the page and by room.js)
functions/api/room.js  online rooms (Cloudflare Pages Function using a D1 database bound as DB)

Deploy: connect this repo to Cloudflare Pages with no build command. For online mode add a D1 binding named DB and redeploy.
