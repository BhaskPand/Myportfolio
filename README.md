# Bhaskar Pandit — Personal Portfolio

Live at: `https://bhaskarpandit.in`

A fast, responsive, single‑page portfolio site showcasing projects, experience, skills, and contact links. Built as a static site with Tailwind CDN and a small amount of vanilla JavaScript for delightful animations.

## Highlights
- Modern glass/gradient design with subtle grain and floating blobs
- Light/Dark theme with system detection and persistent toggle
- Section reveal on scroll and interactive project card tilt
- Accessible color contrast and mobile‑first responsive layout
- Simple image carousel for the Moments section

## Tech
- HTML, CSS (custom + Tailwind via CDN)
- Vanilla JavaScript (no framework, no build step)
- Deployed with GitHub Pages + custom domain (`CNAME`)

## Quick Start (Local)
```bash
# Clone your repo
git clone <your-repo-url>
cd Myportfolio

# Open in a browser (macOS)
open index.html
```
No build or install required.

## Project Structure
```
Myportfolio/
  ├─ index.html         # Main page (sections + carousel script inline)
  ├─ styles.css         # Design tokens, themes, glass UI, animations
  ├─ script.js          # Reveal-on-scroll, tilt, nav active, theme toggle
  ├─ profile-photo.jpg  # Profile image (with fallback)
  ├─ resume.pdf         # Resume link (served via GitHub Pages)
  ├─ CNAME              # Custom domain mapping -> bhaskarpandit.in
  └─ (optional) moments/ # Your personal photos for carousel
```

## Customize
- Colors/Themes: edit CSS variables in `styles.css` under `:root` (light) and `.dark` (dark)
- Add/Remove sections: update `index.html`
- Carousel photos: place images in `moments/` and wire them in the carousel array (or keep placeholders)

## Deployment
This site is deployed via GitHub Pages with a custom domain.
- Ensure `CNAME` contains `bhaskarpandit.in`
- Push changes to `main`; Pages will serve the updated site
- DNS should have an A/ALIAS or CNAME pointing to GitHub Pages per GitHub docs

## License
All rights reserved. Feel free to reference the structure and styles, but please do not copy personal content and assets.

