const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

const WEEKDAYS = [
    { short: "L", full: "lunes" },
    { short: "M", full: "martes" },
    { short: "X", full: "miércoles" },
    { short: "J", full: "jueves" },
    { short: "V", full: "viernes" },
    { short: "S", full: "sábado" },
    { short: "D", full: "domingo" },
];

const calendar = document.querySelector("#calendar");
const title = document.querySelector("#calendar-title");
const yearNodes = document.querySelectorAll("[data-year]");

if (!calendar || !title) {
    throw new Error("No se encontró el calendario");
}

const getFirstWeekday = (year, month) => {
    const weekday = new Date(year, month, 1).getDay();
    return weekday === 0 ? 7 : weekday;
};

const createMonth = (year, month, currentDate) => {
    const monthSection = document.createElement("section");
    monthSection.classList.add("calendar__month");
    monthSection.setAttribute("aria-labelledby", `calendar-month-${month}`);

    const monthTitle = document.createElement("h2");
    monthTitle.classList.add("calendar__month-title");
    monthTitle.id = `calendar-month-${month}`;
    monthTitle.textContent = MONTH_NAMES[month];

    const days = document.createElement("div");
    days.classList.add("calendar__days");

    const weekdayRow = document.createElement("div");
    weekdayRow.classList.add("calendar__weekdays");

    WEEKDAYS.forEach(({ short, full }) => {
        const weekday = document.createElement("div");
        weekday.classList.add("calendar__weekday");
        weekday.setAttribute("aria-label", full);
        weekday.textContent = short;
        weekdayRow.append(weekday);
    });

    const daysGrid = document.createElement("div");
    daysGrid.classList.add("calendar__days-grid");

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = getFirstWeekday(year, month);

    for (let index = 1; index < firstWeekday; index++) {
        const emptyDay = document.createElement("div");
        emptyDay.classList.add("calendar__day", "calendar__day--empty");
        emptyDay.setAttribute("aria-hidden", "true");
        daysGrid.append(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("time");
        const weekdayIndex = (firstWeekday - 1 + day - 1) % 7;
        const monthValue = String(month + 1).padStart(2, "0");
        const dayValue = String(day).padStart(2, "0");

        dayCell.classList.add("calendar__day");
        dayCell.dateTime = `${year}-${monthValue}-${dayValue}`;
        dayCell.textContent = day;

        if (weekdayIndex >= 5) {
            dayCell.classList.add("calendar__day--weekend");
        }

        const isToday =
            year === currentDate.getFullYear() &&
            month === currentDate.getMonth() &&
            day === currentDate.getDate();

        if (isToday) {
            dayCell.classList.add("calendar__day--today");
            dayCell.setAttribute("aria-current", "date");
        }

        daysGrid.append(dayCell);
    }

    days.append(weekdayRow, daysGrid);
    monthSection.append(monthTitle, days);
    return monthSection;
};

const renderCalendar = (currentDate) => {
    const year = currentDate.getFullYear();
    const fragment = document.createDocumentFragment();

    for (let month = 0; month < MONTH_NAMES.length; month++) {
        fragment.append(createMonth(year, month, currentDate));
    }

    calendar.replaceChildren(fragment);
    title.textContent = `Calendario ${year}`;
};

const renderYear = (currentDate) => {
    yearNodes.forEach((node) => {
        node.textContent = currentDate.getFullYear();
    });
};

const today = new Date();

renderCalendar(today);
renderYear(today);
