chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("blocked-site.com")) {
      return {cancel: true};
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.browserAction.onClicked.addListener(function() {
  chrome.browserAction.setPopup({popup: "popup.html"});
});
