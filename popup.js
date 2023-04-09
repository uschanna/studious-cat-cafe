// pomodoro timer
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
            document.getElementById('cat-container').appendChild(img);
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
//document.getElementById("your-cafe-button").addEventListener("click", function() {
//    chrome.tabs.create({url: "your-cafe.html"});
//});

document.getElementById("your-cafe-button").addEventListener("click", function() {
    chrome.extension.getViews({type: "popup"}).forEach(function(win) {
      win.location.href = "your-cafe.html";
    });
  });
  