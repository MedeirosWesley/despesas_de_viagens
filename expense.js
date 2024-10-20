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

    const id = generateNewId();
    const rate = await fetchExchangeRate(currencyOfOrigin, currencyToConvert);
    const amount = calculateConvertedAmount(quantity, value, rate);

    return createExpense(id, title, value, category, date, quantity, currencyOfOrigin, currencyToConvert, amount);
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

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}