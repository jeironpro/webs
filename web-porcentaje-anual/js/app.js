const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const currentYearText = document.querySelector("#current-year-text");
const remainingDaysText = document.querySelector("#remaining-days");
const daysGrid = document.querySelector("#days-grid");
const percentageValue = document.querySelector("#percentage-value");
const progressBar = document.querySelector("#progress");

const getDateInfo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;
    const yearStart = Date.UTC(year, 0, 1);
    const currentDate = Date.UTC(year, today.getMonth(), today.getDate());
    const currentDay = Math.floor((currentDate - yearStart) / MILLISECONDS_PER_DAY) + 1;

    return {
        year,
        currentDay,
        totalDays,
    };
};

const generateDots = (totalDays, currentDay) => {
    const fragment = document.createDocumentFragment();

    for (let index = 1; index <= totalDays; index += 1) {
        const dot = document.createElement("span");
        dot.className = "days__dot";
        dot.classList.toggle("is-complete", index <= currentDay);
        dot.dataset.tooltip = `Día ${index}`;
        fragment.appendChild(dot);
    }

    daysGrid.replaceChildren(fragment);
};

const updateView = () => {
    const { year, currentDay, totalDays } = getDateInfo();
    const exactPercentage = (currentDay / totalDays) * 100;
    const roundedPercentage = Math.round(exactPercentage);

    currentYearText.textContent = year;
    remainingDaysText.textContent = totalDays - currentDay;
    percentageValue.textContent = roundedPercentage;
    progressBar.value = exactPercentage;
    progressBar.setAttribute("aria-valuetext", `${roundedPercentage}% completado`);

    generateDots(totalDays, currentDay);
};

updateView();
