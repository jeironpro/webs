let divendres = [
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
]

function Divendres() {
    let ara = new Date();

    divendres.forEach(fecha => {
        let [dia, mes, any] = fecha.split('/').map(num => parseInt(num));
        let fechaDivendres = new Date(any, mes - 1, dia, 13, 30);

        if (ara >= fechaDivendres) {
            document.querySelectorAll('.setmana').forEach(stmn => {
                let numeroSetmana = stmn.querySelector(".numero-setmana");
                if (stmn.querySelector(".divendres").textContent.includes(fecha)) {
                    numeroSetmana.style.backgroundColor = "#00ff00";

                    stmn.querySelectorAll(".dia").forEach(diaPas => {
                        let icona = document.createElement("i");
                        icona.className = "fa-solid fa-check icona";

                        diaPas.appendChild(icona);
                    })
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    Divendres();
});