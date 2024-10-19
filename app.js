import ExpenseStorageManager from './storage.js';
import {getFormData} from './expense.js';
import { renderCards, showNotification } from './ui.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registered with scope:', registration.scope))
        .catch(error => console.error('Service Worker registration failed:', error));
}

const expenseStorageManager = new ExpenseStorageManager('expenses');

document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const expense = await getFormData();
    expenseStorageManager.addExpense(expense);

    this.reset();
    showNotification(`${expense.title} adicionado com sucesso!`);
    renderCards();
});

renderCards();
