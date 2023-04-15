let timerInterval;
let remainingTime;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    remainingTime = message.totalSeconds;
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        // Send a message to the popup script with the remaining time
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'updateTimer', remainingTime});
        });
      }
    }, 1000);
  }
});




chrome.action.onClicked.addListener(function() {
  chrome.action.setPopup({popup: "popup.html"});
});

