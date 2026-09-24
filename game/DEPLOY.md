# Deploying Golf.ai to a real web address (Netlify)

The game is a plain static website: HTML, CSS, one JavaScript file and some images. Netlify hosts sites like this for free and gives you an HTTPS address like `https://golf-ai-championship.netlify.app` that opens in Safari on your iPhone.

Everything Netlify needs is already in the repository:

| File | What it does |
| --- | --- |
| `netlify.toml` (repo root) | Tells Netlify to build the `game/` folder and publish `game/site/` |
| `game/tools/build.mjs` | Production build: bundles the game and copies it into `game/site/` |
| `game/tools/deploy.mjs` | One-command deploy from your computer (option B below) |
| `game/manifest.webmanifest`, `game/sw.js`, `game/icons/` | Home-screen app support and offline caching |

---

## Option A — connect GitHub to Netlify (recommended, one-time, ~2 minutes)

After this, **every push to GitHub updates the live game automatically**. You never rebuild anything yourself.

1. Go to **https://app.netlify.com** and sign up (free) with **"Sign up with GitHub"**.
2. Click **Add new site → Import an existing project → GitHub**.
3. Choose the repository **`golf.ai`**.
4. On the settings screen:
   - **Branch to deploy:** `claude/single-player-golf-game-8o8jhc`. Pick `main` instead once the game has been merged there.
   - Leave every other field as it is. Netlify reads them from `netlify.toml`.
5. Click **Deploy**. About a minute later the site shows **Published**.

### Where is my URL?

At the top of the site's page in Netlify, e.g. `https://random-name-123.netlify.app`.

To get a nicer name, go to **Site configuration → Change site name** and type e.g. `golf-ai-championship`. Your address becomes `https://golf-ai-championship.netlify.app`.

### Updating the live game

Push new commits to the branch you picked. Netlify rebuilds and republishes automatically in about a minute.

---

## Option B — deploy from a terminal with one command

1. Install Node.js 22 or newer from https://nodejs.org.
2. Create a Netlify token: **https://app.netlify.com/user/applications#personal-access-tokens → New access token**.
3. In a terminal:

```bash
cd golf.ai/game
npm install
NETLIFY_AUTH_TOKEN=paste-your-token NETLIFY_SITE_NAME=golf-ai-championship npm run deploy
```

It builds the game, creates the site the first time, uploads it and prints:

```
  ⛳  GAME LIVE

      https://golf-ai-championship.netlify.app

      OPEN GAME →  https://golf-ai-championship.netlify.app
```

The URL is also saved to `game/LIVE_URL.txt`. The site ID is remembered in `game/.netlify-site.json`, so later deploys update the same site:

```bash
NETLIFY_AUTH_TOKEN=paste-your-token npm run deploy
```

---

## Running and building locally

```bash
cd golf.ai/game
npm install          # once
npm run dev          # live-rebuilding dev server at http://localhost:8080
npm run build        # production build into game/site/
npm start            # build, then serve the production site at http://localhost:8080
```

You can also just open `game/index.html` directly in a desktop browser.

---

## Playing on iPhone

1. Open your Netlify URL in **Safari**.
2. Turn the phone **sideways**. The game asks you to rotate if you hold it upright.
3. Optional, for a full-screen app: tap **Share → Add to Home Screen**, then launch **Golf.ai** from your home screen.

iPhone Safari doesn't allow websites to go full screen, so the ⛶ button explains the Home Screen option there. On Android and iPad it switches to real full screen.

**Touch controls:**

| Control | What it does |
| --- | --- |
| **SWING** (bottom right) | Hold to build power, release, then tap again when the marker crosses the green zone. For putts, just hold and release. |
| **‹ club ›** | Change club |
| **⟲ / ⟳ AIM** | Hold to aim left / right, or tap the mini-map to aim at a spot |
| **SHOT** | Shot type, draw/fade, trajectory and spin |
| **VIEW / MAP** | Change camera / overhead map |
| **Drag on the course** | Look around |
| **⛶ ▦ ☰** (top right) | Fullscreen, scorecard, pause menu |

After the first visit the game is cached. If the connection drops you'll see **CONNECTION LOST** and can keep playing.
