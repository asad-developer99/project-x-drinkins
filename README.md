# Drinkins — Crimson Fermentation

A scroll-driven landing page for a craft drink brand, built with **GSAP + ScrollTrigger**. A hero bottle follows the visitor down the page, pinning and tilting from section to section, while a one-click **theme switch** swaps the entire look (colors, font and bottle image) between two brand identities.

**Live site:** [https://project-drinkins.vercel.app/](https://project-drinkins.vercel.app/)

---

## Features

- **Two-in-one theme switch** — a button in the navigation toggles between:
  - **Forest** (default): green palette, Inter typeface, green bottle
  - **Amber**: orange and cream palette, DM Sans typeface, amber bottle
  - The choice is remembered between visits and applied before first paint, so there is no flash of the wrong theme.
- **Scroll-choreographed bottle** — the hero bottle is pinned and animated across sections, changing position, rotation and scale as you scroll.
- **Professional preloader** — waits for every image, the custom font and the page `load` event, shows real progress with a percentage counter, then wipes away as the hero intro begins. Includes a minimum display time, a 15-second safety timeout and a failsafe if the script fails to start.
- **Hero intro timeline** — outlined headline that fills in, staggered line reveals, bottle fade-in and a stamp "thud" effect.
- **Responsive** — desktop uses the full scroll choreography; mobile uses a simplified layout with a hamburger menu.
- **Zero build step** — plain HTML, CSS and JavaScript. Open it or drop it on any static host.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3 (custom properties for theming) |
| Scripting | Vanilla JavaScript |
| Animation | [GSAP 3.13](https://gsap.com/) + ScrollTrigger (via jsDelivr CDN) |
| Fonts | Veneer (local), Inter and DM Sans (Google Fonts) |

## Project Structure

```
.
├── index.html          # Page markup, preloader, theme toggle
├── style.css           # Styles, theme variables, preloader styles
├── main.js             # Theme logic, preloader, GSAP timelines
├── Veneer.woff         # Display typeface
├── bottle-green.png    # Bottle image (Forest theme)
├── bottle-amber.png    # Bottle image (Amber theme)
├── stamp.png           # Hero stamp
└── first-batch.png     # Timeline image
```

## Getting Started

**Prerequisite:** none — a modern browser is all you need.

```bash
# Option 1: open directly
open index.html

# Option 2: serve locally (recommended)
npx serve .
# or
python3 -m http.server 8000
```

Then visit the address shown in your terminal.

## Customization

### Theme colors

All colors live in CSS variables at the top of `style.css`. The Forest theme is defined on `:root` and the Amber theme overrides it:

```css
:root {
  --sienna: #1B4332;       /* primary */
  --sienna-2: #0F3623;     /* footer / dark accent */
  --tan: #D4AF37;          /* borders and accents */
  --papaya-whip: #E8F1E8;  /* background */
}

:root[data-theme="amber"] {
  --sienna: #b1560e;
  --sienna-2: #92633a;
  --tan: #c19f7a;
  --papaya-whip: #eae0c7;
}
```

### Bottle path on scroll

The bottle's journey is defined in `main.js` inside `setupScrollAnimations()`. Each `pinAndAnimate({...})` call is one stop on the path:

| To change | Edit |
| --- | --- |
| Horizontal position | `x` on `.hero-bottle-wrapper` (for example `"30%"` or `"-25%"`) |
| Vertical position | add `y` next to `x` |
| Tilt | `rotate` on `.hero-bottle` (degrees) |
| Size | `scale` on `.hero-bottle` |
| Where a move starts and ends | `trigger` and `endTrigger` (any section selector) |

Add another stop by copying a `pinAndAnimate` block and pointing it at new sections.

### Preloader

In `runPreloader()` in `main.js`:

- `1400` — minimum display time in milliseconds
- `15000` — safety timeout in milliseconds

Styling is in the `PRELOADER` section at the bottom of `style.css`.

### Adding a third theme

1. Add a `:root[data-theme="yourtheme"]` block in `style.css` with the four color variables and `--font-body`.
2. Add a matching bottle image and `<img>` in the hero wrapper.
3. Extend `applyTheme()` in `main.js` to cycle through the themes.

## Deployment

This is a static site, so it works on any static host.

### Vercel

1. Push the files to a Git repository.
2. Import the repository in Vercel.
3. Set **Framework Preset** to **Other**.
4. Leave **Build Command** empty and set **Output Directory** to `.`
5. Deploy.

### Netlify / GitHub Pages / any static host

Upload the project folder as-is. All asset paths are relative, so it works from the site root or a sub-path.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Preloader stuck at 0% | `main.js` is not loading or errored. Check the browser Console and Network tab, then hard refresh. |
| Blank page with `404` errors for JS/CSS | The host is serving the wrong build or a wrong base path. Deploy as a plain static site. |
| Bottle does not move on scroll | GSAP or ScrollTrigger failed to load from the CDN. Check your network or self-host the scripts. |
| Wrong fonts | Google Fonts blocked or offline. The page falls back to system fonts. |

## Browser Support

Current versions of Chrome, Edge, Firefox and Safari. The preloader uses CSS `clip-path` and `color-mix()`, which are supported in all current evergreen browsers.



## License

Released under the [MIT License](LICENSE). The brand names, bottle artwork and imagery are demonstration assets; replace them with your own before using this commercially.
