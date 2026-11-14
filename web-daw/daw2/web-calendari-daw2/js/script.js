let modal = document.querySelector(".modal");

if (!modal) {
    modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modal.appendChild(modalContent);

    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.classList.add("modal-close");
    modalContent.appendChild(closeButton);

    const modalImage = document.createElement("img");
    modalImage.classList.add("modal-image");
    modalContent.appendChild(modalImage);

    document.body.appendChild(modal);

    closeButton.addEventListener("click", () => {
        modal.classList.remove("is-open");
        modalImage.src = "";
    });
}

const holidays = [
    { date: "24/9/2025", reason: "Mare de Déu de la Mercè" },
    { date: "10/10/2025", reason: "1r dia de lliure disposició" },
    { date: "3/11/2025", reason: "2n día de lliure disposició" },
    { date: "8/12/2025", reason: "La inmaculada" },
    { date: "22/12/2025", reason: "Vacandes de Nadal" },
    { date: "23/12/2025", reason: "Vacandes de Nadal" },
    { date: "24/12/2025", reason: "Vacandes de Nadal" },
    { date: "25/12/2025", reason: "Vacandes de Nadal" },
    { date: "26/12/2025", reason: "Vacandes de Nadal" },
    { date: "27/12/2025", reason: "Vacandes de Nadal" },
    { date: "28/12/2025", reason: "Vacandes de Nadal" },
    { date: "29/12/2025", reason: "Vacandes de Nadal" },
    { date: "30/12/2025", reason: "Vacandes de Nadal" },
    { date: "31/12/2025", reason: "Vacandes de Nadal" },
    { date: "1/1/2026", reason: "Vacandes de Nadal" },
    { date: "2/1/2026", reason: "Vacandes de Nadal" },
    { date: "5/1/2026", reason: "Vacandes de Nadal" },
    { date: "6/1/2026", reason: "Vacandes de Nadal" },
    { date: "7/1/2026", reason: "Vacandes de Nadal" },
    { date: "16/2/2026", reason: "3r dia de lliure disposició" },
    { date: "30/3/2026", reason: "Vacances de Setmana Santa" },
    { date: "31/3/2026", reason: "Vacances de Setmana Santa" },
    { date: "1/4/2026", reason: "Vacances de Setmana Santa" },
    { date: "2/4/2026", reason: "Vacances de Setmana Santa" },
    { date: "3/4/2026", reason: "Vacances de Setmana Santa" },
    { date: "6/4/2026", reason: "Vacances de Setmana Santa" },
    { date: "1/5/2026", reason: "Festa del treball" },
    { date: "4/5/2026", reason: "4t dia de lliure disposició" },
];

const monthNames = [
    "GENER",
    "FEBRER",
    "MARÇ",
    "ABRIL",
    "MAIG",
    "JUNY",
    "JULIOL",
    "AGOST",
    "SETEMBRE",
    "OCTUBRE",
    "NOVEMBRE",
    "DESEMBRE",
];

const dayNames = ["DL", "DM", "DC", "DJ", "DV"];
const startDate = new Date("2025-09-15");
const endDate = new Date("2026-05-22");

