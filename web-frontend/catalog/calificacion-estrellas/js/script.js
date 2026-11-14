const estrellas = document.querySelectorAll(".estrellas input");

estrellas.forEach((input, index) => {
    input.addEventListener("click", function () {
        estrellas.forEach((input, i) => {
            if (i <= index) {
                input.checked = true;
            } else {
                input.checked = false;
            }
        });
    });
});
