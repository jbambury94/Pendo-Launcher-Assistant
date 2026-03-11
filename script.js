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

  /* ----- Config options: pros, cons, and what each configures (per IT guide table). ----- */
  var CONFIG_OPTIONS = {
    "chrome|windows": [
      { id: "config-chrome-win-intune", title: "Configure on Chrome for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/21165595195291-Configure-on-Chrome-for-Windows-using-Microsoft-Intune", pros: ["API key, Visitor ID, and metadata in one place", "Fits Intune-managed Windows"], cons: ["Windows only"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true },
      { id: "config-chrome-win-gpo", title: "Configure on Chrome for Windows using GPO", url: "https://support.pendo.io/hc/en-us/articles/21944872020123-Configure-on-Chrome-for-Windows-using-GPO", pros: ["API key, Visitor ID, and metadata via GPO", "Familiar for AD environments"], cons: ["Windows only", "Requires GPO"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true }
    ],
    "chrome|macos": [
      { id: "config-chrome-mac-jamf", title: "Configure on Chrome for macOS using Jamf", url: "https://support.pendo.io/hc/en-us/articles/23599972036507-Configure-on-Chrome-for-macOS-using-Jamf", pros: ["API key, Visitor ID, and metadata via Jamf", "Native to macOS MDM"], cons: ["Requires Jamf"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true },
      { id: "config-chrome-mac-profiles", title: "Configure on Chrome for macOS using configuration profiles", url: "https://support.pendo.io/hc/en-us/articles/21165733600027-Configure-on-Chrome-for-macOS-using-configuration-profiles", pros: ["API key, Visitor ID, and metadata via MDM", "Works with any MDM that supports Chrome"], cons: ["Requires MDM"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true }
    ],
    "edge|windows": [
      { id: "config-edge-win-intune", title: "Configure on Edge for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/21165548353691-Configure-on-Edge-for-Windows-using-Microsoft-Intune", pros: ["API key, Visitor ID, and metadata via Intune", "Fits Intune-managed Windows"], cons: ["Windows only"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true },
      { id: "config-edge-win-gpo", title: "Configure on Edge for Windows using GPO", url: "https://support.pendo.io/hc/en-us/articles/21943953049115-Configure-on-Edge-for-Windows-using-GPO", pros: ["API key, Visitor ID, and metadata via GPO", "Native to Windows/Edge"], cons: ["Windows only"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true }
    ],
    "edge|macos": [],
    "firefox|windows": [
      { id: "config-firefox-win-intune", title: "Configure on Firefox for Windows using Microsoft Intune", url: "https://support.pendo.io/hc/en-us/articles/39911759144091-Configure-on-Firefox-for-Windows-using-Microsoft-Intune", pros: ["API key, Visitor ID, and metadata via Intune"], cons: ["Windows only"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true }
    ],
    "firefox|macos": [
      { id: "config-firefox-mac-manifest", title: "Configure on Firefox for macOS using native manifest", url: "https://support.pendo.io/hc/en-us/articles/21165614712731-Configure-on-Firefox-for-macOS-using-native-manifest", pros: ["API key, Visitor ID, and metadata on macOS", "Official Firefox config method"], cons: ["Configuration only; pair with policies.json for install"], configuresApiKey: true, configuresVisitorId: true, configuresMetadata: true }
    ]
  };

  var CONFIG_OPTIONS_ADDITIONAL = [
    { id: "config-multi-sub", title: "Send data to multiple subscriptions", url: "https://support.pendo.io/hc/en-us/articles/28116857365787-Send-data-to-multiple-subscriptions", pros: ["Use one Launcher for multiple Pendo subscriptions"], cons: ["Requires separate configuration per subscription"], configuresApiKey: false, configuresVisitorId: false, configuresMetadata: false },
    { id: "config-okta-workflows", title: "Use Okta Workflows for metadata sync", url: "https://support.pendo.io/hc/en-us/articles/21166420488219-Use-Okta-Workflows-for-metadata-sync", pros: ["Sync metadata from Okta", "No endpoint management required for metadata"], cons: ["Metadata only; pair with an option that configures API key and Visitor ID"], configuresApiKey: false, configuresVisitorId: false, configuresMetadata: true },
    { id: "config-ad-scripts", title: "Customize metadata sent to Pendo with Active Directory (AD) scripts", url: "https://support.pendo.io/hc/en-us/articles/21165984701339-Customize-metadata-sent-to-Pendo-with-Active-Directory-AD-scripts", pros: ["Metadata from AD", "Fits Windows/AD environments"], cons: ["Metadata only; Windows only"], configuresApiKey: false, configuresVisitorId: false, configuresMetadata: true },
    { id: "config-salesforce", title: "Identify visitors and metadata using a Salesforce component", url: "https://support.pendo.io/hc/en-us/articles/21165941276827-Identify-visitors-and-metadata-using-a-Salesforce-component", pros: ["Visitor ID and metadata from Salesforce", "Works across browsers and OS"], cons: ["Does not configure API key; use with an option that does"], configuresApiKey: false, configuresVisitorId: true, configuresMetadata: true },
    { id: "config-browser-script", title: "Identify visitors and metadata through browser scripting", url: "https://support.pendo.io/hc/en-us/articles/22764466082715-Identify-visitors-and-metadata-through-browser-scripting", pros: ["Visitor ID and metadata via app script", "Works across browsers and OS"], cons: ["Does not configure API key; use with an option that does"], configuresApiKey: false, configuresVisitorId: true, configuresMetadata: true },
    { id: "config-azure", title: "Identify visitors and metadata through Microsoft Azure", url: "https://support.pendo.io/hc/en-us/articles/24912566392731-Identify-visitors-and-metadata-through-Microsoft-Azure", pros: ["Visitor ID and metadata from Azure AD", "Fits Azure-based identity"], cons: ["Does not configure API key; use with an option that does"], configuresApiKey: false, configuresVisitorId: true, configuresMetadata: true },
    { id: "config-okta", title: "Identify visitors and metadata through Okta", url: "https://support.pendo.io/hc/en-us/articles/27309490373915-Identify-visitors-and-metadata-through-Okta", pros: ["Visitor ID and metadata from Okta", "Fits Okta-based identity"], cons: ["Does not configure API key; use with an option that does"], configuresApiKey: false, configuresVisitorId: true, configuresMetadata: true },
    { id: "config-idp", title: "Identify visitors and metadata through an IdP", url: "https://support.pendo.io/hc/en-us/articles/29288315221787-Identify-visitors-and-metadata-through-an-IdP", pros: ["Visitor ID and metadata from any OIDC IdP", "Flexible identity source"], cons: ["Does not configure API key; use with an option that does"], configuresApiKey: false, configuresVisitorId: true, configuresMetadata: true }
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

  /** Returns config options for the current browser(s) and OS(es). Merges browser|os-specific + additional, dedupes by id. */
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
          if (!seen[item.id]) {
            seen[item.id] = true;
            merged.push(item);
          }
        });
      });
    });
    CONFIG_OPTIONS_ADDITIONAL.forEach(function (item) {
      if (!seen[item.id]) {
        seen[item.id] = true;
        merged.push(item);
      }
    });
    return merged;
  }

  /** Returns array of selected config option ids (from config step checkboxes). */
  function getSelectedConfigIds() {
    var checkboxes = document.querySelectorAll('#config-cards-container input.config-card-checkbox:checked');
    return Array.prototype.map.call(checkboxes, function (cb) { return cb.value; });
  }

  /** Returns config items by id for the current selection. */
  function getConfigItemsById() {
    var items = getConfigForSelection();
    var byId = {};
    items.forEach(function (item) {
      byId[item.id] = item;
    });
    return byId;
  }

  /** Formats browser and os for display (e.g. "Chrome · Windows"). */
  function formatBrowserOsLabel(browser, os) {
    var b = browser.charAt(0).toUpperCase() + browser.slice(1);
    var o = os === "macos" ? "macOS" : os.charAt(0).toUpperCase() + os.slice(1);
    return b + " · " + o;
  }

  /* ----- Rendering ----- */
  /** Builds one deployment option card: badge (browser · OS), title, description, "View setup guide" link, pros/cons. */
  function renderOptionCard(item) {
    var opt = item.opt;
    var browser = item.browser;
    var os = item.os;
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

  /** Fills the summary section with one link per option (to Pendo support articles), labelled by browser/OS. */
  function renderSummaryLinks(items) {
    summaryLinks.innerHTML = "";
    items.forEach(function (item) {
      var opt = item.opt;
      var url = SUPPORT_URLS[opt.id];
      if (!url) return;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = opt.title + " (" + formatBrowserOsLabel(item.browser, item.os) + ") — View setup guide";
      li.appendChild(a);
      summaryLinks.appendChild(li);
    });
  }

  /** Updates hints, Next button states, and (when on results) deployment options and summary. */
  function updateUI() {
    var browsers = getSelectedBrowsers();
    var oses = getSelectedOSes();
    var items = getOptionsForSelection();

    if (choiceHintBrowsers) {
      choiceHintBrowsers.textContent = browsers.length
        ? (browsers.length > 1 ? browsers.slice(0, -1).join(", ") + " and " + browsers[browsers.length - 1] + " selected." : browsers[0] + " selected.")
        : "Select at least one browser.";
    }
    if (choiceHintOs) {
      choiceHintOs.textContent = oses.length
        ? (oses.length > 1 ? oses.slice(0, -1).join(", ") + " and " + oses[oses.length - 1] + " selected." : oses[0] + " selected.")
        : "Select at least one operating system.";
    }

    var btnNextBrowsers = document.getElementById("btn-next-browsers");
    var btnNextOs = document.getElementById("btn-next-os");
    if (btnNextBrowsers) btnNextBrowsers.disabled = browsers.length === 0;
    if (btnNextOs) btnNextOs.disabled = oses.length === 0;

    if (currentStep === "results" && optionsContainer && summaryLinks) {
      optionsContainer.innerHTML = "";
      summaryLinks.innerHTML = "";
      if (items.length > 0) {
        var browserLabel = browsers.length > 1
          ? browsers.slice(0, -1).join(", ") + " and " + browsers[browsers.length - 1]
          : browsers[0];
        var osLabel = oses.length > 1
          ? oses.slice(0, -1).join(", ") + " and " + oses[oses.length - 1]
          : oses[0];
        if (resultsIntro) resultsIntro.textContent = "Deployment options for " + browserLabel + " on " + osLabel + ". Each tile shows the browser and OS it applies to. Review pros and cons and use “View setup guide” for the official Pendo instructions.";
        items.forEach(function (item) {
          optionsContainer.appendChild(renderOptionCard(item));
        });
        renderSummaryLinks(items);
      } else {
        if (resultsIntro) resultsIntro.textContent = "No managed deployment options for this browser and OS combination. Consider manual install for testing only (see below), or change your selection.";
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

  /** Fills the config step with selectable cards (pros/cons) and updates the checklist. */
  function renderConfigStep() {
    var container = document.getElementById("config-cards-container");
    var hint = document.getElementById("config-hint");
    var checklistList = document.getElementById("config-checklist-list");
    if (!container || !hint) return;
    var items = getConfigForSelection();
    container.innerHTML = "";
    if (items.length > 0) {
      hint.textContent = "Select the configuration options you plan to use. Ensure your selection covers API key and Visitor ID (required) and preferably metadata.";
      items.forEach(function (item) {
        var card = document.createElement("div");
        card.className = "option-card config-card";
        var prosItems = (item.pros || []).map(function (p) { return "<li>" + escapeHtml(p) + "</li>"; }).join("");
        var consItems = (item.cons || []).map(function (c) { return "<li>" + escapeHtml(c) + "</li>"; }).join("");
        var prosCons = "";
        if (prosItems || consItems) {
          prosCons = "<div class=\"pros-cons-content\">";
          if (item.pros && item.pros.length) prosCons += "<p class=\"pros-cons-heading\">Pros</p><ul>" + prosItems + "</ul>";
          if (item.cons && item.cons.length) prosCons += "<p class=\"pros-cons-heading pros-cons-heading-cons\">Cons</p><ul>" + consItems + "</ul>";
          prosCons += "</div>";
        }
        var capabilities = [];
        if (item.configuresApiKey) capabilities.push("API key");
        if (item.configuresVisitorId) capabilities.push("Visitor ID");
        if (item.configuresMetadata) capabilities.push("Metadata");
        var capText = capabilities.length ? " — " + capabilities.join(", ") : "";
        card.innerHTML =
          "<label class=\"config-card-label\">" +
          "<input type=\"checkbox\" class=\"config-card-checkbox\" value=\"" + escapeAttr(item.id) + "\" data-config-id=\"" + escapeAttr(item.id) + "\"> " +
          "<span class=\"config-card-title\">" + escapeHtml(item.title) + "</span>" +
          (capText ? "<span class=\"config-card-caps\">" + escapeHtml(capText) + "</span>" : "") +
          "</label>" +
          prosCons +
          "<a href=\"" + escapeAttr(item.url) + "\" class=\"option-link\" target=\"_blank\" rel=\"noopener noreferrer\">View guide</a>";
        container.appendChild(card);
      });
      if (checklistList) {
        var checkboxes = container.querySelectorAll(".config-card-checkbox");
        function updateChecklist() { updateConfigChecklist(); }
        checkboxes.forEach(function (cb) {
          cb.addEventListener("change", updateChecklist);
        });
        updateConfigChecklist();
      }
      if (!window._dataEnvButtonsBound) {
        window._dataEnvButtonsBound = true;
        setupDataEnvironmentButtons();
      }
    } else {
      hint.textContent = "No dedicated configuration guides for this browser and OS combination. You can still configure after install; see the deployment options in the next step for setup guides that may include config.";
      if (checklistList) checklistList.innerHTML = "";
    }
  }

  /** Updates the config checklist (API key, Visitor ID, metadata) from selected config options. */
  function updateConfigChecklist() {
    var list = document.getElementById("config-checklist-list");
    if (!list) return;
    var byId = getConfigItemsById();
    var selectedIds = getSelectedConfigIds();
    var hasApiKey = false, hasVisitorId = false, hasMetadata = false;
    selectedIds.forEach(function (id) {
      var item = byId[id];
      if (item) {
        if (item.configuresApiKey) hasApiKey = true;
        if (item.configuresVisitorId) hasVisitorId = true;
        if (item.configuresMetadata) hasMetadata = true;
      }
    });
    list.innerHTML = "";
    function addLine(ok, text, required) {
      var li = document.createElement("li");
      li.className = ok ? "config-checklist-ok" : (required ? "config-checklist-missing" : "config-checklist-warn");
      li.textContent = (ok ? "\u2713 " : (required ? "\u2717 " : "\u25CB ")) + text;
      if (!ok && required) li.setAttribute("role", "alert");
      list.appendChild(li);
    }
    addLine(hasApiKey, "API key configured with Launcher", true);
    addLine(hasVisitorId, "Visitor ID configured with Launcher", true);
    addLine(hasMetadata, "Metadata (recommended for analytics and targeting)", false);
  }

  /** Binds dataEnvironment Yes/No and modal. */
  function setupDataEnvironmentButtons() {
    var btnYes = document.getElementById("data-env-yes");
    var btnNo = document.getElementById("data-env-no");
    var modal = document.getElementById("data-env-modal");
    var modalClose = document.getElementById("data-env-modal-close");
    var modalBackdrop = document.getElementById("data-env-modal-backdrop");
    if (btnYes) {
      btnYes.addEventListener("click", function () {
        document.querySelectorAll("[data-data-env]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btnYes.setAttribute("aria-pressed", "true");
        if (modal) { modal.hidden = false; if (modalClose) modalClose.focus(); }
      });
    }
    if (btnNo) {
      btnNo.addEventListener("click", function () {
        document.querySelectorAll("[data-data-env]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btnNo.setAttribute("aria-pressed", "true");
      });
    }
    function closeModal() { if (modal) modal.hidden = true; }
    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
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
    if (btnNextConfig) {
      btnNextConfig.addEventListener("click", function () {
        var byId = getConfigItemsById();
        var selectedIds = getSelectedConfigIds();
        var hasApiKey = false, hasVisitorId = false;
        selectedIds.forEach(function (id) {
          var item = byId[id];
          if (item) {
            if (item.configuresApiKey) hasApiKey = true;
            if (item.configuresVisitorId) hasVisitorId = true;
          }
        });
        if (!hasApiKey || !hasVisitorId) {
          alert("Please ensure your selected configuration options include at least one that configures the API key and at least one that configures the Visitor ID (both required for the Launcher). Check the configuration checklist above.");
          return;
        }
        showStep("results");
      });
    }

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
