"use strict";

let totalIncomeCents = 0;
let totalExpenseCents = 0;

const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeInput = document.getElementById("income-input");
const expenseInput = document.getElementById("expense-input");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const netBalance = document.getElementById("net-balance");

const amountFormatter = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2,
});

function formatCents(cents) {
    return amountFormatter.format(cents / 100);
}

function updateSummary() {
    const netCents = totalIncomeCents - totalExpenseCents;

    totalIncome.textContent = formatCents(totalIncomeCents);
    totalExpenses.textContent = formatCents(totalExpenseCents);
    netBalance.textContent = formatCents(netCents);
    netBalance.classList.toggle("is-negative", netCents < 0);
}

function addAmount(event, type) {
    event.preventDefault();

    const isIncome = type === "income";
    const input = isIncome ? incomeInput : expenseInput;
    const amount = Number.parseFloat(input.value);

    if (!Number.isFinite(amount) || amount <= 0) return;

    const cents = Math.round(amount * 100);

    if (isIncome) {
        totalIncomeCents += cents;
    } else {
        totalExpenseCents += cents;
    }

    input.value = "";
    updateSummary();
    input.focus();
}

incomeForm.addEventListener("submit", (event) => addAmount(event, "income"));
expenseForm.addEventListener("submit", (event) => addAmount(event, "expense"));

updateSummary();
