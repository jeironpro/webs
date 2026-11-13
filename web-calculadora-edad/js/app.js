const form = document.querySelector("#age-form");
const birthDateInput = document.querySelector("#birth-date");
const errorMessage = document.querySelector("#form-error");
const resultCard = document.querySelector("#result-card");
const ageText = document.querySelector("#age-text");

if (!form || !birthDateInput || !errorMessage || !resultCard || !ageText) {
    throw new Error("No se encontraron los elementos de la calculadora");
}

const MILLISECONDS_PER_DAY = 86_400_000;

const formatUnit = (value, singular, plural) => `${value} ${value === 1 ? singular : plural}`;

const parseDate = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const addMonths = (date, months) => {
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const daysInTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    target.setDate(Math.min(date.getDate(), daysInTargetMonth));
    return target;
};

const getAge = (birthDate, currentDate) => {
    let months =
        (currentDate.getFullYear() - birthDate.getFullYear()) * 12 +
        currentDate.getMonth() -
        birthDate.getMonth();
    let anchor = addMonths(birthDate, months);

    if (anchor > currentDate) {
        months -= 1;
        anchor = addMonths(birthDate, months);
    }

    const days = Math.round((currentDate - anchor) / MILLISECONDS_PER_DAY);

    return {
        years: Math.floor(months / 12),
        months: months % 12,
        days,
    };
};

const hideResult = () => {
    resultCard.hidden = true;
    ageText.textContent = "";
};

const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    birthDateInput.setAttribute("aria-invalid", "true");
    birthDateInput.focus();
    hideResult();
};

const clearError = () => {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
    birthDateInput.setAttribute("aria-invalid", "false");
};

const calculateAge = (event) => {
    event.preventDefault();

    if (!birthDateInput.value) {
        showError("Selecciona una fecha de nacimiento.");
        return;
    }

    const birthDate = parseDate(birthDateInput.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (birthDate > currentDate) {
        showError("La fecha de nacimiento no puede ser futura.");
        return;
    }

    clearError();

    const { years, months, days } = getAge(birthDate, currentDate);
    ageText.textContent = `Tienes ${formatUnit(years, "año", "años")}, ${formatUnit(
        months,
        "mes",
        "meses"
    )} y ${formatUnit(days, "día", "días")}.`;
    resultCard.hidden = false;
};

const setMaxDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60_000;
    birthDateInput.max = new Date(today.getTime() - offset).toISOString().slice(0, 10);
};

setMaxDate();

form.addEventListener("submit", calculateAge);
birthDateInput.addEventListener("input", () => {
    clearError();
    hideResult();
});
