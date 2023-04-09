document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
  
    chrome.storage.local.get(['cards'], data => {
      const cards = data.cards || [];
      cards.forEach(card => {
        const row = document.createElement('tr');
        row.innerHTML = card;
        cardContainer.appendChild(row);
      });
    });
  });
  