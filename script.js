// script.js
// Зчитування data.json і рендер карток, перемикання daily/weekly

let state = {
  range: 'daily',
  data: []
};

const cardsEl = document.getElementById('cards');
const rangeButtons = document.querySelectorAll('.range-btn');

function setActiveRange(range) {
  state.range = range;
  rangeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });
  renderCards();
}

function fetchData() {
  return fetch('data.json')
    .then(res => {
      if (!res.ok) throw new Error('Помилка завантаження data.json');
      return res.json();
    })
    .then(json => {
      state.data = json;
      renderCards();
    })
    .catch(err => {
      console.error(err);
      cardsEl.innerHTML = '<p style="color:#f88">Не вдалося завантажити data.json</p>';
    });
}

function renderCards() {
  if (!state.data.length) return;
  cardsEl.innerHTML = '';

  state.data.forEach(item => {
    const timeframe = item.timeframes[state.range];
    const prevLabel = state.range === 'daily' ? 'Yesterday' : 'Last Week';
    const titleClass = item.title.toLowerCase().replace(/\s+/g, '');

    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <div class="accent ${titleClass}"></div>
      <div class="content">
        <div class="title-row">
          <h3>${item.title}</h3>
          <div class="dots" title="options"></div>
        </div>

        <div>
          <div class="hours">${timeframe.current}hrs</div>
          <div class="small">${prevLabel} - ${timeframe.previous}hrs</div>
        </div>
      </div>
    `;
    cardsEl.appendChild(card);
  });
}

// attach listeners to range buttons
rangeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setActiveRange(btn.dataset.range);
  });
});

// инициaл
setActiveRange('daily');
fetchData();
