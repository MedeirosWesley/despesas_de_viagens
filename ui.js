import { setFormData } from './expense.js';
import ExpenseStorageManager from './storage.js';

const expenseStorageManager = new ExpenseStorageManager('expenses');

export function renderCards() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  const expensesList = expenseStorageManager.getExpenses();

  if (expensesList.length === 0) {
    container.innerHTML = '<p>Nenhuma despesa registrada.</p>';
    return;
  }

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
      const dataId = event.target.getAttribute("data-id");
      const action = dataId.split('-')[0];
      const id = dataId.split('-').slice(1).join('-');  // Junta as partes do ID se for dividido por '-'

      if (action === 'delete') {
        animateRemoval(id);
      } else if (action === 'edit') {
        const expensesList = expenseStorageManager.getExpenses();
        const expense = expensesList.find(expense => expense.id == id);

        if (expense) {
          localStorage.setItem('edit', JSON.stringify(expense));
          setFormData(expense);
          document.getElementById('submit').innerText = "Editar Despesa";
        }
      }

    });
  });
}

function animateRemoval(id) {
  const card = document.getElementById(`card-${id}`);

  if (confirm("Você tem certeza que deseja remover esta despesa?")) {
    if (card) {
      card.classList.add("hide");
      card.ontransitionend = () => removeCard(id);
    }
  }
}

function removeCard(id) {
  expenseStorageManager.removeExpense(id);

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.remove();
  }

  showNotification(`Despesa removida com sucesso!`);
}

export function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => notification.classList.remove("show"), 3000);
}
