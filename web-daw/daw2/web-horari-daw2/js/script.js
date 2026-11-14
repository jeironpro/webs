const moduleData = [
    { code: "OML", hours: 132, absences: 0.2 },
    { code: "P", hours: 198, absences: 0.2 },
    { code: "CSS", hours: 231, absences: 0.2 },
    { code: "D", hours: 66, absences: 0.2 },
    { code: "II", hours: 66, absences: 0.2 },
    { code: "T", hours: 33, absences: 0.2 },
];

const hourNodes = document.querySelectorAll(".hours");
const absenceNodes = document.querySelectorAll(".absences");

moduleData.forEach(({ code, hours, absences }) => {
    const totalAbsences = hours * absences;
    const moduleKey = code.toLowerCase();

    hourNodes.forEach((node) => {
        if (!node.classList.contains(`hours-${moduleKey}`)) return;

        node.textContent = `Hores: ${hours}`;
    });

    absenceNodes.forEach((node) => {
        if (!node.classList.contains(`absences-${moduleKey}`)) return;

        node.textContent = `Absències: ${Math.floor(totalAbsences)}`;
    });
});

document.querySelectorAll(".schedule-card-container").forEach((container) => {
    container.addEventListener("click", () => {
        container.querySelector(".schedule-card")?.classList.toggle("flipped");
    });
});
