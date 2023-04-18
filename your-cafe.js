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
  
  // Function to clear all the cards
  function clearCards() {
    chrome.storage.local.set({cards: []}, () => {
      cardContainer.innerHTML = '';
    });
  }

  // empty state if there are no cards
  if (cardContainer.innerHTML === '') {
    cardContainer.innerHTML = `
      <div class="empty-state">
        <img src="assets/empty-state.svg" alt="Empty State">
        <p>There are no saved cards yet.</p>
      </div>
    `;
  }