import {
    EMPTY_TOTALS,
    grantStorageConsent,
    hasStorageConsent,
    readStoredTotals,
    revokeStorageConsent,
    saveStoredTotals,
} from "./storage.js";

const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");
const incomeInput = document.getElementById("income-input");
const expenseInput = document.getElementById("expense-input");
const totalIncome = document.getElementById("total-income");
const totalExpenses = document.getElementById("total-expenses");
const netBalance = document.getElementById("net-balance");

const banner = document.getElementById("storage-consent");
const acceptButton = document.getElementById("storage-consent-accept");
const declineButton = document.getElementById("storage-consent-decline");
const revokeButton = document.getElementById("storage-consent-revoke");
const reopenButton = document.getElementById("storage-consent-reopen");
const consentError = banner.querySelector("[data-consent-error]");
const consentCopies = {
    initial: banner.querySelector("[data-consent-initial]"),
    declined: banner.querySelector("[data-consent-declined]"),
    active: banner.querySelector("[data-consent-active]"),
    confirm: banner.querySelector("[data-consent-confirm]"),
};

let savedTotals = readStoredTotals();
let totalIncomeCents = savedTotals.incomeCents;
let totalExpenseCents = savedTotals.expenseCents;
let consentPhase = "initial";

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
    netBalance.classList.toggle("summary-card__value--negative", netCents < 0);
}

function persistTotals() {
    if (!hasStorageConsent()) return false;
    return saveStoredTotals(null, {
        incomeCents: totalIncomeCents,
        expenseCents: totalExpenseCents,
    });
}

function setConsentPhase(phase) {
    consentPhase = phase;
    banner.dataset.phase = phase;

    Object.entries(consentCopies).forEach(([name, copy]) => {
        copy.hidden = name !== phase;
    });

    acceptButton.hidden = phase !== "initial" && phase !== "declined";
    acceptButton.textContent =
        phase === "initial" ? "Guardar en este navegador" : "Activar guardado";
    revokeButton.hidden = phase !== "active" && phase !== "confirm";
    declineButton.textContent =
        phase === "initial"
            ? "Ahora no"
            : phase === "declined"
              ? "Entendido"
              : phase === "active"
                ? "Cerrar"
                : "Cancelar";
    revokeButton.textContent =
        phase === "confirm" ? "Sí, borrar totales" : "Retirar permiso y borrar totales";

    consentError.hidden = true;
    banner.hidden = false;
    reopenButton.hidden = true;
    document.body.classList.add("has-storage-banner");
}

function dismissConsent() {
    banner.hidden = true;
    document.body.classList.remove("has-storage-banner");
    reopenButton.hidden = false;
    reopenButton.focus();
}

function acceptStorage() {
    if (!grantStorageConsent()) {
        consentError.hidden = false;
        return;
    }

    const saved = persistTotals();
    if (!saved) {
        consentError.hidden = false;
        return;
    }

    setConsentPhase("active");
}

function revokeStorage() {
    if (!revokeStorageConsent()) {
        consentError.hidden = false;
        return;
    }

    totalIncomeCents = EMPTY_TOTALS.incomeCents;
    totalExpenseCents = EMPTY_TOTALS.expenseCents;
    updateSummary();
    setConsentPhase("initial");
}

function handleDecline() {
    if (consentPhase === "initial") {
        setConsentPhase("declined");
        return;
    }
    if (consentPhase === "confirm") {
        setConsentPhase("active");
        return;
    }
    dismissConsent();
}

function handleRevoke() {
    if (consentPhase === "active") {
        setConsentPhase("confirm");
        revokeButton.focus();
        return;
    }
    if (consentPhase === "confirm") {
        revokeStorage();
    }
}

function openConsent() {
    setConsentPhase(hasStorageConsent() ? "active" : "initial");
    if (hasStorageConsent()) revokeButton.focus();
    else acceptButton.focus();
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
    persistTotals();
    input.focus();
}

incomeForm.addEventListener("submit", (event) => addAmount(event, "income"));
expenseForm.addEventListener("submit", (event) => addAmount(event, "expense"));

acceptButton.addEventListener("click", acceptStorage);
declineButton.addEventListener("click", handleDecline);
revokeButton.addEventListener("click", handleRevoke);
reopenButton.addEventListener("click", openConsent);

updateSummary();

if (hasStorageConsent()) {
    reopenButton.hidden = false;
} else {
    setConsentPhase("initial");
}
