if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});

const expensesList = [
  {
    id: 1,
    title: "Almoço",
    value: 50,
    category: "Alimentação",
    date: "01/01/2024",
    quantity: 2,
    currencyOfOrigin: "BRL",
    currencyToConvert: "USD",
  },
  {
    id: 2,
    title: "Jantar",
    value: 70,
    category: "Alimentação",
    date: "02/01/2024",
    quantity: 1,
    currencyOfOrigin: "BRL",
    currencyToConvert: "USD",
  },
];

document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const value = parseFloat(document.getElementById('value').value);
  const date = document.getElementById('date').value;
  const currencyOfOrigin = document.getElementById('currencyOfOrigin').value;
  const currencyToConvert = document.getElementById('currencyToConvert').value;
  const category = document.getElementById('category').value;

  const formatedDate = formatDate(date);

  const id = expensesList.length > 0
    ? Math.max(...expensesList.map(d => d.id)) + 1
    : 1;

  const expense = {
    id,
    title,
    quantity,
    value,
    formatedDate,
    currencyOfOrigin,
    currencyToConvert,
    category
  };

  expensesList.push(expense);

  this.reset();
  showNotification(`${title} adicionado com sucesso!`);
  renderCards();
});

function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

function renderCards() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  expensesList.forEach((item) => {
    const card = `
      <div class="card show" id="card-${item.id}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label style="font-size: larger;"><strong>${item.title}</strong></label>
              <div class="d-inline-flex align-items-top">
                <div class="tooltip lottie-container lottie-translate">
                  <lottie-player 
                    src="/edit-animation.json"
                    background="transparent"
                    speed="1"
                    style="width: 50px; height: 50px;"
                    hover
                    data-id="edit-${item.id}"
                  ></lottie-player>
                  <span class="tooltiptext">Editar item</span>
                </div>
                <div class="tooltip lottie-container">
                  <lottie-player 
                    src="/delete-animation.json"
                    background="transparent"
                    speed="1"
                    style="width: 50px; height: 50px;"
                    hover
                    data-id="${item.id}"
                  ></lottie-player>
                  <span class="tooltiptext">Deletar item</span>
                </div>
              </div>
            </div>
          <div class="divider"></div>
          <label><strong>Valor:</strong> ${item.value.toFixed(2).replace(".", ",")} ${item.currencyOfOrigin
      }</label>
          <label><strong>Categoria:</strong> ${item.category}</label>
          <label><strong>Data:</strong> ${item.date}</label>
          <label><strong>Quantidade:</strong> ${item.quantity}</label>
          <div class="divider"></div>
          
          <div >
              <div class="row">
                  <div class="col-6">
                      <div class="d-inline-flex align-items-center">
                          <span class="me-2">${item.currencyOfOrigin}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg> 
                          <span class="ms-2">${item.currencyToConvert}</span>
                      </div>
                  </div>
                  <div class="col-6 d-flex justify-content-end">
                      <strong>Total: </strong> ${(item.quantity * item.value)
        .toFixed(2)
        .replace(".", ",")} ${item.currencyToConvert}
                  </div>
              </div>
          </div>
      </div>
  `;

    container.innerHTML += card;
  });

  document.querySelectorAll("lottie-player").forEach((player) => {
    player.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      animateRemoval(id);
    });
  });
}

function animateRemoval(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.add("hide");
    card.ontransitionend = function () {
      removeCard(id);
    };
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

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

renderCards();

