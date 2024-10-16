if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => console.log('Service Worker registered with scope:', registration.scope))
    .catch(error => console.error('Service Worker registration failed:', error));
}

let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.style.display = 'block';
});

installButton?.addEventListener('click', () => {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    const outcomeMessage = choiceResult.outcome === 'accepted' 
      ? 'User accepted the install prompt' 
      : 'User dismissed the install prompt';
    console.log(outcomeMessage);
    deferredPrompt = null;
  });
});

const expensesList = [
  createExpense(1, "Almoço", 50, "Alimentação", "01/01/2024", 2, "BRL", "USD", 10),
  createExpense(2, "Jantar", 70, "Alimentação", "02/01/2024", 1, "BRL", "USD", 10)
];

function createExpense(id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount) {
  return { id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount };
}

document.getElementById('form').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const expense = await getFormData();
  expensesList.push(expense);

  this.reset();
  showNotification(`${expense.title} adicionado com sucesso!`);
  renderCards();
});

async function getFormData() {
  const title = document.getElementById('title').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const value = parseFloat(document.getElementById('value').value);
  const currencyOfOrigin = document.getElementById('currencyOfOrigin').value;
  const currencyToConvert = document.getElementById('currencyToConvert').value;
  const category = document.getElementById('category').value;
  const date = formatDate(document.getElementById('date').value);

  const id = generateNewId();
  const rate = await fetchExchangeRate(currencyOfOrigin, currencyToConvert);
  const amount = calculateConvertedAmount(quantity, value, rate);

  return createExpense(id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount);
}

function generateNewId() {
  return expensesList.length > 0 ? Math.max(...expensesList.map(d => d.id)) + 1 : 1;
}

async function fetchExchangeRate(currencyFrom, currencyTo) {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);
  const data = await response.json();
  return data.rates[currencyTo];
}

function calculateConvertedAmount(quantity, amount, rate) {
  return (quantity * amount * rate).toFixed(2);
}

function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function renderCards() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  expensesList.forEach(item => {
    const card = createCardTemplate(item);
    container.innerHTML += card;
  });

  addCardInteractions();
}

function createCardTemplate(item) {
  return `
    <div class="card show" id="card-${item.id}">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <label style="font-size: larger;"><strong>${item.title}</strong></label>
        <div class="d-inline-flex align-items-top">
          ${createLottieButton('edit', item.id, '/edit-animation.json', 'Editar item')}
          ${createLottieButton('delete', item.id, '/delete-animation.json', 'Deletar item')}
        </div>
      </div>
      <div class="divider"></div>
      ${createCardDetails(item)}
    </div>
  `;
}

function createCardDetails(item) {
  return `
    <label><strong>Valor:</strong> ${item.value.toFixed(2).replace(".", ",")} ${item.currencyOfOrigin}</label>
    <label><strong>Categoria:</strong> ${item.category}</label>
    <label><strong>Data:</strong> ${item.date}</label>
    <label><strong>Quantidade:</strong> ${item.quantity}</label>
    <div class="divider"></div>
    <div class="row">
      <div class="col-6">
        <div class="d-inline-flex align-items-center">
          <span class="me-2">${item.currencyOfOrigin}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
          </svg>
          <span class="ms-2">${item.currencyToConvert}</span>
        </div>
      </div>
      <div class="col-6 d-flex justify-content-end">
        <strong>Total: </strong> ${item.amount}
      </div>
    </div>
  `;
}

function createLottieButton(action, id, src, tooltipText) {
  return `
    <div class="tooltip lottie-container">
      <lottie-player 
        src="${src}"
        background="transparent"
        speed="1"
        style="width: 50px; height: 50px;"
        hover
        data-id="${action}-${id}"
      ></lottie-player>
      <span class="tooltiptext">${tooltipText}</span>
    </div>
  `;
}

function addCardInteractions() {
  document.querySelectorAll("lottie-player").forEach(player => {
    player.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id").split('-')[1];
      animateRemoval(id);
    });
  });
}

function animateRemoval(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add("hide");
    card.ontransitionend = () => removeCard(id);
  }
}

function removeCard(id) {
  const index = expensesList.findIndex((item) => item.id == id);
  const item = expensesList[index];
  if (index !== -1) {
    showNotification(`${item.title} removido com sucesso!`);
    expensesList.splice(index, 1);
  }

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.remove();
  }
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => notification.classList.remove("show"), 3000);
}

renderCards();
