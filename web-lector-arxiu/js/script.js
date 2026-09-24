const body = document.querySelector("body");
const contenidor = document.getElementById("contenidor");
const titolArxiu = document.getElementById("titol-arxiu");
const arxiu = document.getElementById("arxiu");
const contenidorArxiu = document.getElementById("contingut-arxiu");
const botoReset = document.getElementById("boto-reset");

arxiu.addEventListener("change", function(event) {
    const arxiuLlegit = event.target.files[0];

    if (arxiuLlegit) {
        const lector = new FileReader();

        lector.onload = function(e) {
            contenidorArxiu.textContent = e.target.result;
            contenidorArxiu.style.display = "block";
            titolArxiu.textContent = arxiuLlegit.name;
        };

        contenidor.style.display = "none";
        body.style.height = "100vh";
        lector.readAsText(arxiuLlegit);
    }
});

botoReset.addEventListener("click", () => {
    contenidorArxiu.style.display = "none";
    contenidor.style.display = "flex";
    titolArxiu.textContent = "";
    arxiu.value = "";
});