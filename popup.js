// Define variables
const timer = document.getElementById('timer');
const startButton = document.getElementById('start-button').addEventListener('click', startTimer);
const resetButton = document.getElementById('reset-button').addEventListener('click', resetTimer);
const decreaseButton = document.getElementById('decrease-button').addEventListener('click', decreaseTime);
const increaseButton = document.getElementById('increase-button').addEventListener('click', increaseTime);
const catContainer = document.getElementById('cat-container');
let timerInterval;
let timerIsRunning = false;
let defaultTime = 25;

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

  timerInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerIsRunning = false;
      startButton.disabled = false;
      decreaseButton.disabled = false;
      increaseButton.disabled = false;

      // Call the Robohash API to generate a random cat image
      fetch('https://robohash.org/cat.png?size=200x200')
        .then(response => {
          const img = document.createElement('img');
          img.src = response.url;
          img.classList.add('pixelated');
          catContainer.appendChild(img);

          // Save the image, time, and date to your-cafe.html
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <img src="${response.url}" class="pixelated">
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
  

  