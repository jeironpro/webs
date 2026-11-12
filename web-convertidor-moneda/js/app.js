const RATES_API_URL = "https://open.er-api.com/v6/latest/USD";
let ratesCache = null;

async function fetchRates() {
    if (ratesCache !== null) {
        return ratesCache;
    }
    const response = await fetch(RATES_API_URL);
    if (!response.ok) {
        throw new Error(`No se pudieron obtener las tasas (${response.status})`);
    }
    const payload = await response.json();
    if (payload.result !== "success" || !payload.rates) {
        throw new Error("La respuesta de tasas no es válida");
    }
    ratesCache = payload.rates;
    return ratesCache;
}

function getSelectedCurrency(id) {
    return document.getElementById(id).value;
}

function fillSelectors(rates) {
    const currencies = Object.keys(rates).sort();
    ["from-select", "to-select"].forEach((id) => {
        const select = document.getElementById(id);
        select.replaceChildren();
        currencies.forEach((currency) => {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = currency;
            select.appendChild(option);
        });
    });
    document.getElementById("from-select").value = "USD";
    document.getElementById("to-select").value = "EUR";
}

async function loadCurrencies() {
    const resultBox = document.getElementById("result-box");
    try {
        const rates = await fetchRates();
        fillSelectors(rates);
        resultBox.textContent = "";
    } catch (error) {
        resultBox.textContent = "No se pudieron cargar las monedas. Revisa tu conexión.";
        console.error(error);
    }
}

function showResult(text) {
    document.getElementById("result-box").textContent = text;
}

async function convertCurrency() {
    const fromCurrency = getSelectedCurrency("from-select");
    const toCurrency = getSelectedCurrency("to-select");
    const rawAmount = document.getElementById("amount-input").value.trim();
    const amount = Number(rawAmount);

    if (rawAmount === "" || !Number.isFinite(amount) || amount < 0) {
        showResult("Escribe una cantidad válida.");
        return;
    }

    try {
        const rates = await fetchRates();
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        if (!fromRate || !toRate) {
            throw new Error("Moneda no disponible");
        }
        const converted = (amount / fromRate) * toRate;
        showResult(`${amount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`);
    } catch (error) {
        showResult("No se pudo hacer la conversión. Inténtalo de nuevo.");
        console.error(error);
    }
}

function swapCurrencies() {
    const fromSelect = document.getElementById("from-select");
    const toSelect = document.getElementById("to-select");
    const fromValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = fromValue;
    showResult("");
}

document.querySelector(".convert-button").addEventListener("click", convertCurrency);
document.getElementById("swap-control").addEventListener("click", swapCurrencies);
loadCurrencies();
