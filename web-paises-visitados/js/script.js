const countries = [
    {
        África: [
            { name: "Angola", iso: "AO" },
            { name: "Argelia", iso: "DZ" },
            { name: "Benín", iso: "BJ" },
            { name: "Botsuana", iso: "BW" },
            { name: "Burkina Faso", iso: "BF" },
            { name: "Burundi", iso: "BI" },
            { name: "Cabo Verde", iso: "CV" },
            { name: "Camerún", iso: "CM" },
            { name: "Chad", iso: "TD" },
            { name: "Comoras", iso: "KM" },
            { name: "Congo", iso: "CG" },
            { name: "República Democrática del Congo", iso: "CD" },
            { name: "Costa de Marfil", iso: "CI" },
            { name: "Egipto", iso: "EG" },
            { name: "Eritrea", iso: "ER" },
            { name: "Esuatini", iso: "SZ" },
            { name: "Etiopía", iso: "ET" },
            { name: "Gabón", iso: "GA" },
            { name: "Gambia", iso: "GM" },
            { name: "Ghana", iso: "GH" },
            { name: "Guinea", iso: "GN" },
            { name: "Guinea-Bisáu", iso: "GW" },
            { name: "Guinea Ecuatorial", iso: "GQ" },
            { name: "Kenia", iso: "KE" },
            { name: "Lesoto", iso: "LS" },
            { name: "Liberia", iso: "LR" },
            { name: "Libia", iso: "LY" },
            { name: "Madagascar", iso: "MG" },
            { name: "Malawi", iso: "MW" },
            { name: "Malí", iso: "ML" },
            { name: "Marruecos", iso: "MA" },
            { name: "Mauricio", iso: "MU" },
            { name: "Mauritania", iso: "MR" },
            { name: "Mozambique", iso: "MZ" },
            { name: "Namibia", iso: "NA" },
            { name: "Níger", iso: "NE" },
            { name: "Nigeria", iso: "NG" },
            { name: "Ruanda", iso: "RW" },
            { name: "Santo Tomé y Príncipe", iso: "ST" },
            { name: "Senegal", iso: "SN" },
            { name: "Seychelles", iso: "SC" },
            { name: "Sierra Leona", iso: "SL" },
            { name: "Somalia", iso: "SO" },
            { name: "Sudáfrica", iso: "ZA" },
            { name: "Sudán", iso: "SD" },
            { name: "Sudán del Sur", iso: "SS" },
            { name: "Tanzania", iso: "TZ" },
            { name: "Togo", iso: "TG" },
            { name: "Túnez", iso: "TN" },
            { name: "Uganda", iso: "UG" },
            { name: "Yibuti", iso: "DJ" },
            { name: "Zambia", iso: "ZM" },
            { name: "Zimbabue", iso: "ZW" },
        ],
        Asia: [
            { name: "Afganistán", iso: "AF" },
            { name: "Arabia Saudita", iso: "SA" },
            { name: "Armenia", iso: "AM" },
            { name: "Azerbaiyán", iso: "AZ" },
            { name: "Bahréin", iso: "BH" },
            { name: "Bangladés", iso: "BD" },
            { name: "Birmania", iso: "MM" },
            { name: "Brunéi", iso: "BN" },
            { name: "Bután", iso: "BT" },
            { name: "Camboya", iso: "KH" },
            { name: "Catar", iso: "QA" },
            { name: "China", iso: "CN" },
            { name: "Chipre", iso: "CY" },
            { name: "Corea del Norte", iso: "KP" },
            { name: "Corea del Sur", iso: "KR" },
            { name: "Emiratos Árabes Unidos", iso: "AE" },
            { name: "Filipinas", iso: "PH" },
            { name: "Georgia", iso: "GE" },
            { name: "India", iso: "IN" },
            { name: "Indonesia", iso: "ID" },
            { name: "Irak", iso: "IQ" },
            { name: "Irán", iso: "IR" },
            { name: "Israel", iso: "IL" },
            { name: "Japón", iso: "JP" },
            { name: "Jordania", iso: "JO" },
            { name: "Kazajistán", iso: "KZ" },
            { name: "Kirguistán", iso: "KG" },
            { name: "Kuwait", iso: "KW" },
            { name: "Laos", iso: "LA" },
            { name: "Líbano", iso: "LB" },
            { name: "Malasia", iso: "MY" },
            { name: "Maldivas", iso: "MV" },
            { name: "Mongolia", iso: "MN" },
            { name: "Nepal", iso: "NP" },
            { name: "Omán", iso: "OM" },
            { name: "Pakistán", iso: "PK" },
            { name: "Palestina", iso: "PS" },
            { name: "Rusia", iso: "RU" },
            { name: "Singapur", iso: "SG" },
            { name: "Siria", iso: "SY" },
            { name: "Sri Lanka", iso: "LK" },
            { name: "Tayikistán", iso: "TJ" },
            { name: "Tailandia", iso: "TH" },
            { name: "Timor Oriental", iso: "TL" },
            { name: "Turquía", iso: "TR" },
            { name: "Turkmenistán", iso: "TM" },
            { name: "Uzbekistán", iso: "UZ" },
            { name: "Vietnam", iso: "VN" },
            { name: "Yemen", iso: "YE" },
        ],
        Europa: [
            { name: "Albania", iso: "AL" },
            { name: "Alemania", iso: "DE" },
            { name: "Andorra", iso: "AD" },
            { name: "Armenia", iso: "AM" },
            { name: "Austria", iso: "AT" },
            { name: "Azerbaiyán", iso: "AZ" },
            { name: "Bélgica", iso: "BE" },
            { name: "Bielorrusia", iso: "BY" },
            { name: "Bosnia y Herzegovina", iso: "BA" },
            { name: "Bulgaria", iso: "BG" },
            { name: "Chipre", iso: "CY" },
            { name: "Croacia", iso: "HR" },
            { name: "Dinamarca", iso: "DK" },
            { name: "Eslovaquia", iso: "SK" },
            { name: "Eslovenia", iso: "SI" },
            { name: "España", iso: "ES" },
            { name: "Estonia", iso: "EE" },
            { name: "Finlandia", iso: "FI" },
            { name: "Francia", iso: "FR" },
            { name: "Georgia", iso: "GE" },
            { name: "Grecia", iso: "GR" },
            { name: "Hungría", iso: "HU" },
            { name: "Irlanda", iso: "IE" },
            { name: "Islandia", iso: "IS" },
            { name: "Italia", iso: "IT" },
            { name: "Kazajistán", iso: "KZ" },
            { name: "Kosovo", iso: "XK" },
            { name: "Letonia", iso: "LV" },
            { name: "Liechtenstein", iso: "LI" },
            { name: "Lituania", iso: "LT" },
            { name: "Luxemburgo", iso: "LU" },
            { name: "Macedonia del Norte", iso: "MK" },
            { name: "Malta", iso: "MT" },
            { name: "Moldavia", iso: "MD" },
            { name: "Mónaco", iso: "MC" },
            { name: "Montenegro", iso: "ME" },
            { name: "Noruega", iso: "NO" },
            { name: "Países Bajos", iso: "NL" },
            { name: "Polonia", iso: "PL" },
            { name: "Portugal", iso: "PT" },
            { name: "Reino Unido", iso: "GB" },
            { name: "República Checa", iso: "CZ" },
            { name: "Rumanía", iso: "RO" },
            { name: "Rusia", iso: "RU" },
            { name: "San Marino", iso: "SM" },
            { name: "Serbia", iso: "RS" },
            { name: "Suecia", iso: "SE" },
            { name: "Suiza", iso: "CH" },
            { name: "Turquía", iso: "TR" },
            { name: "Ucrania", iso: "UA" },
            { name: "Ciudad del Vaticano", iso: "VA" },
        ],
        América: [
            { name: "Antigua y Barbuda", iso: "AG" },
            { name: "Argentina", iso: "AR" },
            { name: "Bahamas", iso: "BS" },
            { name: "Barbados", iso: "BB" },
            { name: "Belice", iso: "BZ" },
            { name: "Bolivia", iso: "BO" },
            { name: "Brasil", iso: "BR" },
            { name: "Canadá", iso: "CA" },
            { name: "Chile", iso: "CL" },
            { name: "Colombia", iso: "CO" },
            { name: "Costa Rica", iso: "CR" },
            { name: "Cuba", iso: "CU" },
            { name: "Dominica", iso: "DM" },
            { name: "Ecuador", iso: "EC" },
            { name: "El Salvador", iso: "SV" },
            { name: "Estados Unidos", iso: "US" },
            { name: "Granada", iso: "GD" },
            { name: "Guatemala", iso: "GT" },
            { name: "Guyana", iso: "GY" },
            { name: "Haití", iso: "HT" },
            { name: "Honduras", iso: "HN" },
            { name: "Jamaica", iso: "JM" },
            { name: "México", iso: "MX" },
            { name: "Nicaragua", iso: "NI" },
            { name: "Panamá", iso: "PA" },
            { name: "Paraguay", iso: "PY" },
            { name: "Perú", iso: "PE" },
            { name: "República Dominicana", iso: "DO" },
            { name: "San Cristóbal y Nieves", iso: "KN" },
            { name: "Santa Lucía", iso: "LC" },
            { name: "San Vicente y las Granadinas", iso: "VC" },
            { name: "Surinam", iso: "SR" },
            { name: "Trinidad y Tobago", iso: "TT" },
            { name: "Uruguay", iso: "UY" },
            { name: "Venezuela", iso: "VE" },
        ],
        Oceanía: [
            { name: "Australia", iso: "AU" },
            { name: "Fiyi", iso: "FJ" },
            { name: "Islas Marshall", iso: "MH" },
            { name: "Islas Salomón", iso: "SB" },
            { name: "Kiribati", iso: "KI" },
            { name: "Micronesia", iso: "FM" },
            { name: "Nauru", iso: "NR" },
            { name: "Nueva Zelanda", iso: "NZ" },
            { name: "Palaos", iso: "PW" },
            { name: "Papúa Nueva Guinea", iso: "PG" },
            { name: "Samoa", iso: "WS" },
            { name: "Tonga", iso: "TO" },
            { name: "Tuvalu", iso: "TV" },
            { name: "Vanuatu", iso: "VU" },
        ],
    },
];

