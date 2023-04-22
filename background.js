var intervalId;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (!message.popupClosed) {
    clearInterval(intervalId); // Stop your background function
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
      port.onDisconnect.addListener(function() {
        intervalId = setInterval(backgroundFunction, 1000); // Start your background function
      });
  }
});

function backgroundFunction() {
  // Your background function code here
  // if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timeSeconds", "timerIsRunning"], (res) => {
      // If timer is not running, let's not do anything
      if (!res.timerIsRunning) {
        return;
      }
      let newTimeSeconds = Math.max(res.timeSeconds - 1, 0);
      chrome.storage.local.set({ "timeSeconds": newTimeSeconds }, () => {
        console.log("timeSeconds is set to " + newTimeSeconds);
      });

      // When we reach 0, let's clear the timer
      if (newTimeSeconds === 0) {
        // chrome.alarms.clear("pomodoroTimer");
        chrome.notifications.create({
          type: "basic",
          iconUrl: "assets/cat-awake.svg",
          title: "Pomodoro Timer",
          message: "The timer has ended!",
        });

        chrome.storage.local.set({ "timerIsRunning": false }, () => {
          console.log("timerIsRunning is set to " + false);
        });
      }
    });
  // }
}
