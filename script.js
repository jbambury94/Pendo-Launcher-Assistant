/**
 * Pendo Launcher Deployment Decision App — Application logic
 * Populates deployment options and summary links based on browser/OS selection.
 * British English used in comments.
 */
(function () {
  "use strict";

  /* ----- Data: Pendo support article URLs per deployment option ----- */
  var SUPPORT_URLS = {
    "chrome-google-admin": "https://support.pendo.io/hc/en-us/articles/21165460738331-Install-on-Chrome-for-any-OS-using-Google-Admin-console",
    "chrome-intune": "https://support.pendo.io/hc/en-us/articles/21165368123163-Install-on-Chrome-for-Windows-using-Microsoft-Intune",
    "chrome-gpo": "https://support.pendo.io/hc/en-us/articles/21944872020123-Configure-on-Chrome-for-Windows-using-GPO",
    "edge-gpo": "https://support.pendo.io/hc/en-us/articles/21943953049115-Configure-on-Edge-for-Windows-using-GPO",
    "firefox-policies": "https://support.pendo.io/hc/en-us/articles/21165410719771-Install-on-Firefox-for-Windows-or-macOS-using-policies-json",
    "firefox-native-manifest": "https://support.pendo.io/hc/en-us/articles/21165614712731-Configure-on-Firefox-for-macOS-using-native-manifest"
  };

  /* ----- Config options: from Pendo Configure + Other configurations (same treatment for all) ----- */
  var CONFIG_OPTIONS = {
    "chrome|windows": [
      { title: "Configure on Chrome for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/21165595195291-Configure-on-Chrome-for-Windows-using-Microsoft-Intune" },
      { title: "Configure on Chrome for Windows using GPO", url: "https://support.pendo.io/hc/en-us/articles/21944872020123-Configure-on-Chrome-for-Windows-using-GPO" }
    ],
    "chrome|macos": [
      { title: "Configure on Chrome for macOS using Jamf", url: "https://support.pendo.io/hc/en-us/articles/23599972036507-Configure-on-Chrome-for-macOS-using-Jamf" },
      { title: "Configure on Chrome for macOS using configuration profiles", url: "https://support.pendo.io/hc/en-us/articles/21165733600027-Configure-on-Chrome-for-macOS-using-configuration-profiles" }
    ],
    "edge|windows": [
      { title: "Configure on Edge for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/21165548353691-Configure-on-Edge-for-Windows-using-Microsoft-Intune" },
      { title: "Configure on Edge for Windows using GPO", url: "https://support.pendo.io/hc/en-us/articles/21943953049115-Configure-on-Edge-for-Windows-using-GPO" }
    ],
    "edge|macos": [],
    "firefox|windows": [
      { title: "Configure on Firefox for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/39911759144091-Configure-on-Firefox-for-Windows-using-Microsoft-Intune" }
    ],
    "firefox|macos": [
      { title: "Configure on Firefox for macOS using native manifest", url: "https://support.pendo.io/hc/en-us/articles/21165614712731-Configure-on-Firefox-for-macOS-using-native-manifest" }
    ]
  };

  /* Additional config guides (from Other configurations section); shown for every selection, same list. */
  var CONFIG_OPTIONS_ADDITIONAL = [
    { title: "Send data to multiple subscriptions", url: "https://support.pendo.io/hc/en-us/articles/28116857365787-Send-data-to-multiple-subscriptions" },
    { title: "Use Okta Workflows for metadata sync", url: "https://support.pendo.io/hc/en-us/articles/21166420488219-Use-Okta-Workflows-for-metadata-sync" },
    { title: "Customize metadata sent to Pendo with Active Directory (AD) scripts", url: "https://support.pendo.io/hc/en-us/articles/21165984701339-Customize-metadata-sent-to-Pendo-with-Active-Directory-AD-scripts" },
    { title: "Identify visitors and metadata using a Salesforce component", url: "https://support.pendo.io/hc/en-us/articles/21165941276827-Identify-visitors-and-metadata-using-a-Salesforce-component" },
    { title: "Identify visitors and metadata through browser scripting", url: "https://support.pendo.io/hc/en-us/articles/22764466082715-Identify-visitors-and-metadata-through-browser-scripting" },
    { title: "Identify visitors and metadata through Microsoft Azure", url: "https://support.pendo.io/hc/en-us/articles/24912566392731-Identify-visitors-and-metadata-through-Microsoft-Azure" },
    { title: "Identify visitors and metadata through Okta", url: "https://support.pendo.io/hc/en-us/articles/27309490373915-Identify-visitors-and-metadata-through-Okta" },
    { title: "Identify visitors and metadata through an IdP", url: "https://support.pendo.io/hc/en-us/articles/29288315221787-Identify-visitors-and-metadata-through-an-IdP" }
  ];

  /* ----- Options matrix: key is "browser|os", value is array of option objects (id, title, desc, pros, cons) ----- */
  var OPTIONS_MATRIX = {
    "chrome|windows": [
      { id: "chrome-google-admin", title: "Google Admin console", desc: "Force-install the extension across Chrome on any OS via Google Admin. Good if you already use Google Workspace.", pros: ["Works on any OS", "Automatic updates from Chrome Web Store", "Central management in Google Admin"], cons: ["Requires Google Workspace", "Cannot be used together with Intune for Chrome extension management"] },
      { id: "chrome-intune", title: "Microsoft Intune", desc: "Auto-install on Chrome for Windows using a configuration profile in the Intune admin center.", pros: ["Fits existing Intune-managed Windows estate", "No Google Admin required"], cons: ["Windows only", "Incompatible with Google Admin console extension management"] },
      { id: "chrome-gpo", title: "Group Policy (GPO)", desc: "Install and configure the extension on Chrome for Windows using Group Policy Management.", pros: ["Familiar for Windows/AD environments", "No cloud admin console required"], cons: ["Windows only", "Requires GPO infrastructure"] }
    ],
    "chrome|macos": [
      { id: "chrome-google-admin", title: "Google Admin console", desc: "Force-install the extension on Chrome for macOS via Google Admin. The main managed option for Chrome on Mac.", pros: ["Works on macOS", "Automatic updates", "Central management"], cons: ["Requires Google Workspace"] }
    ],
    "edge|windows": [
      { id: "edge-gpo", title: "Group Policy (GPO)", desc: "Install and configure the Pendo Launcher on Microsoft Edge for Windows using Group Policy and registry keys.", pros: ["Native to Windows/Edge", "Visitor ID and metadata config via GPO"], cons: ["Windows only"] }
    ],
    "edge|macos": [],
    "firefox|windows": [
      { id: "firefox-policies", title: "policies.json", desc: "Auto-install the Pendo Launcher on Firefox using MDM to deploy a policies.json file. Use force_installed or normal_installed.", pros: ["Supported on Windows and macOS", "Controlled via MDM"], cons: ["Requires MDM and Firefox policy support"] }
    ],
    "firefox|macos": [
      { id: "firefox-policies", title: "policies.json", desc: "Auto-install the Pendo Launcher on Firefox using MDM to deploy a policies.json file.", pros: ["Controlled via MDM", "Works on macOS"], cons: ["Requires MDM and Firefox policy support"] },
      { id: "firefox-native-manifest", title: "Native manifest (config)", desc: "Configure Visitor IDs, metadata, and API keys on Firefox for macOS using a native manifest.", pros: ["Official way to push config on macOS"], cons: ["Configuration only; pair with policies.json for install"] }
    ]
  };

  /* ----- DOM references ----- */
  var optionsContainer = document.getElementById("options-container");
  var summaryLinks = document.getElementById("summary-links");
  var choiceHintBrowsers = document.getElementById("choice-hint-browsers");
  var choiceHintOs = document.getElementById("choice-hint-os");
  var resultsIntro = document.getElementById("results-intro");
  var configLinks = document.getElementById("config-links");
  var configHint = document.getElementById("config-hint");

  /* ----- Step state ----- */
  var currentStep = "intro";
  var STEP_ORDER = ["intro", "browsers", "os", "config", "results"];

  /* ----- Selection helpers ----- */
  /** Returns an array of selected browser ids (chrome | edge | firefox). Multiple allowed. */
  function getSelectedBrowsers() {
    var buttons = document.querySelectorAll('.option-btn[data-browser][aria-pressed="true"]');
    return Array.prototype.map.call(buttons, function (btn) { return btn.getAttribute("data-browser"); });
  }

  /** Returns an array of selected OS ids (windows | macos). Multiple allowed. */
  function getSelectedOSes() {
    var buttons = document.querySelectorAll('.option-btn[data-os][aria-pressed="true"]');
    return Array.prototype.map.call(buttons, function (btn) { return btn.getAttribute("data-os"); });
  }

  /** Returns deployment options for the current browser(s) and OS(es). One entry per (browser, os) combo with browser and os attached for labelling. */
  function getOptionsForSelection() {
    var browsers = getSelectedBrowsers();
    var oses = getSelectedOSes();
    if (!browsers.length || !oses.length) return [];
    var result = [];
    browsers.forEach(function (browser) {
      oses.forEach(function (os) {
        var key = browser + "|" + os;
        var opts = OPTIONS_MATRIX[key] || [];
        opts.forEach(function (opt) {
          result.push({ opt: opt, browser: browser, os: os });
        });
      });
    });
    return result;
  }

  /** Returns config options for the current browser(s) and OS(es). Merges browser|os-specific + additional, dedupes by url. */
  function getConfigForSelection() {
    var browsers = getSelectedBrowsers();
    var oses = getSelectedOSes();
    if (!browsers.length || !oses.length) return [];
    var seen = {};
    var merged = [];
    browsers.forEach(function (browser) {
      oses.forEach(function (os) {
        var key = browser + "|" + os;
        var items = CONFIG_OPTIONS[key] || [];
        items.forEach(function (item) {
          if (!seen[item.url]) {
            seen[item.url] = true;
            merged.push(item);
          }
        });
      });
    });
    CONFIG_OPTIONS_ADDITIONAL.forEach(function (item) {
      if (!seen[item.url]) {
        seen[item.url] = true;
        merged.push(item);
      }
    });
    return merged;
  }

  /** Display names for browser and OS ids (used for all user-facing labels). */
  var BROWSER_LABELS = { chrome: "Chrome", edge: "Edge", firefox: "Firefox" };
  var OS_LABELS = { windows: "Windows", macos: "macOS" };

  /** Returns the display label for a single browser id (e.g. "Chrome"). */
  function formatBrowserLabel(browser) {
    return BROWSER_LABELS[browser] || browser;
  }

  /** Returns the display label for a single OS id (e.g. "Windows", "macOS"). */
  function formatOsLabel(os) {
    return OS_LABELS[os] || os;
  }

  /** Returns a display label for a browser and OS combo (e.g. "Chrome · Windows"). */
  function formatBrowserOsLabel(browser, os) {
    return formatBrowserLabel(browser) + " · " + formatOsLabel(os);
  }

  /* ----- Rendering ----- */
  /** Builds one deployment option card: title, description, "View setup guide" link, pros/cons. Requires opt, browser, os. */
  function renderOptionCard(opt, browser, os) {
    var url = SUPPORT_URLS[opt.id];
    var card = document.createElement("div");
    card.className = "option-card";
    card.setAttribute("data-option-id", opt.id);
    card.setAttribute("data-browser", browser);
    card.setAttribute("data-os", os);

    var label = formatBrowserOsLabel(browser, os);
    var prosConsId = "pros-cons-" + opt.id + "-" + browser + "-" + os;
    var prosItems = (opt.pros || []).map(function (p) { return "<li>" + escapeHtml(p) + "</li>"; }).join("");
    var consItems = (opt.cons || []).map(function (c) { return "<li>" + escapeHtml(c) + "</li>"; }).join("");
    var hasProsCons = (opt.pros && opt.pros.length) || (opt.cons && opt.cons.length);
    var prosConsBody = "";
    if (hasProsCons) {
      prosConsBody = "<div id=\"" + prosConsId + "\" class=\"pros-cons-content\">";
      if (opt.pros && opt.pros.length) prosConsBody += "<p class=\"pros-cons-heading\">Pros</p><ul>" + prosItems + "</ul>";
      if (opt.cons && opt.cons.length) prosConsBody += "<p class=\"pros-cons-heading pros-cons-heading-cons\">Cons</p><ul>" + consItems + "</ul>";
      prosConsBody += "</div>";
    }

    card.innerHTML =
      "<span class=\"option-card-badge\" aria-label=\"For " + escapeAttr(label) + "\">" + escapeHtml(label) + "</span>" +
      "<h3>" + escapeHtml(opt.title) + "</h3>" +
      "<p class=\"option-desc\">" + escapeHtml(opt.desc) + "</p>" +
      (url ? "<a href=\"" + escapeAttr(url) + "\" class=\"option-link\" target=\"_blank\" rel=\"noopener noreferrer\">View setup guide</a>" : "") +
      prosConsBody;

    return card;
  }

  /** Escapes text for safe insertion into HTML (prevents XSS). */
  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /** Escapes a string for safe use in an HTML attribute. */
  function escapeAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /** Fills the summary section with one link per unique deployment option (deduped by id), labelled by browser/OS combo(s). */
  function renderSummaryLinks(items) {
    summaryLinks.innerHTML = "";
    var byId = {};
    items.forEach(function (item) {
      var opt = item.opt;
      var url = SUPPORT_URLS[opt.id];
      if (!url) return;
      if (!byId[opt.id]) {
        byId[opt.id] = { opt: opt, url: url, combos: [] };
      }
      byId[opt.id].combos.push(formatBrowserOsLabel(item.browser, item.os));
    });
    Object.keys(byId).forEach(function (id) {
      var entry = byId[id];
      var label = entry.combos.length > 1
        ? entry.opt.title + " (" + entry.combos.join(", ") + ") — View setup guide"
        : entry.opt.title + " (" + entry.combos[0] + ") — View setup guide";
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = entry.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = label;
      li.appendChild(a);
      summaryLinks.appendChild(li);
    });
  }

  /** Updates hints, Next button states, and (when on results) deployment options and summary. */
  function updateUI() {
    var browsers = getSelectedBrowsers();
    var oses = getSelectedOSes();
    var opts = getOptionsForSelection();

    if (choiceHintBrowsers) {
      choiceHintBrowsers.textContent = browsers.length
        ? (browsers.length > 1
          ? browsers.slice(0, -1).map(formatBrowserLabel).join(", ") + " and " + formatBrowserLabel(browsers[browsers.length - 1]) + " selected."
          : formatBrowserLabel(browsers[0]) + " selected.")
        : "Select at least one browser.";
    }
    if (choiceHintOs) {
      choiceHintOs.textContent = oses.length
        ? (oses.length > 1
          ? oses.slice(0, -1).map(formatOsLabel).join(", ") + " and " + formatOsLabel(oses[oses.length - 1]) + " selected."
          : formatOsLabel(oses[0]) + " selected.")
        : "Select at least one operating system.";
    }

    var btnNextBrowsers = document.getElementById("btn-next-browsers");
    var btnNextOs = document.getElementById("btn-next-os");
    if (btnNextBrowsers) btnNextBrowsers.disabled = browsers.length === 0;
    if (btnNextOs) btnNextOs.disabled = oses.length === 0;

    if (currentStep === "results" && optionsContainer && summaryLinks) {
      optionsContainer.innerHTML = "";
      summaryLinks.innerHTML = "";
      if (opts.length > 0) {
        var browserLabel = browsers.length > 1
          ? browsers.slice(0, -1).map(formatBrowserLabel).join(", ") + " and " + formatBrowserLabel(browsers[browsers.length - 1])
          : formatBrowserLabel(browsers[0]);
        var osLabel = oses.length > 1
          ? oses.slice(0, -1).map(formatOsLabel).join(", ") + " and " + formatOsLabel(oses[oses.length - 1])
          : formatOsLabel(oses[0]);
        if (resultsIntro) resultsIntro.textContent = "Deployment options for " + browserLabel + " on " + osLabel + ". Review each method and its pros and cons below. Use “View setup guide” to open the official Pendo instructions.";
        opts.forEach(function (item) {
          optionsContainer.appendChild(renderOptionCard(item.opt, item.browser, item.os));
        });
        renderSummaryLinks(opts);
      } else {
        if (resultsIntro) resultsIntro.textContent = "No managed deployment options for your browser and OS selection. Consider manual install for testing only (see below), or change your selection.";
      }
    }
  }

  /** Binds click handlers: browsers and OS multi-select (toggle); refreshes UI. */
  function setupOptionButtons() {
    document.querySelectorAll(".option-btn[data-browser]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", pressed ? "false" : "true");
        updateUI();
      });
    });
    document.querySelectorAll(".option-btn[data-os]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", pressed ? "false" : "true");
        updateUI();
      });
    });
  }

  /** Shows one step panel and updates URL hash. Calls updateUI when showing results. */
  function showStep(step) {
    currentStep = step;
    document.querySelectorAll(".step-panel").forEach(function (panel) {
      panel.hidden = panel.id !== "step-" + step;
    });
    if (typeof location !== "undefined" && location.hash !== "#" + step) {
      try { location.hash = step; } catch (e) { }
    }
    if (step === "results") updateUI();
    if (step === "config") renderConfigStep();
  }

  /** Fills the config step with links for the current selection. */
  function renderConfigStep() {
    if (!configLinks || !configHint) return;
    var items = getConfigForSelection();
    configLinks.innerHTML = "";
    if (items.length > 0) {
      configHint.textContent = "Configuration guides for your selection:";
      items.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = item.title;
        li.appendChild(a);
        configLinks.appendChild(li);
      });
    } else {
      configHint.textContent = "No dedicated configuration guides for your browser and OS selection. You can still configure after install; see the deployment options in the next step for setup guides that may include config.";
    }
  }

  /** Binds step navigation: CTA, Next, Back, Change selection. */
  function setupStepNavigation() {
    var cta = document.getElementById("cta-choose-browsers");
    if (cta) cta.addEventListener("click", function () { showStep("browsers"); updateUI(); });

    var btnNextBrowsers = document.getElementById("btn-next-browsers");
    if (btnNextBrowsers) btnNextBrowsers.addEventListener("click", function () { showStep("os"); updateUI(); });

    var btnNextOs = document.getElementById("btn-next-os");
    if (btnNextOs) btnNextOs.addEventListener("click", function () { showStep("config"); });

    var btnBackOs = document.getElementById("btn-back-os");
    if (btnBackOs) btnBackOs.addEventListener("click", function () { showStep("browsers"); updateUI(); });

    var btnBackConfig = document.getElementById("btn-back-config");
    if (btnBackConfig) btnBackConfig.addEventListener("click", function () { showStep("os"); updateUI(); });

    var btnNextConfig = document.getElementById("btn-next-config");
    if (btnNextConfig) btnNextConfig.addEventListener("click", function () { showStep("results"); });

    var btnChange = document.getElementById("btn-change-selection");
    if (btnChange) btnChange.addEventListener("click", function () { showStep("browsers"); updateUI(); });
  }

  /* ----- Initialise: attach listeners, restore step from hash, render ----- */
  setupOptionButtons();
  setupStepNavigation();
  (function applyInitialStep() {
    var hash = typeof location !== "undefined" && location.hash ? location.hash.slice(1) : "";
    var step = STEP_ORDER.indexOf(hash) !== -1 ? hash : "intro";
    showStep(step);
    if (step !== "results" && step !== "config") updateUI();
  })();
})();