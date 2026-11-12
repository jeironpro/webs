const MONTH_NAMES = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
];

const WEEKDAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

function getFirstWeekday(year, month) {
    // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    // Se ajusta para que 1 = Lunes, ..., 7 = Domingo
    const weekday = new Date(year, month, 1).getDay();
    return weekday === 0 ? 7 : weekday;
}

function renderCurrentYear() {
    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
}

function renderCalendar() {
    const currentDate = new Date();
    const calendarYear = currentDate.getFullYear();

    const calendar = document.getElementById("calendar");
    const title = document.getElementById("calendarTitle");

    calendar.replaceChildren();
    title.textContent = `Calendario ${calendarYear}`;

    for (let month = 0; month < 12; month++) {
        const monthSection = document.createElement("section");
        monthSection.classList.add("month");
        monthSection.setAttribute(
            "aria-label",
            `Calendario de ${MONTH_NAMES[month]} de ${calendarYear}`
        );

        const monthTitle = document.createElement("h2");
        monthTitle.classList.add("month__title");
        monthTitle.textContent = MONTH_NAMES[month];
        monthSection.appendChild(monthTitle);

        const daysTable = document.createElement("div");
        daysTable.classList.add("days");

        const weekdayRow = document.createElement("div");
        weekdayRow.classList.add("weekdays");
        WEEKDAY_LABELS.forEach((label) => {
            const weekday = document.createElement("div");
            weekday.classList.add("weekday");
            weekday.textContent = label;
            weekdayRow.appendChild(weekday);
        });
        daysTable.appendChild(weekdayRow);

        const daysGrid = document.createElement("div");
        daysGrid.classList.add("days__grid");

        const daysInMonth = new Date(calendarYear, month + 1, 0).getDate();
        const firstWeekday = getFirstWeekday(calendarYear, month);

        for (let i = 1; i < firstWeekday; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("day", "is-empty");
            daysGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("day");

            const weekdayIndex = (firstWeekday - 1 + day - 1) % 7;
            if (weekdayIndex >= 5) {
                dayCell.classList.add("is-weekend");
            }

            const isToday =
                calendarYear === currentDate.getFullYear() &&
                month === currentDate.getMonth() &&
                day === currentDate.getDate();

            if (isToday) {
                dayCell.classList.add("is-today");
                dayCell.setAttribute("aria-current", "date");
            }

            dayCell.textContent = day;
            daysGrid.appendChild(dayCell);
        }

        daysTable.appendChild(daysGrid);
        monthSection.appendChild(daysTable);
        calendar.appendChild(monthSection);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();
    renderCurrentYear();
});
