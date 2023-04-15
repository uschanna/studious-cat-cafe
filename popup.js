document.addEventListener('DOMContentLoaded', () => {
// Define variables
const timer = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const resetButton = document.getElementById('reset-button');
  const decreaseButton = document.getElementById('decrease-button');
  const increaseButton = document.getElementById('increase-button');

const catContainer = document.getElementById('cat-container');
let timerInterval;
let timerIsRunning = false;
let defaultTime = 25;

// Add event listeners
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
decreaseButton.addEventListener('click', decreaseTime);
increaseButton.addEventListener('click', increaseTime);

// Set default time on page load
timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;

// Function to start the timer
function startTimer() {
  timerIsRunning = true;
  startButton.disabled = true;
  resetButton.disabled = false;
  decreaseButton.disabled = true;
  increaseButton.disabled = true;

  let minutes = parseInt(timer.textContent.split(':')[0]);
  let seconds = parseInt(timer.textContent.split(':')[1]);
  let totalSeconds = minutes * 60 + seconds;

  // Send a message to the background script to start the timer
  chrome.runtime.sendMessage({action: 'startTimer', totalSeconds});

  // Listen for a message from the background script with the remaining time
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateTimer') {
      totalSeconds = message.remainingTime;
      minutes = Math.floor(totalSeconds / 60);
      seconds = totalSeconds % 60;
      timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      if (totalSeconds <= 0) {
        timerIsRunning = false;
        startButton.disabled = false;
        decreaseButton.disabled = false;
        increaseButton.disabled = false;

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
      }
    }
  });
}


// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval);
  timerIsRunning = false;
  startButton.disabled = false;
  resetButton.disabled = true;
  decreaseButton.disabled = false;
  increaseButton.disabled = false;
  timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;
  catContainer.innerHTML = '';
}

// Function to decrease the time by 5 minutes
function decreaseTime() {
  defaultTime = Math.max(defaultTime - 5, 5);
  timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;
}

// Function to increase the time by 5 minutes
function increaseTime() {
  defaultTime += 5;
  timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;
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

  