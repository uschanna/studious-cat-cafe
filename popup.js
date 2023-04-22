
document.addEventListener('DOMContentLoaded', () => {
  // Define variables
  const timer = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const resetButton = document.getElementById('reset-button');
  const decreaseButton = document.getElementById('decrease-button');
  const increaseButton = document.getElementById('increase-button');
  
  const catContainer = document.getElementById('cat-container');
  let intervalId;
  let timerIsRunning = false;
  let defaultMinutes = 25;
  let defaultSeconds = defaultMinutes * 60;
  

  chrome.storage.local.get(["timeSeconds", "timerIsRunning", "timerIsDone"], (res) => {
    if (res.timeSeconds === undefined) {
      chrome.storage.local.set({ "timeSeconds": defaultSeconds }).then(() => {
        console.log("Value is set to " + defaultSeconds);
      });
    }
    if (res.timerIsRunning === undefined) {
      chrome.storage.local.set({ "timerIsRunning": false }).then(() => {
        console.log("timerIsRunning is set to " + false);
      });
    }
    if (res.timerIsDone === undefined) {
      chrome.storage.local.set({ "timerIsDone": false }).then(() => {
        console.log("timerIsDone is set to " + false);
      });
    }
  });

  // Add event listeners
  startButton.addEventListener('click', startTimer);
  resetButton.addEventListener('click', resetTimer);
  decreaseButton.addEventListener('click', decreaseTime);
  increaseButton.addEventListener('click', increaseTime);

  // Load the time from chrome storage
  chrome.storage.local.get(["timeSeconds"], (res) => {
    if (res.timeSeconds) {
      let displayMinutes = Math.floor(res.timeSeconds / 60);
      let displaySeconds = res.timeSeconds % 60;
      timer.textContent = `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
    }
  });

  // Load different page if timer is done
  timerIsDone();

  // Call it once before so that the state is set immediately
  timeDecrement();

  // timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;
  function timeDecrement() {
    chrome.storage.local.get(["timeSeconds", "timerIsRunning", "timerIsDone"], (res) => {
      let totalSeconds = res.timeSeconds;
      if (!res.timerIsRunning || res.timerIsDone) {
        return;
      }

      // None of these buttons should be clickable when timer is running
      startButton.disabled = true;
      resetButton.disabled = false;
      decreaseButton.disabled = true;
      increaseButton.disabled = true;

      // change image to "cat-asleep.svg" when timer starts
      const img = document.getElementById("imgClick");
      img.src = "assets/cat-asleep.svg";

      if (totalSeconds <= 0) {
        clearInterval(intervalId);
        timerIsRunning = false;
        startButton.disabled = false;
        decreaseButton.disabled = false;
        increaseButton.disabled = false;
        chrome.storage.local.set({ "timerIsDone": true }, () => {
          console.log("timerIsDone is set to " + true);
        });
        timerIsDone();
      } else {
        totalSeconds = Math.max(totalSeconds - 1, 0);
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;
        timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
        
        chrome.storage.local.set({ "timeSeconds": totalSeconds }, () => {
          console.log("timeSeconds is set to " + totalSeconds);
        });
      }

      chrome.storage.local.set({ "timerIsRunning": true }, () => {
        console.log("timerIsRunning is set to " + true);
      });

    });
  }

  intervalId = setInterval(timeDecrement, 1000);


  function timerIsDone() {
    // change image to "cat-awake.svg" when timer is done
    chrome.storage.local.get(["timerIsDone"], (res) => {
      if (!res.timerIsDone) {
        return;
      }
    });

    timer.textContent = "Done!";
    const img = document.getElementById("imgClick");
    img.src = "assets/cat-awake.svg";

    // Call the Cataas API to generate a random cat image
    fetch(
      "https://cataas.com/cat/says/timer%20iz%20done?width=300&height=200&size=50&json=true"
    )
      .then((response) => response.json())
      .then((data) => {
        const img = document.createElement("img");
        img.src = `https://cataas.com${data.url}`;
        img.classList.add("pixelated");
        catContainer.appendChild(img);
        
        // show "your-cafe-button" when timer is done
        document.getElementById("your-cafe-button").style.display = "block";

        // Save the image, time, and date to your-cafe.html
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img src="${img.src}" class="pixelated">
        <p>Time: ${defaultMinutes} minutes</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      `;
        chrome.storage.local.get(["cards"], (data) => {
          const cards = data.cards || [];
          cards.push(card.outerHTML);
          chrome.storage.local.set({ cards });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Function to start the timer
  function startTimer() {
    chrome.storage.local.get(["timer", "timeSeconds", "timerIsRunning"], (res) => {
      timerIsRunning = true;

      timeDecrement();
      
      chrome.storage.local.set({ "timerIsRunning": timerIsRunning }, () => {
        console.log("timerIsRunning is set to " + timerIsRunning);
      });
    });
  }
  
  
  // Function to reset the timer
  function resetTimer() {
    const img = document.getElementById("imgClick");
    img.src='assets/cat-awake.svg'
    clearInterval(intervalId);
    timerIsRunning = false;
    startButton.disabled = false;
    resetButton.disabled = true;
    decreaseButton.disabled = false;
    increaseButton.disabled = false;
    catContainer.innerHTML = '';
    chrome.storage.local.set({ "timeSeconds": defaultSeconds, "timerIsRunning": false, "timerIsDone": false }, () => {
      console.log("in resetTimer: timeSeconds is set to " + defaultSeconds);
      console.log("in resetTimer: timerIsRunning is set to " + false);
      console.log("in resetTimer: timerIsDone is set to " + false);
    });

    let displayMinutes = Math.floor(defaultSeconds / 60);
    let displaySeconds = defaultSeconds % 60;
    timer.textContent = `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  }
  
  // Function to decrease the time by 1 minutes
  function decreaseTime() {
    chrome.storage.local.get(["timeSeconds"], (res) => {
      timeSeconds = Math.max(res.timeSeconds - 60, 60);
      let minutes = res.timeSeconds / 60;
      chrome.storage.local.set({ "timeSeconds": timeSeconds }, () => {
        timer.textContent = `${minutes.toString().padStart(2, '0')}:00`;
      });
    });
  }
  
  // Function to increase the time by 1 minutes
  function increaseTime() {
    chrome.storage.local.get(["timeSeconds"], (res) => {
      timeSeconds = res.timeSeconds + 60;
      let minutes = timeSeconds / 60;
      chrome.storage.local.set({ "timeSeconds": timeSeconds }, () => {
        timer.textContent = `${minutes.toString().padStart(2, '0')}:00`;
      });
    });
  }
  
  // Function to open the settings page
  function openSettings() {
    // TODO: Implement the settings page
  }
    
    
  // add an event listener for "your-cafe-button" that opens your-cafe.html in a new tab
  //document.getElementById("your-cafe-button").addEventListener("click", function() {
  //    chrome.tabs.create({url: "your-cafe.html"});
  //});
  
  document.getElementById("your-cafe-button").addEventListener("click", function() {
      chrome.extension.getViews({type: "popup"}).forEach(function(win) {
        win.location.href = "your-cafe.html";
      });
    });
  });

chrome.runtime.connect({ name: "popup" });

window.addEventListener('resize', function() {
  // Your code to handle the load event
  chrome.runtime.sendMessage({ popupClosed: false });
});
