// Check if dark mode is enabled when the page loads
chrome.storage.local.get(["darkModeEnabled"], function (result) {
  if (result.darkModeEnabled) {
    setTimeout(() => {
      enableDarkMode();
    }, 100);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleDarkMode") {
    if (request.enabled) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
    sendResponse({ status: "success" });
  }
  return true;
});

function enableDarkMode() {
  console.log("Enabling dark mode");

  // Add class to html element
  document.documentElement.classList.add("instructables-dark-mode");

  // Also add to body for good measure
  document.body.classList.add("instructables-dark-mode");

  // More aggressive approach for dynamic content
  const style = document.createElement("style");
  style.id = "instructables-dark-mode-dynamic";
  style.textContent = `
    .instructables-dark-mode,
    .instructables-dark-mode * {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
      border-color: #444 !important;
    }
    
    .instructables-dark-mode body {
      background: #1a1a1a !important;
    }
    
    .instructables-dark-mode header,
    .instructables-dark-mode nav,
    .instructables-dark-mode .header,
    .instructables-dark-mode .nav-bar {
      background: #2d2d2d !important;
    }
    
    .instructables-dark-mode .article-header,
    .instructables-dark-mode .step-body,
    .instructables-dark-mode .step-content,
    .instructables-dark-mode .ible-main {
      background: #2d2d2d !important;
    }
    
    .instructables-dark-mode h1,
    .instructables-dark-mode h2,
    .instructables-dark-mode h3,
    .instructables-dark-mode h4,
    .instructables-dark-mode .title {
      color: #fac62d !important;
    }
    
    .instructables-dark-mode a {
      color: #fac62d !important;
    }
    
    .instructables-dark-mode a:hover {
      color: #ffd95e !important;
    }
    
    .instructables-dark-mode img {
      opacity: 0.8;
      filter: brightness(0.8);
    }
    
    /* Specific collection section styles */
    .instructables-dark-mode ._collection_7y0nn_18 {
      background-color: #2d2d2d !important;
    }
    
    .instructables-dark-mode ._collectionText_7y0nn_61 {
      background-color: #2d2d2d !important;
    }
    
    .instructables-dark-mode ._collectionText_7y0nn_61 h3 {
      color: #fac62d !important;
    }
    
    .instructables-dark-mode ._title_h3_1oyw5_39 {
      color: #fac62d !important;
    }
    
    .instructables-dark-mode ._collectionText_7y0nn_61 p {
      color: #cccccc !important;
    }
    
    .instructables-dark-mode ._button_156n2_17 {
      background-color: #fac62d !important;
      color: #1a1a1a !important;
      border-color: #fac62d !important;
    }
    
    .instructables-dark-mode ._button_156n2_17:hover {
      background-color: #ffd95e !important;
      border-color: #ffd95e !important;
    }
    
    .instructables-dark-mode ._button_156n2_17 path {
      fill: #1a1a1a !important;
    }
  `;

  // Remove existing style if it exists
  const existingStyle = document.getElementById(
    "instructables-dark-mode-dynamic"
  );
  if (existingStyle) {
    existingStyle.remove();
  }

  document.head.appendChild(style);
}

function disableDarkMode() {
  console.log("Disabling dark mode");
  document.documentElement.classList.remove("instructables-dark-mode");
  document.body.classList.remove("instructables-dark-mode");

  const dynamicStyle = document.getElementById(
    "instructables-dark-mode-dynamic"
  );
  if (dynamicStyle) {
    dynamicStyle.remove();
  }
}

// Also try to apply dark mode when URL changes (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    chrome.storage.local.get(["darkModeEnabled"], function (result) {
      if (result.darkModeEnabled) {
        setTimeout(enableDarkMode, 500);
      }
    });
  }
}).observe(document, { subtree: true, childList: true });
