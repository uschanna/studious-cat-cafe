chrome.browserAction.onClicked.addListener(function() {
  chrome.browserAction.setPopup({popup: "popup.html"});
});
