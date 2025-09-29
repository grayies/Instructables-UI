// Background script for Instructables Dark Mode
chrome.runtime.onInstalled.addListener(() => {
  console.log("Instructables Dark Mode extension installed");
});

// Set default state when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["darkModeEnabled"], (result) => {
    if (result.darkModeEnabled === undefined) {
      chrome.storage.local.set({ darkModeEnabled: false });
    }
  });
});

// Listen for extension icon click to toggle dark mode
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("instructables.com")) {
    chrome.storage.local.get(["darkModeEnabled"], (result) => {
      const newState = !result.darkModeEnabled;
      chrome.storage.local.set({ darkModeEnabled: newState }, () => {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
          action: "toggleDarkMode",
          enabled: newState,
        });
      });
    });
  }
});
