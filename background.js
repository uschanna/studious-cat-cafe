chrome.action.onClicked.addListener(function() {
  chrome.action.setPopup({popup: "popup.html"});
});

// Define a name for the alarm
const alarmName = 'myAlarm';

// Define a function to handle the alarm
function handleAlarm() {
  // Call the startTimer function from popup.js
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: startTimer
    });
  });
}

// Define a function to create the alarm
function createAlarm() {
  chrome.alarms.create(alarmName, {
    delayInMinutes: 25,
    periodInMinutes: 25
  });
}

// Add a listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    createAlarm();
  } else if (details.reason === 'update') {
    chrome.alarms.clearAll(() => {
      createAlarm();
    });
  }
});

// Add a listener for when the alarm is triggered
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === alarmName) {
    handleAlarm();
  }
});
