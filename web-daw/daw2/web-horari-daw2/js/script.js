const horesAbsencies = [
    {modul: "OML", hores: 132, absencies: 0.2},
    {modul: "P", hores: 198, absencies: 0.2},
    {modul: "CSS", hores: 231, absencies: 0.2},
    {modul: "D", hores: 66, absencies: 0.2},
    {modul: "II", hores: 66, absencies: 0.2},
    {modul: "T", hores: 33, absencies: 0.2}
];

const hores = document.querySelectorAll(".hores");
const absencies = document.querySelectorAll(".absencies");

horesAbsencies.forEach(m => {
    let totalAbsencies = m.hores * m.absencies;
    
    hores.forEach(h => {
        if (h.classList.contains(`hores-${m.modul.toLowerCase()}`)) {
            h.textContent = `Hores: ${m.hores}`;
        }
    });
    
    absencies.forEach(a => {
        if (a.classList.contains(`absencies-${m.modul.toLowerCase()}`)) {
            a.textContent = `Absències: ${Math.floor(totalAbsencies)}`;
        }
    });
});

document.querySelectorAll(".contenidor-targeta").forEach(td => {
    td.addEventListener("click", ()=> {
        const targeta = td.querySelector(".targeta");

        if (!targeta.classList.contains("gira")) {
            targeta.querySelector(".frontal").style.display = "none";
            targeta.classList.add("gira");
        } else {
            targeta.querySelector(".frontal").style.display = "flex";
            targeta.classList.remove("gira");
        }
    })
})