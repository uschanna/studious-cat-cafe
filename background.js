// Add a listener for the onInstalled event to register the rules
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: "block_ads",
        priority: 1,
        action: {
          type: "redirect",
          redirect: {extensionPath: "/popup.html"}
        },
        condition: {
          urlFilter: "*://*/*",
          resourceTypes: ["script"]
        }
      }
    ],
    removeRuleIds: []
  });
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.browserAction.setPopup({popup: "popup.html"});
});