function renderCalendar(start, end) {
    const container = document.getElementById("calendar");
    container.replaceChildren();

    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("es-ES", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
    const parts = formatter.formatToParts(now);

    let year = 0;
    let month = 0;
    let day = 0;
    let hour = 0;
    let minute = 0;
    let second = 0;

    parts.forEach((part) => {
        switch (part.type) {
            case "year":
                year = parseInt(part.value, 10);
                break;
            case "month":
                month = parseInt(part.value, 10) - 1;
                break;
            case "day":
                day = parseInt(part.value, 10);
                break;
            case "hour":
                hour = parseInt(part.value, 10);
                break;
            case "minute":
                minute = parseInt(part.value, 10);
                break;
            case "second":
                second = parseInt(part.value, 10);
                break;
        }
    });

    const madridNow = new Date(year, month, day, hour, minute, second);
    let weekCounter = 1;
    let weekBlock = 0;

    while (current <= end) {
        const monthDiv = document.createElement("div");
        monthDiv.className = "month";

        const title = document.createElement("h2");
        title.textContent = `${monthNames[current.getMonth()]} ${current.getFullYear()}`;
        monthDiv.appendChild(title);

        const daysGrid = document.createElement("div");
        daysGrid.className = "days";

        dayNames.forEach((label) => {
            const dayName = document.createElement("div");
            dayName.className = "day-name";
            dayName.textContent = label;
            dayName.dataset.image = `assets/images/${label.toLowerCase()}.png`;
            dayName.addEventListener("click", () => {
                const modalImage = modal.querySelector(".modal-image");
                modalImage.src = dayName.dataset.image;
                modal.classList.add("is-open");
            });
            daysGrid.appendChild(dayName);
        });

        const weekNumberHeader = document.createElement("div");
        weekNumberHeader.className = "week-number";
        weekNumberHeader.textContent = "Nº";
        daysGrid.appendChild(weekNumberHeader);

        const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
        let firstDayCalculated = false;
        let nextToday = false;
        let weekColumn = 0;

        for (let dateNumber = 1; dateNumber <= daysInMonth; dateNumber++) {
            if (
                current.getFullYear() === start.getFullYear() &&
                current.getMonth() === start.getMonth() &&
                dateNumber < start.getDate()
            ) {
                continue;
            }

            const thisDate = new Date(current.getFullYear(), current.getMonth(), dateNumber);
            const weekday = (thisDate.getDay() + 6) % 7;

            if (weekday >= 5) continue;

            if (!firstDayCalculated) {
                for (let emptyDay = 0; emptyDay < weekday; emptyDay++) {
                    daysGrid.appendChild(document.createElement("div"));
                    weekColumn++;
                }
                firstDayCalculated = true;
            }

            const dayDiv = document.createElement("div");
            dayDiv.className = "day";
            dayDiv.textContent = dateNumber;

            if (thisDate.toDateString() === madridNow.toDateString()) {
                dayDiv.classList.add("today");
                dayDiv.dataset.current = "Avui";
            }

            if (thisDate > end) break;

            const dateString = `${dateNumber}/${current.getMonth() + 1}/${current.getFullYear()}`;
            const holiday = holidays.find((item) => item.date === dateString);

            if (holiday) {
                dayDiv.classList.add("holiday");
                dayDiv.dataset.reason = holiday.reason;
            } else {
                const todayStart = new Date(
                    madridNow.getFullYear(),
                    madridNow.getMonth(),
                    madridNow.getDate()
                );

                if (
                    thisDate < todayStart ||
                    (thisDate.toDateString() === madridNow.toDateString() &&
                        madridNow.getHours() >= 21)
                ) {
                    dayDiv.classList.add("completed");
                    dayDiv.dataset.completed = "Completat";
                }
            }

            if (dayDiv.classList.contains("today") && dayDiv.classList.contains("completed")) {
                dayDiv.classList.remove("today");
                delete dayDiv.dataset.current;
                nextToday = true;
            }

            if (
                nextToday &&
                !dayDiv.classList.contains("completed") &&
                !dayDiv.classList.contains("holiday")
            ) {
                dayDiv.classList.add("today");
                dayDiv.dataset.current = "Avui";
                nextToday = false;
            }

            daysGrid.appendChild(dayDiv);
            weekColumn++;
            weekBlock++;

            if (weekColumn === 5 || dateNumber === daysInMonth) {
                while (weekColumn < 5) {
                    daysGrid.appendChild(document.createElement("div"));
                    weekColumn++;
                }

                const weekNumberDiv = document.createElement("div");
                const monday = new Date(thisDate);
                monday.setDate(thisDate.getDate() - weekday);

                let holidayCount = 0;

                for (let offset = 0; offset < 5; offset++) {
                    const fullDay = new Date(monday);
                    fullDay.setDate(monday.getDate() + offset);

                    const fullDayString = `${fullDay.getDate()}/${fullDay.getMonth() + 1}/${fullDay.getFullYear()}`;

                    if (holidays.some((item) => item.date === fullDayString)) {
                        holidayCount++;
                    }
                }

                if (holidayCount === 5) {
                    weekNumberDiv.textContent = "";
                } else if (weekBlock >= 5 && weekCounter <= 33) {
                    weekNumberDiv.className = "week number";
                    weekNumberDiv.textContent = weekCounter;
                    weekNumberDiv.dataset.week = `Setmana ${weekCounter}`;
                    weekCounter++;
                    weekBlock = 0;
                } else {
                    weekNumberDiv.textContent = "";
                }

                daysGrid.appendChild(weekNumberDiv);
                weekColumn = 0;
            }
        }

        monthDiv.appendChild(daysGrid);

        const monthCompleted = document.createElement("div");
        monthCompleted.className = "month-completed";

        const allMonthDays = monthDiv.querySelectorAll(".day");
        let hasCompleted = false;
        let allCompletedOrHoliday = true;

        allMonthDays.forEach((dayItem) => {
            if (dayItem.classList.contains("completed")) hasCompleted = true;
            if (
                !dayItem.classList.contains("completed") &&
                !dayItem.classList.contains("holiday")
            ) {
                allCompletedOrHoliday = false;
            }
        });

        if (hasCompleted && allCompletedOrHoliday) {
            monthCompleted.textContent = "Mes completat";
        } else {
            monthCompleted.textContent = "";
        }

        monthDiv.appendChild(monthCompleted);
        container.appendChild(monthDiv);
        current.setMonth(current.getMonth() + 1);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderCalendar(startDate, endDate);
});
