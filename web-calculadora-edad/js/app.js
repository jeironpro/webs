const birthDateInput = document.getElementById("birthDate");
const calculateButton = document.getElementById("calculateButton");
const resultCard = document.getElementById("resultCard");
const ageText = document.getElementById("ageText");

function parseDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function getAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(birthDate.getFullYear(), birthDate.getMonth() + 1, 0).getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years, months, days };
}

function formatUnit(value, singular, plural) {
    return `${value} ${value === 1 ? singular : plural}`;
}

function hideResult() {
    resultCard.classList.remove("is-visible");
    resultCard.classList.add("is-hidden");
}

function calculateAge() {
    if (!birthDateInput.value) {
        alert("Por favor selecciona una fecha de nacimiento");
        return;
    }

    const birthDate = parseDate(birthDateInput.value);
    const currentDate = new Date();

    if (birthDate > currentDate) {
        alert("La fecha de nacimiento no puede ser futura");
        hideResult();
        return;
    }

    const { years, months, days } = getAge(birthDate, currentDate);

    ageText.textContent = `Tienes ${formatUnit(years, "año", "años")}, ${formatUnit(months, "mes", "meses")} y ${formatUnit(days, "día", "días")}`;

    resultCard.classList.remove("is-hidden");
    resultCard.classList.add("is-visible");
}

calculateButton.addEventListener("click", calculateAge);
birthDateInput.addEventListener("input", hideResult);
