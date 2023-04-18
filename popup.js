
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
  
    // change image to "cat-asleep.svg" when timer starts
    const img = document.getElementById("imgClick");
    img.src = 'assets/cat-asleep.svg'
  
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
        img.src = 'assets/cat-awake.svg'
  
        // Call the Cataas API to generate a random cat image
        fetch('https://cataas.com/cat/says/timer%20iz%20done?width=100&height=100&json=true')
          .then(response => response.json())
          .then(data => {
            const imgSrc = `https://cataas.com${data.url}`;
  
            // Save the image, time, and date to your-cafe.html
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
              <img src="${imgSrc}" class="pixelated">
              <p>Time: ${defaultTime} minutes</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            `;
            chrome.storage.local.get(['cards'], data => {
              const cards = data.cards || [];
              cards.push(card.outerHTML);
              chrome.storage.local.set({cards});
            });
  
            // change page to timer-done.html when timer is done
            chrome.extension.getViews({type: "popup"}).forEach(function(win) {
              win.location.href = "timer-done.html";
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
    const img = document.getElementById("imgClick");
    img.src='assets/cat-awake.svg'
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
    defaultTime = Math.max(defaultTime - 1, 1);
    timer.textContent = `${defaultTime.toString().padStart(2, '0')}:00`;
  }
  
  // Function to increase the time by 5 minutes
  function increaseTime() {
    defaultTime += 1;
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
  
    
  