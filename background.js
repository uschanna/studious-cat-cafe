const alarmName = 'pomodoro';

function handleAlarm() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: startTimer
    });
  });
}

function createAlarm() {
  chrome.alarms.create(alarmName, {
    delayInMinutes: 25,
    periodInMinutes: 25
  });
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    createAlarm();
  } else if (details.reason === 'update') {
    chrome.alarms.clearAll(() => {
      createAlarm();
    });
  }
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === alarmName) {
    handleAlarm();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_ALARM') {
    chrome.alarms.get(alarmName, alarm => {
      sendResponse({ alarm: alarm });
    });
  }
  return true;
});
