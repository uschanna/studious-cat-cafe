chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'myAlarm') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Alarm',
      message: 'Your alarm has finished!'
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ time: 60 });
  chrome.storage.local.set({ running: false });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.time) {
    chrome.action.setBadgeText({ text: changes.time.newValue.toString() });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['running'], (result) => {
    const running = result.running;
    if (running) {
      chrome.storage.local.set({ running: false });
      chrome.action.setBadgeText({ text: '' });
      chrome.alarms.clear('myAlarm');
    } else {
      chrome.storage.local.get(['time'], (result) => {
        const time = result.time;
        chrome.storage.local.set({ running: true });
        chrome.action.setBadgeText({ text: time.toString() });
        chrome.alarms.create('myAlarm', { delayInMinutes: time });
      });
    }
  });
});
