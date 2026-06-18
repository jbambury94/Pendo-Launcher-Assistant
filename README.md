# Pendo Launcher Deployment Decision App

A simple web app that helps project managers decide how to configure and deploy the **Pendo Launcher** browser extension. It walks through deployment paths by browser and operating system and lets you weigh the pros and cons of each option.

## What it does

- **Step-based flow** — Intro → Choose browsers → Choose OS → Configure → Results. One step at a time; no scrolling to find the next choice.
- **Pre-deploy checklist** — Reminds you to align with dev, security, privacy, and IT before rollout.
- **Browser & OS selection** — Select one or more browsers (Chrome, Edge, Firefox) and one or more operating systems (Windows, macOS) to see only relevant deployment methods.
- **Configuration guides** — A dedicated step lists the Visitor ID, metadata, and other configuration articles relevant to your selection.
- **Deployment options** — Each option is shown as a card with a short description, pros and cons visible by default, and a **View setup guide** link to the official Pendo support article.
- **Summary links** — After you complete the flow, a “Setup guides for your selection” section lists direct links to each method’s Pendo article.
- **Progress indicator** — A “Step X of 5” label and progress bar show where you are in the flow.
- **Shareable, saved selections** — Your browser and OS choices are encoded in the URL and saved to the browser, so results can be bookmarked, shared via link, or restored on your next visit.
- **Print or export** — A print-friendly layout lets you save the deployment summary as a PDF, and a “Copy shareable link” button copies the URL for your selection.
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

- **HTML** — Single page with step panels (intro, browsers, OS, configure, results).
- **CSS** — One stylesheet with Pendo branding (Pank, Blurple, Sora/Inter).
- **JavaScript** — Vanilla JS for step flow, multi-browser/OS selection, option cards, summary links, progress indicator, URL/localStorage persistence, and print/copy actions. No frameworks.

## Project structure

```
.
├── index.html        # Step-based layout: intro, browsers, OS, configure, results
├── styles.css        # Pendo-themed layout and components
├── script.js        # Step flow, options matrix, rendering, and interactivity
├── README.md
├── LICENSE
└── .gitignore
```

## References

- [IT guide to deploying the Pendo Launcher](https://support.pendo.io/hc/en-us/articles/21164568842395-IT-guide-to-deploying-the-Pendo-Launcher) — Primary source for structure and copy.
- [Manually install the Pendo Launcher for testing and demoing](https://support.pendo.io/hc/en-us/articles/21165109646619-Manually-install-the-Pendo-Launcher-for-testing-and-demoing) — Linked in the app for testing-only use.

## Licence

**Proprietary** — see [LICENSE](LICENSE). Application code may be used for its intended purpose. Pendo logos, trademarks, and brand assets are © Pendo, Inc. and may not be used independently.
