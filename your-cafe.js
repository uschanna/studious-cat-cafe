// Retrieve the last study time and display it in the footer
chrome.storage.local.get('lastStudyTime', function(data) {
    document.getElementById('last-study-time').textContent = data.lastStudyTime;
  });
  
  // Retrieve the saved cat images and add them to the container
  chrome.storage.local.get('savedCats', function(data) {
    var savedCats = data.savedCats || [];
  
    savedCats.forEach(function(catUrl) {
      var img = document.createElement('img');
      img.src = catUrl;
      document.getElementById('saved-cats-container').appendChild(img);
    });
  });
  