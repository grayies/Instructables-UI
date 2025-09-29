document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("darkModeToggle");
  const toggleLabel = document.getElementById("toggleLabel");

  // Load current state
  chrome.storage.local.get(["darkModeEnabled"], function (result) {
    const isEnabled = result.darkModeEnabled || false;
    toggle.checked = isEnabled;
    updateToggleLabel(isEnabled);
  });

  // Toggle dark mode
  toggle.addEventListener("change", function () {
    const isEnabled = this.checked;

    chrome.storage.local.set({ darkModeEnabled: isEnabled }, function () {
      updateToggleLabel(isEnabled);
      console.log("Dark mode setting saved:", isEnabled);

      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0] && tabs[0].url.includes("instructables.com")) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: "toggleDarkMode",
              enabled: isEnabled,
            },
            function (response) {
              if (chrome.runtime.lastError) {
                console.log("Error sending message:", chrome.runtime.lastError);
                // If content script isn't ready, reload the tab
                chrome.tabs.reload(tabs[0].id);
              } else {
                console.log("Message sent successfully");
              }
            }
          );
        } else {
          console.log("Not on Instructables page");
        }
      });
    });
  });

  function updateToggleLabel(isEnabled) {
    toggleLabel.textContent = isEnabled
      ? "Dark Mode Enabled"
      : "Enable Dark Mode";
  }
});
