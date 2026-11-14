document.addEventListener("DOMContentLoaded", function () {
    const contenedor_navegacion = document.getElementById("contenedor_navegacion");
    const agregar = document.getElementById("agregar");
    const pagina = window.location.pathname.split("/").pop();

    switch (pagina) {
        case "index.html":
            contenedor_navegacion.style.backgroundColor = "#4CAF50";
            agregar.style.backgroundColor = "#4CAF50";
            break;
        case "descargas.html":
            contenedor_navegacion.style.backgroundColor = "#2196F3";
            agregar.style.backgroundColor = "#2196F3";
            break;
        case "documentos.html":
            contenedor_navegacion.style.backgroundColor = "#FF9800";
            agregar.style.backgroundColor = "#FF9800";
            break;
        case "imagenes.html":
            contenedor_navegacion.style.backgroundColor = "#E91E63";
            agregar.style.backgroundColor = "#E91E63";
            break;
        case "musica.html":
            contenedor_navegacion.style.backgroundColor = "#9C27B0";
            agregar.style.backgroundColor = "#9C27B0";
            break;
        case "video.html":
            contenedor_navegacion.style.backgroundColor = "#F44336";
            agregar.style.backgroundColor = "#F44336";
            break;
        case "papelera.html":
            contenedor_navegacion.style.backgroundColor = "#607B8D";
            agregar.style.backgroundColor = "#607B8D";
            break;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const contenedor_agregar = document.getElementById("contenedor_agregar");
    const abrir_agregar = document.getElementById("abrir_agregar");
    const agregar = document.getElementById("agregar");
    const texto_agregar = document.getElementById("texto_agregar");
    const abrir_configuraciones = document.getElementById("abrir_configuraciones");
    const opciones_configuraciones = document.getElementById("opciones_configuraciones");
    const cerrar_configuraciones = document.getElementById("cerrar_configuraciones");
    const icono_filtro = document.querySelector(".fa-filter");

    abrir_agregar.addEventListener("click", function () {
        if (agregar.style.display === "block") {
            contenedor_agregar.style.width = "";
            agregar.style.display = "none";
            texto_agregar.style.display = "none";
        } else {
            contenedor_agregar.style.width = "150px";
            agregar.style.display = "block";
            texto_agregar.style.display = "block";
        }
    });

    abrir_configuraciones.addEventListener("click", function () {
        opciones_configuraciones.style.display = "flex";
        abrir_configuraciones.style.display = "none";
        icono_filtro.style.display = "none";
    });

    cerrar_configuraciones.addEventListener("click", function () {
        opciones_configuraciones.style.display = "none";
        abrir_configuraciones.style.display = "block";
        icono_filtro.style.display = "block";
    });
});
