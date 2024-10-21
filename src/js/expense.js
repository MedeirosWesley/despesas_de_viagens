export function createExpense(id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount) {
    return { id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount };
}

export async function getFormData() {
    const title = document.getElementById('title').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const value = parseFloat(document.getElementById('value').value);
    const currencyOfOrigin = document.getElementById('currencyOfOrigin').value;
    const currencyToConvert = document.getElementById('currencyToConvert').value;
    const category = document.getElementById('category').value;
    const date = formatDate(document.getElementById('date').value);

    let expense = localStorage.getItem('edit') ? JSON.parse(localStorage.getItem('edit')) : null;

    const id = expense ? expense.id : generateNewId();
    const rate = await fetchExchangeRate(currencyOfOrigin, currencyToConvert);
    const amount = calculateConvertedAmount(quantity, value, rate);

    return createExpense(id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount);
}

export function setFormData(expense) {
    document.getElementById('title').value = expense.title;
    document.getElementById('quantity').value = parseInt(expense.quantity);
    document.getElementById('value').value = parseFloat(expense.value);
    document.getElementById('currencyOfOrigin').value = expense.currencyOfOrigin;
    document.getElementById('currencyToConvert').value = expense.currencyToConvert;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = formatDate(expense.date, true);
}

function generateNewId() {
    return crypto.randomUUID();
}

async function fetchExchangeRate(currencyFrom, currencyTo) {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);
    const data = await response.json();
    return data.rates[currencyTo];
}

function calculateConvertedAmount(quantity, amount, rate) {
    return (quantity * amount * rate).toFixed(2);
}

function formatDate(date, fromStorage = false) {
    if (fromStorage) {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    } else {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
}