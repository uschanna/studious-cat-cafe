document.addEventListener('DOMContentLoaded', () => {
let totalSeconds = 1500;
let timerIsRunning = false;
let timerInterval;

function startTimer() {
  if (!timerIsRunning) {
    timerIsRunning = true;
    chrome.alarms.create({delayInMinutes: totalSeconds/60}, function(alarm) {
      timerIsRunning = false;
      clearInterval(timerInterval);
      changeImage();
    });
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateTime();
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerIsRunning = false;
        changeImage();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  totalSeconds = 1500;
  timerIsRunning = false;
  updateTime();
  document.getElementById("imgClick").src = "assets/cat-awake.svg";
}

function increaseTime() {
  totalSeconds += 300;
  displayTime();
}

function decreaseTime() {
  if (totalSeconds >= 300) {
    totalSeconds -= 300;
    displayTime();
  }
}

document.getElementById("start-button").addEventListener("click", startTimer);
document.getElementById("reset-button").addEventListener("click", resetTimer);
document.getElementById("increase-button").addEventListener("click", increaseTime);
document.getElementById("decrease-button").addEventListener("click", decreaseTime);

  
  
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

  