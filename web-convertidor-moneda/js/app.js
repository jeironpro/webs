const RATES_API_URL = "https://open.er-api.com/v6/latest/USD";
let ratesCache = null;

const fromSelect = document.querySelector("#from-select");
const toSelect = document.querySelector("#to-select");
const amountInput = document.querySelector("#amount-input");
const resultBox = document.querySelector("#result-box");
const swapControl = document.querySelector("#swap-control");
const convertButton = document.querySelector(".convert-button");

const fetchRates = async () => {
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
};

const fillSelectors = (rates) => {
    const currencies = Object.keys(rates).sort();

    [fromSelect, toSelect].forEach((select) => {
        select.replaceChildren();
        currencies.forEach((currency) => {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = currency;
            select.append(option);
        });
    });

    fromSelect.value = "USD";
    toSelect.value = "EUR";
};

const showResult = (text) => {
    resultBox.textContent = text;
};

const loadCurrencies = async () => {
    showResult("Cargando monedas…");

    try {
        const rates = await fetchRates();
        fillSelectors(rates);
        showResult("");
    } catch {
        showResult("No se pudieron cargar las monedas. Revisa tu conexión.");
    }
};

const convertCurrency = async () => {
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;
    const rawAmount = amountInput.value.trim();
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
    } catch {
        showResult("No se pudo hacer la conversión. Inténtalo de nuevo.");
    }
};

const swapCurrencies = () => {
    const fromValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = fromValue;
    showResult("");
};

convertButton.addEventListener("click", convertCurrency);
swapControl.addEventListener("click", swapCurrencies);
loadCurrencies();
