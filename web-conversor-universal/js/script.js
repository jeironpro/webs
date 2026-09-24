const conversiones = {
    "Consumo de combustible": {
        "conversiones": [
            { "Milla por galón americano": x => x * 0.425144 },
            { "Millas por galón (Imperial)": x => x * 0.354006 },
            { "Kilómetro por litro": x => x },
            { "Litro por 100 kilómetros": x => 100 / x }
        ]
    },
    "Energía": {
        "conversiones": [
            { "Julio": x => x },
            { "Kilojulio": x => x * 1000 },
            { "Caloría-gramo": x => x * 4.184 },
            { "Kilocaloría": x => x * 4184 },
            { "Vatio-hora": x => x * 3600 },
            { "Kilovatio-hora": x => x * 3600000 },
            { "Electronvoltio": x => x * 1.602176634e-19 },
            { "Unidad térmica británica": x => x * 1055.06 },
            { "Termia estadounidense": x => x * 105500000 },
            { "Pie-libra fuerza": x => x * 1.35582 }
        ]
    },
    "Frecuencia": {
        "conversiones": [
            { "Hercio": x => x },
            { "Kilohercio": x => x * 1000 },
            { "Megahercio": x => x * 1000000 },
            { "Gigahercio": x => x * 1000000000 }
        ]
    },
    "Longitud": {
        "conversiones": [
            { "Kilómetro": x => x * 1000 },
            { "Metro": x => x },
            { "Centímetro": x => x / 100 },
            { "Milímetro": x => x / 1000 },
            { "Micrómetro": x => x / 1000000 },
            { "Nanómetro": x => x / 1000000000 },
            { "Milla": x => x * 1609.344 },
            { "Yarda": x => x * 0.9144 },
            { "Pie": x => x * 0.3048 },
            { "Pulgada": x => x * 0.0254 },
            { "Milla náutica": x => x * 1852 }
        ]
    },
    "Masa": {
        "conversiones": [
            { "Tonelada": x => x * 1000 },
            { "Kilograma": x => x },
            { "Gramo": x => x / 1000 },
            { "Miligramo": x => x / 1000000 },
            { "Microgramo": x => x / 1000000000 },
            { "Tonelada larga": x => x * 1016.0469 },
            { "Tonelada corta": x => x * 907.18474 },
            { "Stone": x => x * 6.35029 },
            { "Libra": x => x * 0.453592 },
            { "Onza": x => x * 0.0283495 }
        ]
    },
    "Presión": {
        "conversiones": [
            { "Atmósfera": x => x * 101325 },
            { "Bar": x => x * 100000 },
            { "Libro por pulgada cuadrada": x => x * 6894.76 },
            { "Pascal": x => x },
            { "Torr": x => x * 133.322 }
        ]
    },
    "Tamaño de datos": {
        "conversiones": [
            { "Bit": x => x / 8 },
            { "Kilobit": x => x * 125 },
            { "Kibibit": x => x * 128 },
            { "Megabit": x => x * 125000 },
            { "Mebibit": x => x * 131072 },
            { "Gigabit": x => x * 125000000 },
            { "Gibibit": x => x * 134217728 },
            { "Terabit": x => x * 125000000000 },
            { "Petabit": x => x * 125000000000000 },
            { "Pebibit": x => x * 137438953472000 },
            { "Byte": x => x },
            { "Kilobyte": x => x * 1000 },
            { "Kibibyte": x => x * 1024 },
            { "Megabyte": x => x * 1000000 },
            { "Mebibyte": x => x * 1048576 },
            { "Gigabyte": x => x * 1000000000 },
            { "Gibibyte": x => x * 1073741824 },
            { "Terabyte": x => x * 1000000000000 },
            { "Tebibyte": x => x * 1099511627776 },
            { "Petabyte": x => x * 1000000000000000 },
            { "Pebibyte": x => x * 1125899906842624 }
        ]
    },
    "Tasa de transmisión de datos": {
        "conversiones": [
            { "Bit por segundo": x => x },
            { "Kilobit por segundo": x => x * 1000 },
            { "Kilobyte por segundo": x => x * 8000 },
            { "Kibibit por segundo": x => x * 1024 },
            { "Megabit por segundo": x => x * 1000000 },
            { "Megabyte por segundo": x => x * 8000000 },
            { "Mebibit por segundo": x => x * 1048576 },
            { "Gibabit por segundo": x => x * 1000000000 },
            { "Gibabyte por segundo": x => x * 8000000000 },
            { "Gibibit por segundo": x => x * 1073741824 },
            { "Terabit por segundo": x => x * 1000000000000 },
            { "Terabyte por segundo": x => x * 8000000000000 },
            { "Tebibit por segundo": x => x * 1099511627776 }
        ]
    },
    "Temperatura": {
        "conversiones": [
            { "Grado Celsius": x => x + 273.15 },
            { "Grado Fahrenheit": x => (x - 32) * 5 / 9 + 273.15 },
            { "Grado Kelvin": x => x }
        ]
    },
    "Tiempo": {
        "conversiones": [
            { "Nanosegundo": x => x / 1e9 },
            { "Microsegundo": x => x / 1e6 },
            { "Milisegundo": x => x / 1000 },
            { "Segundo": x => x },
            { "Minuto": x => x * 60 },
            { "Hora": x => x * 3600 },
            { "Día": x => x * 86400 },
            { "Semana": x => x * 604800 },
            { "Mes": x => x * 2.6298e6 },
            { "Año": x => x * 3.1536e7 },
            { "Década": x => x * 3.1536e8 },
            { "Siglo": x => x * 3.1536e9 }
        ]
    },
    "Velocidad": {
        "conversiones": [
            { "Milla por hora": x => x * 0.44704 },
            { "Pie por segundo": x => x * 0.3048 },
            { "Metro por segundo": x => x },
            { "Kilómetro por hora": x => x / 3.6 },
            { "Nudo": x => x * 0.514444 }
        ]
    },
    "Volumen": {
        "conversiones": [
            { "Galón estadounidense": x => x * 3.78541 },
            { "Cuarto estadounidense": x => x * 0.946353 },
            { "Pinta estadounidense": x => x * 0.473176 },
            { "Taza americana oficial": x => x * 0.24 },
            { "Onza liquida estadounidense": x => x * 0.0295735 },
            { "Cucharada estadounidense": x => x * 0.0147868 },
            { "Cucharadita estadounidense": x => x * 0.00492892 },
            { "Metro cúbico": x => x * 1000 },
            { "Litro": x => x },
            { "Mililitro": x => x / 1000 },
            { "Galón imperial": x => x * 4.54609 },
            { "Cuarto imperial": x => x * 1.13652 },
            { "Pinta imperial": x => x * 0.568261 },
            { "Taza imperial": x => x * 0.284131 },
            { "Onza liquida imperial": x => x * 0.0284131 },
            { "Cucharada imperial": x => x * 0.0177582 },
            { "Cucharadita imperial": x => x * 0.00591939 },
            { "Pie cúbico": x => x * 28.3168 },
            { "Pulgada cúbica": x => x * 0.0163871 }
        ]
    },
    "Ángulo plano": {
        "conversiones": [
            { "Grado": x => x * (Math.PI / 180) },
            { "Grado centesimal": x => x * (Math.PI / 200) },
            { "Milirradián": x => x / 1000 },
            { "Minuto de arco": x => x * (Math.PI / 10800) },
            { "Radián": x => x },
            { "Segundo de arco": x => x * (Math.PI / 648000) }
        ]
    },
    "Área": {
        "conversiones": [
            { "Kilómetro cuadrado": x => x * 1e6 },
            { "Metro cuadrado": x => x },
            { "Milla cuadrada": x => x * 2.58999e6 },
            { "Yarda cuadrada": x => x * 0.836127 },
            { "Pie cuadrado": x => x * 0.092903 },
            { "Pulgada cuadrada": x => x * 0.00064516 },
            { "Hectárea": x => x * 10000 },
            { "Acre": x => x * 4046.86 }
        ]
    }
}

