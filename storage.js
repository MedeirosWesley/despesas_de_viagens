export default class Storage {
    constructor(key) {
        this.storageKey = key;
    }

    getExpenses() {
        const expenses = localStorage.getItem(this.storageKey);
        return expenses ? JSON.parse(expenses) : [];
    }

    saveExpenses(expenses) {
        localStorage.setItem(this.storageKey, JSON.stringify(expenses));
    }

    addExpense(expense) {
        const expenses = this.getExpenses();
        expenses.push(expense);
        this.saveExpenses(expenses);
    }

    removeExpense(id) {
        const expenses = this.getExpenses();

        const filteredExpenses = expenses.filter(expense => String(expense.id) !== String(id));

        this.saveExpenses(filteredExpenses);
    }
}
