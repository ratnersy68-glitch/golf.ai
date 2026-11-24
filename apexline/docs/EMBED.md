# Embedding APEXLINE in Google Sites

Google Sites cannot host the game's files; it can only embed a page that is already online. So: (1) host `dist/` somewhere, (2) embed that URL.

## 1. Host it (free)
**GitHub Pages:** repo Settings → Pages → Source: *GitHub Actions*, merge this branch to `main`; `.github/workflows/apexline-pages.yml` builds and publishes. URL: `https://<user>.github.io/<repo>/`.
**Or** drag the `apexline/dist` folder (after `npm run build`) onto Netlify Drop / Cloudflare Pages. The build uses relative paths, so any sub-path works.

## 2. Embed
Google Sites → Insert → **Embed** → *Embed code* tab → paste (replace the URL), then resize the block as large as possible (full-width section):

```html
<iframe src="https://YOUR-HOST/YOUR-PATH/" title="APEXLINE"
  style="position:absolute;inset:0;width:100%;height:100%;border:0;background:#101216"
  allow="fullscreen; gamepad; autoplay; accelerometer" allowfullscreen loading="lazy"></iframe>
```
(or `width="100%" height="700"` instead of the style attribute for a fixed-height block).

## Fullscreen
Press **F** or use the button at the bottom-right (top-right while racing); Settings → Gameplay also has it. It works inside the embed because of `allowfullscreen`.

## Notes
* Click the game once so the browser lets audio start and keys reach the iframe.
* Saves are stored per browser *for the hosting origin*; embedding doesn't change that.
* If the browser blocks IndexedDB inside the embed (some privacy settings), progress falls back to localStorage, else it won't persist; use Settings → Export save.
