const fridays = [
    "20/09/2024",
    "27/09/2024",
    "4/10/2024",
    "11/10/2024",
    "18/10/2024",
    "25/10/2024",
    "1/11/2024",
    "8/11/2024",
    "15/11/2024",
    "22/11/2024",
    "29/11/2024",
    "6/12/2024",
    "13/12/2024",
    "20/12/2024",
    "10/1/2025",
    "17/1/2025",
    "24/1/2025",
    "31/1/2025",
    "7/2/2025",
    "14/2/2025",
    "21/2/2025",
    "28/2/2025",
    "7/3/2025",
    "14/3/2025",
    "21/3/2025",
    "28/3/2025",
    "4/4/2025",
    "11/4/2025",
    "25/4/2025",
    "2/5/2025",
    "9/5/2025",
    "16/5/2025",
    "23/5/2025",
];

function markCompletedWeeks() {
    const now = new Date();

    fridays.forEach((dateText) => {
        const [day, month, year] = dateText.split("/").map((part) => parseInt(part, 10));
        const fridayDate = new Date(year, month - 1, day, 13, 30);

        if (now < fridayDate) return;

        document.querySelectorAll(".week").forEach((week) => {
            const weekNumber = week.querySelector(".week-number");
            const friday = week.querySelector(".friday");

            if (!weekNumber || !friday?.textContent.includes(dateText)) return;

            weekNumber.classList.add("is-completed");

            week.querySelectorAll(".day").forEach((dayItem) => {
                const icon = document.createElement("i");

                icon.className = "fa-solid fa-check check-icon";
                dayItem.appendChild(icon);
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", markCompletedWeeks);
