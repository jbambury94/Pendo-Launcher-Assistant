# Pendo Launcher Deployment Decision App

A simple web app that helps project managers decide how to configure and deploy the **Pendo Launcher** browser extension. It walks through deployment paths by browser and operating system and lets you weigh the pros and cons of each option.

## What it does

- **Pre-deploy checklist** — Reminds you to align with dev, security, privacy, and IT before rollout.
- **Browser & OS selection** — Choose Chrome, Edge, or Firefox and Windows or macOS to see only relevant deployment methods.
- **Deployment options** — Each option is shown as a card with a short description, pros and cons, and a **View setup guide** link to the official Pendo support article.
- **Summary links** — After you select browser/OS, a “Setup guides for your selection” section lists direct links to each method’s Pendo article.
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

- **HTML** — Single page, semantic sections.
- **CSS** — One stylesheet with Pendo branding (Pank, Blurple, Sora/Inter).
- **JavaScript** — Vanilla JS for browser/OS selection, option cards, and summary links. No frameworks.

## Project structure

```
.
├── index.html   # Page structure: landing, checklist, browser/OS choice, options, summary, manual install
├── styles.css   # Pendo-themed layout and components
├── script.js    # Options matrix, rendering, and interactivity
├── README.md
├── LICENSE
└── .gitignore
```

## References

- [IT guide to deploying the Pendo Launcher](https://support.pendo.io/hc/en-us/articles/21164568842395-IT-guide-to-deploying-the-Pendo-Launcher) — Primary source for structure and copy.
- [Manually install the Pendo Launcher for testing and demoing](https://support.pendo.io/hc/en-us/articles/21165109646619-Manually-install-the-Pendo-Launcher-for-testing-and-demoing) — Linked in the app for testing-only use.

## Licence

MIT — see [LICENSE](LICENSE).
