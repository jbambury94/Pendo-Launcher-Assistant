# Pendo Launcher Deployment Decision App

A simple web app that helps project managers decide how to configure and deploy the **Pendo Launcher** browser extension. It walks through deployment paths by browser and operating system and lets you weigh the pros and cons of each option.

## What it does

- **Step-based flow** — Intro → Choose browsers → Choose OS → Results. One step at a time; no scrolling to find the next choice.
- **Pre-deploy checklist** — Reminds you to align with dev, security, privacy, and IT before rollout.
- **Browser & OS selection** — Select one or more browsers (Chrome, Edge, Firefox) and one OS (Windows or macOS) to see only relevant deployment methods.
- **Deployment options** — Each option is shown as a card with a short description, pros and cons visible by default, and a **View setup guide** link to the official Pendo support article.
- **Summary links** — After you complete the flow, a “Setup guides for your selection” section lists direct links to each method’s Pendo article.
- **Manual install (testing only)** — Clearly labelled option and link for manual install, with a warning that it’s for testing and demo only, not production.

## How to run

No build step. Open the app in a browser:

1. **From the filesystem**  
   Double-click `index.html` or open it from your browser’s File menu.

2. **With a local server (optional)**  
   From the project root:
   ```bash
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

## Tech stack

- **HTML** — Single page with step panels (intro, browsers, OS, results).
- **CSS** — One stylesheet with Pendo branding (Pank, Blurple, Sora/Inter).
- **JavaScript** — Vanilla JS for step flow, multi-browser/OS selection, option cards, and summary links. No frameworks.

## Version control and branching

- **Default branch** — `main` (or `master`) is the primary branch; production-ready work is merged here.
- **Feature work** — Create a branch for changes (e.g. `feature/revised-website` or `revise-website`):
  ```bash
  git checkout -b feature/revised-website
  ```
- **Push and test** — Push your branch to the remote and open a pull request, or test locally:
  ```bash
  git add -A && git commit -m "Your message"
  git push -u origin feature/revised-website
  ```
- **Merging** — After review and testing, merge the feature branch into the default branch. See [VERSION_CONTROL.md](VERSION_CONTROL.md) for more detail.

## Project structure

```
.
├── index.html        # Step-based layout: intro, browsers, OS, results
├── styles.css        # Pendo-themed layout and components
├── script.js        # Step flow, options matrix, rendering, and interactivity
├── README.md
├── VERSION_CONTROL.md
├── LICENSE
└── .gitignore
```

## References

- [IT guide to deploying the Pendo Launcher](https://support.pendo.io/hc/en-us/articles/21164568842395-IT-guide-to-deploying-the-Pendo-Launcher) — Primary source for structure and copy.
- [Manually install the Pendo Launcher for testing and demoing](https://support.pendo.io/hc/en-us/articles/21165109646619-Manually-install-the-Pendo-Launcher-for-testing-and-demoing) — Linked in the app for testing-only use.

## Licence

**Proprietary** — see [LICENSE](LICENSE). Application code may be used for its intended purpose. Pendo logos, trademarks, and brand assets are © Pendo, Inc. and may not be used independently.