const contenedorConversiones = document.getElementById("contenedor-conversiones");
const listaConversiones = document.getElementById("lista-conversiones");
const contenedorConversion = document.getElementById("contenedor-conversion");

const mostraSelectoresCategoria = function (categoria) {
    contenedorConversion.innerHTML = "";

    const inputObj = document.createElement("input");
    inputObj.type = "number";
    inputObj.classList.add("campo-valor-conversion");
    inputObj.id = "valor-conversion";
    contenedorConversion.appendChild(inputObj);

    const contenedorSelectsObj = document.createElement("div");

    const tipoConversiones = conversiones[categoria].conversiones;
    const selectObj = document.createElement("select");

    tipoConversiones.forEach(elemento => {
        const nombre = Object.keys(elemento)[0];

        const optionObj = document.createElement("option");
        optionObj.value = nombre;
        optionObj.textContent = nombre;
        selectObj.appendChild(optionObj);
    });

    contenedorSelectsObj.appendChild(selectObj);
    const cloneSelectObj = selectObj.cloneNode(true);
    
    if (cloneSelectObj.options.length > 1) {
        cloneSelectObj.selectedIndex = 1;
    }
    contenedorSelectsObj.appendChild(cloneSelectObj);
    contenedorConversion.appendChild(contenedorSelectsObj);

    inputObj.addEventListener("input", function () {
        const desdeValue = selectObj.value;
        const hastaValue = cloneSelectObj.value;
        const valor = Number(inputObj.value);
        calculoConversion(categoria, desdeValue, hastaValue, valor);
    });
    const contenedorResultadoObj = document.createElement("span");
    contenedorResultadoObj.id = "resultado-conversion";

    contenedorConversion.appendChild(contenedorResultadoObj);
}

const obtenerFuncion = (tipoConversiones, conversion) => {
    return tipoConversiones.find(conversiones => conversiones[conversion])?.[conversion];
};

const calculoConversion = function (categoria, desde, hasta, valor) {
    if (!valor || isNaN(valor)) {
        contenedorResultadoObj.textContent = "";
        contenedorResultadoObj.style.display = "none";
        return;
    }

    const tipoConversiones = conversiones[categoria].conversiones;
    const conversionDesde = obtenerFuncion(tipoConversiones, desde);
    const conversionHasta = obtenerFuncion(tipoConversiones, hasta);

    const valorBase = conversionDesde(valor);
    const resultado = valorBase / conversionHasta(1);
    const resultadoFormateado = resultado.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const contenedorResultadoObj = document.getElementById("resultado-conversion");
    contenedorResultadoObj.textContent = resultadoFormateado;
    contenedorResultadoObj.style.display = "flex";
}

for (const categoria in conversiones) {
    const categoriaObj = document.createElement("li");
    categoriaObj.textContent = categoria;
    categoriaObj.addEventListener("click", function () {
        mostraSelectoresCategoria(categoria);
    });

    listaConversiones.appendChild(categoriaObj);
}