// Clave de localStorage. Se conserva el valor original para no perder
// los países ya marcados por quienes visitaron la web.
const STORAGE_KEY = "paisesVisitados";

const getVisited = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

const saveVisited = (visited) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visited));
};

countries.forEach((data) => {
    const countriesContainer = document.getElementById("countries-container");
    const searchInput = document.getElementById("search");

    const showCountriesByContinent = (data) => {
        countriesContainer.replaceChildren();

        const visitedCountries = [];

        for (const continent in data) {
            for (const country of data[continent]) {
                if (country.visited) {
                    visitedCountries.push({ ...country, continent });
                }
            }
        }

        if (visitedCountries.length > 0) {
            const visitedTitle = document.createElement("h2");
            visitedTitle.textContent = "Visitados";
            countriesContainer.appendChild(visitedTitle);

            visitedCountries.forEach((country) => {
                const div = document.createElement("div");
                const p = document.createElement("p");
                p.textContent = country.name;
                div.appendChild(p);

                const icon = document.createElement("i");
                icon.className = "fa-solid fa-check icono";
                div.appendChild(icon);

                const img = document.createElement("img");
                img.src = `assets/images/${country.iso.toLowerCase()}.png`;
                img.alt = `Bandera de ${country.name}`;
                img.classList.add("flag-img");
                div.appendChild(img);

                div.classList.add("country");
                countriesContainer.appendChild(div);
            });
        }

        for (const continent in data) {
            let countries = data[continent].filter((p) => !p.origin && !p.visited);

            if (countries.length === 0) continue;

            const h2 = document.createElement("h2");
            h2.textContent = continent;
            countriesContainer.appendChild(h2);

            countries.forEach((country) => {
                const div = document.createElement("div");
                const p = document.createElement("p");

                p.textContent = country.name;
                div.appendChild(p);

                const button = document.createElement("button");
                button.textContent = "Visitado";
                button.classList.add("button");
                div.appendChild(button);

                const img = document.createElement("img");
                img.src = `assets/images/${country.iso.toLowerCase()}.png`;
                img.alt = `Bandera de ${country.name}`;
                img.classList.add("flag-img");
                div.appendChild(img);

                div.classList.add("country");
                countriesContainer.appendChild(div);
            });
        }
    };

    const savedVisited = getVisited();
    for (const continent in data) {
        data[continent].forEach((country) => {
            if (savedVisited.includes(country.iso.toLowerCase())) {
                country.visited = true;
            }
        });
    }

    showCountriesByContinent(data);

    searchInput.addEventListener("input", function () {
        const search = searchInput.value.trim().toLowerCase();

        if (search === "") {
            showCountriesByContinent(data);
            return;
        }

        const foundContinent = Object.keys(data).find((continent) =>
            continent.toLowerCase().startsWith(search)
        );

        if (foundContinent) {
            const result = {};
            result[foundContinent] = data[foundContinent];
            showCountriesByContinent(result);
        } else {
            const filteredCountries = Object.values(data)
                .flat()
                .filter((country) => country.name.toLowerCase().startsWith(search));

            showCountriesByContinent({ "": filteredCountries });
        }
    });

    countriesContainer.addEventListener("click", function (event) {
        const target = event.target;

        if (target && target.classList.contains("button")) {
            const countryName = target.parentElement.querySelector("p").textContent;
            let countryIso = null;

            for (const continent in data) {
                const country = data[continent].find((p) => p.name === countryName);
                if (country) {
                    country.visited = true;
                    countryIso = country.iso.toLowerCase();
                    break;
                }
            }

            if (countryIso) {
                const visited = getVisited();
                if (!visited.includes(countryIso)) {
                    visited.push(countryIso);
                    saveVisited(visited);
                }
            }

            showCountriesByContinent(data);
        }
    });
});
