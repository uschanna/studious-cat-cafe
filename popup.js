document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const resetButton = document.getElementById('reset-button');
  const decreaseButton = document.getElementById('decrease-button');
  const increaseButton = document.getElementById('increase-button');
  const imgClick = document.getElementById('imgClick');
  const outerBox = document.getElementById('outer-box');
  let timerInterval;
  let totalSeconds = 1500;
  let timerIsRunning = false;
  const alarmName = 'pomodoro';
  
  chrome.runtime.sendMessage({ type: 'GET_ALARM', name: alarmName }, response => {
    if (response.alarm) {
      totalSeconds = Math.round((response.alarm.scheduledTime - Date.now()) / 1000);
      timerDisplay.innerText = `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
    }
  });
  
  function startTimer() {
    timerIsRunning = true;
    startButton.disabled = true;
    resetButton.disabled = false;
    decreaseButton.disabled = true;
    increaseButton.disabled = true;
    // change image to "cat-asleep.svg" when timer starts
    const img = document.getElementById("imgClick");
    img.src='assets/cat-asleep.svg'

    let minutes = parseInt(timer.textContent.split(':')[0]);
    let seconds = parseInt(timer.textContent.split(':')[1]);
    let totalSeconds = minutes * 60 + seconds;

    timerInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerIsRunning = false;
        startButton.disabled = false;
        decreaseButton.disabled = false;
        increaseButton.disabled = false;
        // change image to "cat-awake.svg" when timer is done
        img.src='assets/cat-awake.svg'

        // Call the Cataas API to generate a random cat image
        fetch('https://cataas.com/cat?json=true')
          .then(response => response.json())
          .then(data => {
            const img = document.createElement('img');
            img.src = `https://cataas.com${data.url}`;
            img.classList.add('pixelated');
            catContainer.appendChild(img);

            // Save the image, time, and date to your-cafe.html
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
              <img src="${img.src}" class="pixelated">
              <p>Time: ${defaultTime} minutes</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            `;
            chrome.storage.local.get(['cards'], data => {
              const cards = data.cards || [];
              cards.push(card.outerHTML);
              chrome.storage.local.set({cards});
            });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        totalSeconds--;
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;
        timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    timerIsRunning = false;
    startButton.disabled = false;
    decreaseButton.disabled = false;
    increaseButton.disabled = false;
    totalSeconds = 1500;
    timerDisplay.innerText = "25:00";
    imgClick.src = "assets/cat-awake.svg";
    outerBox.style.border = "";
    chrome.alarms.clear(alarmName);
  }
  
  function increaseTime() {
    if (!timerIsRunning && totalSeconds < 3600) {
      totalSeconds += 300;
      timerDisplay.innerText = `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
    }
  }
  
  function decreaseTime() {
    if (!timerIsRunning && totalSeconds > 300) {
      totalSeconds -= 300;
      timerDisplay.innerText = `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
    }
  }
  
  startButton.addEventListener("click", startTimer);
  resetButton.addEventListener("click", resetTimer);
  decreaseButton.addEventListener("click", decreaseTime);
  increaseButton.addEventListener("click", increaseTime);
   
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

  