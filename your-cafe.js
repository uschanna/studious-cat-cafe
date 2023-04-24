document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('card-container');
  const totalMinutes = document.getElementById('total-minutes');

  function updateCardContainer() {
    chrome.storage.local.get(['cards'], data => {
      const cards = data.cards || [];
      cardContainer.innerHTML = '';
      let totalMinutes = 0; // Initialize total to 0
      if (cards.length === 0) {
        showEmptyState();
      } else {
        cards.forEach(card => {
          const row = document.createElement('tr');
          row.innerHTML = card;
          cardContainer.appendChild(row);
  
          // Extract the time from the card text and add it to the total
          const time = parseInt(card.match(/(\d+) minutes/)[1]);
          totalMinutes += time;
        });
      }
  
      // Display the total number of minutes
      const totalMinutesElement = document.getElementById('total-minutes');
      const catCash = totalMinutes / 10;
      totalMinutesElement.textContent = `Total time spent: ${totalMinutes} minutes; ${catCash} cat cash`;
    });
  }
  

  function showEmptyState() {
    cardContainer.innerHTML = `
      <div class="empty-state">
        <img src="assets/empty-state.svg" alt="Empty State">
        <p>There are no saved cards yet.</p>
      </div>
    `;
  }

  updateCardContainer();

  document.getElementById('clear-button').addEventListener('click', () => {
    chrome.storage.local.set({cards: []}, () => {
      updateCardContainer();
    });
  });
});
