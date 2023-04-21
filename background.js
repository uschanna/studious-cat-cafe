chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = true;
        if (timer > res.timeOption * 60) {
          isRunning = false;
          chrome.notifications.create({
            type: "basic",
            iconUrl: "assets/cat-awake.svg",
            title: "Pomodoro Timer",
            message: "The timer has ended!",
          });
          // Save the image, time, and date to chrome.storage.local
          const date = new Date().toLocaleDateString();
          const time = res.timeOption;
          fetch(
            `https://cataas.com/cat/says/timer%20iz%20done?width=300&height=200&size=50&json=true`
          )
            .then((response) => response.json())
            .then((data) => {
              const img = `https://cataas.com${data.url}`;
              const cards = res.cards || [];
              cards.push({
                img,
                time,
                date,
              });
              chrome.storage.local.set({ cards });
            })
            .catch((error) => {
              console.log(error);
            });
        }
        chrome.storage.local.set({ timer, isRunning });
      }
    });
  }
});
