// Add an event listener for the settings button
document.getElementById("settings-button").addEventListener("click", function() {
    // Open the settings page in a new tab
    chrome.tabs.create({ url: "settings.html" });
  });
  // pomodoro timer
  function startTimer() {
    timerIsRunning = true;
    startButton.disabled = true;
    resetButton.disabled = false;
    decreaseButton.disabled = true;
    increaseButton.disabled = true;
    settingsButton.disabled = true;
  
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
        settingsButton.disabled = false;
  
        // Call the Cataas API to generate a random cat image
        fetch('https://cataas.com/cat?json=true')
          .then(response => response.json())
          .then(data => {
            const catImageUrl = `https://cataas.com/cat/${data.id}`;
            // Use the cat image URL to display the cat image
            // (e.g. create an <img> element with the src attribute set to catImageUrl)
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
  
// add an event listener for "your-cafe-button" that opens your-cafe.html in a new tab
document.getElementById("your-cafe-button").addEventListener("click", function() {
    chrome.tabs.create({url: "your-cafe.html"});
});