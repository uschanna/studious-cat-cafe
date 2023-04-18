// Define a name for the alarm
const alarmName = 'pomodoro';

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_ALARM') {
    chrome.alarms.get(request.name, alarm => {
      sendResponse({ alarm: alarm });
    });
    return true; // This tells Chrome that you will be sending a response asynchronously
  }
});
