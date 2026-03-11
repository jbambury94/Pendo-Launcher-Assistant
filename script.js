(function () {
  "use strict";

  // Per-option support links (from Pendo support)
  var SUPPORT_URLS = {
    "chrome-google-admin": "https://support.pendo.io/hc/en-us/articles/21165460738331-Install-on-Chrome-for-any-OS-using-Google-Admin-console",
    "chrome-intune": "https://support.pendo.io/hc/en-us/articles/21165368123163-Install-on-Chrome-for-Windows-using-Microsoft-Intune",
    "chrome-gpo": "https://support.pendo.io/hc/en-us/articles/21944872020123-Configure-on-Chrome-for-Windows-using-GPO",
    "edge-gpo": "https://support.pendo.io/hc/en-us/articles/21943953049115-Configure-on-Edge-for-Windows-using-GPO",
    "firefox-policies": "https://support.pendo.io/hc/en-us/articles/21165410719771-Install-on-Firefox-for-Windows-or-macOS-using-policies-json",
    "firefox-native-manifest": "https://support.pendo.io/hc/en-us/articles/21165614712731-Configure-on-Firefox-for-macOS-using-native-manifest"
  };

  // Options matrix: key = "browser|os", value = array of option ids for that combo
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

  var optionsSection = document.getElementById("deployment-options-section");
  var optionsContainer = document.getElementById("options-container");
  var summarySection = document.getElementById("summary-section");
  var summaryLinks = document.getElementById("summary-links");
  var choiceHint = document.getElementById("choice-hint");

  function getSelectedBrowser() {
    var btn = document.querySelector('.option-btn[data-browser][aria-pressed="true"]');
    return btn ? btn.getAttribute("data-browser") : null;
  }

  function getSelectedOS() {
    var btn = document.querySelector('.option-btn[data-os][aria-pressed="true"]');
    return btn ? btn.getAttribute("data-os") : null;
  }

  function getOptionsForSelection() {
    var browser = getSelectedBrowser();
    var os = getSelectedOS();
    if (!browser || !os) return [];
    var key = browser + "|" + os;
    return OPTIONS_MATRIX[key] || [];
  }

  function renderOptionCard(opt) {
    var url = SUPPORT_URLS[opt.id];
    var card = document.createElement("div");
    card.className = "option-card";
    card.setAttribute("data-option-id", opt.id);

    var prosConsId = "pros-cons-" + opt.id;
    var prosItems = (opt.pros || []).map(function (p) { return "<li>" + escapeHtml(p) + "</li>"; }).join("");
    var consItems = (opt.cons || []).map(function (c) { return "<li>" + escapeHtml(c) + "</li>"; }).join("");
    var hasProsCons = (opt.pros && opt.pros.length) || (opt.cons && opt.cons.length);
    var prosConsBody = "";
    if (hasProsCons) {
      prosConsBody = "<div id=\"" + prosConsId + "\" class=\"pros-cons-content\" hidden>";
      if (opt.pros && opt.pros.length) prosConsBody += "<p style=\"margin:0 0 0.25rem 0;font-weight:600;\">Pros</p><ul>" + prosItems + "</ul>";
      if (opt.cons && opt.cons.length) prosConsBody += "<p style=\"margin:0.5rem 0 0.25rem 0;font-weight:600;\">Cons</p><ul>" + consItems + "</ul>";
      prosConsBody += "</div>";
    }

    card.innerHTML =
      "<h3>" + escapeHtml(opt.title) + "</h3>" +
      "<p class=\"option-desc\">" + escapeHtml(opt.desc) + "</p>" +
      (url ? "<a href=\"" + escapeAttr(url) + "\" class=\"option-link\" target=\"_blank\" rel=\"noopener noreferrer\">View setup guide</a>" : "") +
      (hasProsCons
        ? "<button type=\"button\" class=\"pros-cons-toggle\" aria-expanded=\"false\" aria-controls=\"" + prosConsId + "\" id=\"toggle-" + opt.id + "\">Pros &amp; cons</button>" + prosConsBody
        : "");

    if (hasProsCons) {
      var toggle = card.querySelector(".pros-cons-toggle");
      var content = card.querySelector(".pros-cons-content");
      toggle.addEventListener("click", function () {
        var expanded = content.hidden;
        content.hidden = !expanded;
        toggle.setAttribute("aria-expanded", expanded);
      });
    }

    return card;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderSummaryLinks(opts) {
    summaryLinks.innerHTML = "";
    opts.forEach(function (opt) {
      var url = SUPPORT_URLS[opt.id];
      if (!url) return;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = opt.title + " — View setup guide";
      li.appendChild(a);
      summaryLinks.appendChild(li);
    });
  }

  function updateUI() {
    var opts = getOptionsForSelection();
    optionsContainer.innerHTML = "";
    summaryLinks.innerHTML = "";

    if (opts.length > 0) {
      optionsSection.hidden = false;
      summarySection.hidden = false;
      choiceHint.textContent = "Deployment options and setup guides for your selection are below.";
      opts.forEach(function (opt) {
        optionsContainer.appendChild(renderOptionCard(opt));
      });
      renderSummaryLinks(opts);
    } else {
      var browser = getSelectedBrowser();
      var os = getSelectedOS();
      optionsSection.hidden = true;
      summarySection.hidden = true;
      if (browser && os) {
        choiceHint.textContent = "No managed deployment options for this browser and OS combination. Consider manual install for testing only (see below), or choose a different browser/OS.";
      } else {
        choiceHint.textContent = "Select a browser and an operating system to see deployment options.";
      }
    }
  }

  function setupOptionButtons() {
    document.querySelectorAll(".option-btn[data-browser]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".option-btn[data-browser]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        updateUI();
      });
    });
    document.querySelectorAll(".option-btn[data-os]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".option-btn[data-os]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        updateUI();
      });
    });
  }

  setupOptionButtons();
  updateUI();
})();
