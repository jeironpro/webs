const modulesData = [
    {
        code: "0612_ICC0",
        name: "Desenvolupament Web en Entorn Client",
        learningOutcomes: [
            {
                outcome1:
                    "Selecciona les arquitectures i tecnologies de programació sobre clients web, identificant i analitzant les capacitats i les característiques de cadascuna.",
                grade: 9.4,
                finalGrade: null,
            },
            {
                outcome2:
                    "Escriu sentències simples, aplicant la sintaxi del llenguatge i verificant la seva execució sobre navegadors web.",
                grade: 8.7,
                finalGrade: null,
            },
            {
                outcome3:
                    "Escriu codi, identificant i aplicant les funcionalitats aportades pels objectes predefinits del llenguatge.",
                grade: 9.3,
                finalGrade: null,
            },
            {
                outcome4:
                    "Programa codi per a clients web analitzant i utilitzant estructures definides per l'usuari.",
                grade: 8.7,
                finalGrade: null,
            },
            {
                outcome5:
                    "Desenvolupa aplicacions web interactives integrant mecanismes de maneig d'esdeveniments.",
                grade: 8,
                finalGrade: null,
            },
            {
                outcome6:
                    "Desenvolupa aplicacions web analitzant i aplicant les característiques del model d'objectes del document.",
                grade: 8.5,
                finalGrade: null,
            },
            {
                outcome7:
                    "Desenvolupa aplicacions web dinàmiques, reconeixent i aplicant mecanismes de comunicació asíncrona entre client i servidor.",
                grade: 8.5,
                finalGrade: null,
            },
        ],
        company: {
            description: "Nota de les practiques realitzat a l'empresa.",
            grade: 10,
        },
        absences: 25,
        totalAbsences: 46,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0]?.grade || 0;
            const outcome2 = this.learningOutcomes[1]?.grade || 0;
            const outcome3 = this.learningOutcomes[2]?.grade || 0;
            const outcome4 = this.learningOutcomes[3]?.grade || 0;
            const outcome5 = this.learningOutcomes[4]?.grade || 0;
            const outcome6 = this.learningOutcomes[5]?.grade || 0;
            const outcome7 = this.learningOutcomes[6]?.grade || 0;

            const companyGrade = this.company?.grade || 0;

            const outcomeBlock =
                0.05 * outcome1 +
                0.05 * outcome2 +
                0.15 * outcome3 +
                0.2 * outcome4 +
                0.1 * outcome5 +
                0.1 * outcome6 +
                0.35 * outcome7;

            const centerGrade = 0.9 * outcomeBlock;
            const companyWeighted = 0.1 * companyGrade;

            const finalGrade = centerGrade + companyWeighted;

            return [
                `${Number(outcomeBlock.toFixed(2))} (${Math.round(outcomeBlock)})`,
                `${Number(companyGrade.toFixed(2))} (${Math.round(companyGrade)})`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "0613_ICC0",
        name: "Desenvolupament Web en Entorn Servidor",
        learningOutcomes: [
            {
                outcome1:
                    "Selecciona les arquitectures i tecnologies de programació web en entorn servidor, analitzant les capacitats i característiques pròpies.",
                grade: 9.35,
                finalGrade: null,
            },
            {
                outcome2:
                    "Escriu sentències executables per un servidor web reconeixent i aplicant procediments d'integració del codi en llenguatges de marques.",
                grade: 8.1,
                finalGrade: null,
            },
            {
                outcome3:
                    "Escriu blocs de sentències embeguts en llenguatges de marques, seleccionant i utilitzant les estructures de programació.",
                grade: 8.403,
                finalGrade: null,
            },
            {
                outcome4:
                    "Desenvolupa aplicacions web embegudes en llenguatges de marques analitzant i incorporant funcionalitats segons especificacions.",
                grade: 8.124,
                finalGrade: null,
            },
            {
                outcome5:
                    "Desenvolupa aplicacions web identificant i aplicant mecanismes per separar el codi de presentació de la lògica de negoci.",
                grade: 8.124,
                finalGrade: null,
            },
            {
                outcome6:
                    "Desenvolupa aplicacions web d'accés a magatzems de dades, aplicant mesures per mantenir la seguretat i la integritat de la informació.",
                grade: 7.778,
                finalGrade: null,
            },
            {
                outcome7:
                    "Desenvolupa serveis web reutilitzables i accessibles mitjançant protocols web, verificant-ne el funcionament.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome8:
                    "Genera pàgines web dinàmiques analitzant i utilitzant tecnologies i frameworks del servidor web que afegeixin codi al llenguatge de marques.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome9:
                    "Desenvolupa aplicacions web híbrides seleccionant i utilitzant tecnologies, frameworks servidor i repositoris heterogenis d'informació.",
                grade: 9,
                finalGrade: null,
            },
        ],
        company: {
            description: "Nota de les practiques realitzat a l'empresa.",
            grade: 10,
        },
        absences: 25,
        totalAbsences: 46,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0]?.grade || 0;
            const outcome2 = this.learningOutcomes[1]?.grade || 0;
            const outcome3 = this.learningOutcomes[2]?.grade || 0;
            const outcome4 = this.learningOutcomes[3]?.grade || 0;
            const outcome5 = this.learningOutcomes[4]?.grade || 0;
            const outcome6 = this.learningOutcomes[5]?.grade || 0;
            const outcome7 = this.learningOutcomes[6]?.grade || 0;
            const outcome8 = this.learningOutcomes[7]?.grade || 0;
            const outcome9 = this.learningOutcomes[8]?.grade || 0;

            const companyGrade = this.company?.grade || 0;

            const outcomeBlock =
                0.05 * outcome1 +
                0.1 * outcome2 +
                0.1 * outcome3 +
                0.1 * outcome4 +
                0.1 * outcome5 +
                0.1 * outcome6 +
                0.15 * outcome7 +
                0.15 * outcome8 +
                0.15 * outcome9;

            const centerGrade = 0.9 * outcomeBlock;
            const companyWeighted = 0.1 * companyGrade;

            const finalGrade = centerGrade + companyWeighted;

            return [
                `${Number(outcomeBlock.toFixed(2))} (${Math.round(outcomeBlock)})`,
                `${Number(companyGrade.toFixed(2))} (${Math.round(companyGrade)})`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "0614_ICC0",
        name: "Desplegament d'Aplicacions Web",
        learningOutcomes: [
            {
                outcome1:
                    "Implanta arquitectures web analitzant i aplicant criteris de funcionalitat.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome2:
                    "Implanta aplicacions web en servidors web, avaluant i aplicant criteris de configuració per al funcionament segur.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome3:
                    "Implanta aplicacions web en servidors d'aplicacions, avaluant i aplicant criteris de configuració per al funcionament segur.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome4:
                    "Administra servidors de transferència de fitxers, avaluant i aplicant criteris de configuració que garanteixin la disponibilitat del servei.",
                grade: 7,
                finalGrade: null,
            },
            {
                outcome5:
                    "Verifica l'execució d'aplicacions web comprovant els paràmetres de configuració de serveis de xarxa.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome6:
                    "Elabora la documentació de l'aplicació web avaluant i seleccionant eines de generació de documentació, control de versions i d'integració contínua.",
                grade: 8,
                finalGrade: null,
            },
        ],
        company: {
            description: "Nota de les practiques realitzat a l'empresa.",
            grade: 10,
        },
        absences: 2,
        totalAbsences: 13,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0]?.grade || 0;
            const outcome2 = this.learningOutcomes[1]?.grade || 0;
            const outcome3 = this.learningOutcomes[2]?.grade || 0;
            const outcome4 = this.learningOutcomes[3]?.grade || 0;
            const outcome5 = this.learningOutcomes[4]?.grade || 0;
            const outcome6 = this.learningOutcomes[5]?.grade || 0;

            const companyGrade = this.company?.grade || 0;

            const outcomeBlock =
                0.05 * outcome1 +
                0.2 * outcome2 +
                0.2 * outcome3 +
                0.2 * outcome4 +
                0.05 * outcome5 +
                0.2 * outcome6;

            const centerGrade = outcomeBlock;
            const companyWeighted = 0.1 * companyGrade;

            const finalGrade = centerGrade + companyWeighted;

            return [
                `${Number(outcomeBlock.toFixed(2))} (${Math.round(outcomeBlock)})`,
                `${Number(companyGrade.toFixed(2))} (${Math.round(companyGrade)})`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "0616_ICC0",
        name: "Projecte Intermodular de Desenvolupament d'Aplicacions Web",
        learningOutcomes: [
            {
                outcome1: "Projecte guiat.",
                grade: 7.55,
                finalGrade: null,
            },
            {
                outcome2: "Projecte multidisciplinar amb uns requeriments mínims.",
                grade: 8.2,
                finalGrade: null,
            },
        ],
        absences: 28,
        totalAbsences: 39,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0].grade || 0;
            const outcome2 = this.learningOutcomes[1].grade || 0;

            const finalGrade = 0.3 * outcome1 + 0.7 * outcome2;

            return [
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
                `N/A`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "1665_ICC0",
        name: "Digitalització Aplicada als Sectors Productius",
        learningOutcomes: [
            {
                outcome1:
                    "Analitza el concepte de digitalització i la seva repercussió en els sectors productius tenint en compte l'activitat de l'empresa i identificant entorns IT (Information Technology: tecnologia de la informació) i OT (Operation Technology: tecnologia d'operació) característics.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome2:
                    "Caracteritza les tecnologies habilitadores digitals necessàries per a l'adequació/transformació de les empreses a entorns digitals descrivint les seves característiques i aplicacions.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome3:
                    "Identifica sistemes basats en cloud/núvol i la seva influència en el desenvolupament dels sistemes digitals.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome4:
                    "Identifica aplicacions de la IA (intel·ligència artificial) en entorns del sector on està emmarcat el títol descrivint les millores implícites en la seva implementació.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome5:
                    "Avalua la importància de les dades, així com la seva protecció en una economia digital globalitzada, definint sistemes de seguretat i ciberseguretat tant a nivell d'equip/sistema, com a globals.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome6:
                    "Desenvolupa un projecte de transformació digital d'una empresa d'un sector relacionat amb el títol, tenint en compte els canvis que s'han de produir en funció dels objectius de l'empresa.",
                grade: 9,
                finalGrade: null,
            },
        ],
        absences: 2,
        totalAbsences: 33,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes?.[0]?.grade || 0;
            const outcome2 = this.learningOutcomes?.[1]?.grade || 0;
            const outcome3 = this.learningOutcomes?.[2]?.grade || 0;
            const outcome4 = this.learningOutcomes?.[3]?.grade || 0;
            const outcome5 = this.learningOutcomes?.[4]?.grade || 0;
            const outcome6 = this.learningOutcomes?.[5]?.grade || 0;

            const finalGrade =
                (outcome1 + outcome2 + outcome3 + outcome4 + outcome5 + outcome6) / 6;

            return [
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
                `N/A`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "1708_ICC0",
        name: "Sostenibilitat Aplicada al Sistema Productiu",
        learningOutcomes: [
            {
                outcome1: "ASG i desenvolupament sostenible.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome2: "Reptes ambientals i socials.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome3: "Criteris de sostenibilitat en l'acompliment professional i personal.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome4: "Productes i Serveis Responsables i Economia Circular.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome5: "Activitats Sostenibles i Minimització de l'Impacte Mediambiental.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome6: "Anàlisi d'un pla de sostenibilitat.",
                grade: 10,
                finalGrade: null,
            },
        ],
        absences: 25,
        totalAbsences: 46,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0].grade || 0;
            const outcome2 = this.learningOutcomes[1].grade || 0;
            const outcome3 = this.learningOutcomes[2].grade || 0;
            const outcome4 = this.learningOutcomes[3].grade || 0;
            const outcome5 = this.learningOutcomes[4].grade || 0;
            const outcome6 = this.learningOutcomes[5].grade || 0;

            const finalGrade =
                0.1 * outcome1 +
                0.1 * outcome2 +
                0.3 * outcome3 +
                0.1 * outcome4 +
                0.1 * outcome5 +
                0.3 * outcome6;

            return [
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
                `N/A`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "1710_ICC0",
        name: "Itinerari Personal per a l'Ocupabilitat II",
        learningOutcomes: [
            {
                outcome1:
                    "Estratègies per a la cerca de feina\nPlanifica i posa en marxa estratègies en els diferents processos selectius d'ocupació que li permeten millorar les seves possibilitats d'inserció laboral.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome2:
                    "Competències per a l'ocupabilitat\nAplica estratègies relacionades amb les competències personals, socials i emocionals per al desenvolupament de la seva iniciativa emprenedora i la millora de la seva ocupabilitat.",
                grade: 9,
                finalGrade: null,
            },
            {
                outcome3:
                    "Innovació i Emprenedoria\nPosa en pràctica les habilitats emprenedores necessàries per al desenvolupament de processos d'innovació i recerca aplicades que promouen la modernització del sector productiu cap a un model sostenible.",
                grade: 8,
                finalGrade: null,
            },
            {
                outcome4:
                    "Idees emprenedores i Noves oportunitats\nIdentifica, defineix i valida idees d'emprenedoria generadores de noves oportunitats a partir d'estratègies d'anàlisi de l'entorn socioproductiu utilitzant metodologies àgils per l'emprenedoria.",
                grade: 10,
                finalGrade: null,
            },
            {
                outcome5:
                    "El Projecte emprenedor\nDesenvolupa un projecte emprenedor d'innovació social i/o tecnològica aplicada en col·laboració amb l'entorn.",
                grade: 9,
                finalGrade: null,
            },
        ],
        absences: 7,
        totalAbsences: 13,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0].grade || 0;
            const outcome2 = this.learningOutcomes[1].grade || 0;
            const outcome3 = this.learningOutcomes[2].grade || 0;
            const outcome4 = this.learningOutcomes[3].grade || 0;
            const outcome5 = this.learningOutcomes[4].grade || 0;

            const finalGrade =
                0.15 * outcome1 +
                0.15 * outcome2 +
                0.15 * outcome3 +
                0.15 * outcome4 +
                0.4 * outcome5;

            return [
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
                `N/A`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
    {
        code: "ml",
        name: "Mòdul Profesional Optatiu + Machine Learning",
        learningOutcomes: [
            {
                outcome1: "Crea aplicacions fent ús de models d'aprenentatge automàtic",
                grade: 9,
                finalGrade: null,
            },
        ],
        absences: 16,
        totalAbsences: 26,
        calculateFinalGrade() {
            const outcome1 = this.learningOutcomes[0].grade || 0;

            const finalGrade = outcome1;

            return [
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
                `N/A`,
                `${Number(finalGrade.toFixed(2))} (${Math.round(finalGrade)})`,
            ];
        },
    },
];

modulesData.forEach((moduleItem) => {
    moduleItem.learningOutcomes.forEach((outcome) => {
        outcome.finalGrade = Number.isFinite(outcome.grade) ? Math.round(outcome.grade) : null;
    });
});

const createModuleNavigation = function () {
    const navigation = document.getElementById("moduleNavigation");
    if (!navigation) return;

    modulesData.forEach((moduleItem) => {
        const button = document.createElement("button");
        button.classList.add("module-tab");
        button.dataset.module = moduleItem.code;

        const shortCode = moduleItem.code.split("_")[0];
        button.textContent = shortCode;
        button.addEventListener("click", () => setActiveModule(moduleItem.code));
        navigation.appendChild(button);
    });
};

const renderOutcomesTable = function (moduleCode) {
    const table = document.getElementById("outcomesTable");
    const title = document.getElementById("moduleTitle");
    const container = document.querySelector(".table-container");

    if (!table || !title) return;

    table.replaceChildren();

    const existingSummary = document.getElementById("summaryTable");
    existingSummary?.remove();

    const moduleItem = modulesData.find((item) => item.code === moduleCode);
    if (!moduleItem) return;

    title.textContent = `${moduleItem.name} (${moduleItem.code})`;

    if (moduleItem.learningOutcomes.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 3;
        emptyCell.classList.add("no-data");
        emptyCell.textContent = "No hi ha resultats d'aprenentatge disponibles";
        emptyRow.appendChild(emptyCell);

        const emptyBody = document.createElement("tbody");
        emptyBody.appendChild(emptyRow);
        table.appendChild(emptyBody);
        return;
    }

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const outcomeHeader = document.createElement("th");
    outcomeHeader.textContent = "RA";

    const descriptionHeader = document.createElement("th");
    descriptionHeader.textContent = "Descripció";

    const gradeHeader = document.createElement("th");
    gradeHeader.textContent = "Nota";

    headerRow.appendChild(outcomeHeader);
    headerRow.appendChild(descriptionHeader);
    headerRow.appendChild(gradeHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    moduleItem.learningOutcomes.forEach((outcome, index) => {
        const row = document.createElement("tr");

        const outcomeCell = document.createElement("td");
        outcomeCell.classList.add("column-outcome");
        outcomeCell.dataset.label = "RA";
        outcomeCell.textContent = `RA${index + 1}`;

        const descriptionCell = document.createElement("td");
        descriptionCell.classList.add("column-description");
        descriptionCell.dataset.label = "Descripció";
        descriptionCell.textContent = outcome[`outcome${index + 1}`];

        const gradeCell = document.createElement("td");
        gradeCell.classList.add("column-grade");
        gradeCell.dataset.label = "Nota";

        const grade = outcome.grade;
        const finalGrade = outcome.finalGrade;

        if (grade === null && finalGrade === null) {
            gradeCell.textContent = "Pendent";
            gradeCell.classList.add("pending");
        } else {
            gradeCell.textContent = `${grade ?? ""} (${finalGrade ?? ""})`;
        }

        row.appendChild(outcomeCell);
        row.appendChild(descriptionCell);
        row.appendChild(gradeCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    const results = moduleItem.calculateFinalGrade();
    const summaryTable = document.createElement("table");
    summaryTable.classList.add("summary-table");
    summaryTable.id = "summaryTable";

    const summaryFooter = document.createElement("tfoot");
    summaryFooter.classList.add("summary-module");

    const summaryHeaderRow = document.createElement("tr");
    summaryHeaderRow.classList.add("summary-header");

    const moduleHeader = document.createElement("th");
    moduleHeader.textContent = "Mòdul";
    const companyHeader = document.createElement("th");
    companyHeader.textContent = "Empresa";
    const finalHeader = document.createElement("th");
    finalHeader.textContent = "Final";
    const absencesHeader = document.createElement("th");
    absencesHeader.textContent = "Absències";

    summaryHeaderRow.appendChild(moduleHeader);
    summaryHeaderRow.appendChild(companyHeader);
    summaryHeaderRow.appendChild(finalHeader);
    summaryHeaderRow.appendChild(absencesHeader);
    summaryFooter.appendChild(summaryHeaderRow);

    const summaryRow = document.createElement("tr");

    const moduleGradeCell = document.createElement("td");
    moduleGradeCell.dataset.label = "Mòdul";
    moduleGradeCell.classList.add("column-module-grade");
    moduleGradeCell.textContent = results[0];

    const companyGradeCell = document.createElement("td");
    companyGradeCell.dataset.label = "Empresa";
    companyGradeCell.classList.add("column-company-grade");
    companyGradeCell.textContent = results[1];

    const finalGradeCell = document.createElement("td");
    finalGradeCell.dataset.label = "Final";
    finalGradeCell.classList.add("column-final-grade");
    finalGradeCell.textContent = results[2];

    const absencesCell = document.createElement("td");
    absencesCell.dataset.label = "Absències";
    absencesCell.classList.add("column-absences-total");
    absencesCell.textContent = `${moduleItem.absences} / ${moduleItem.totalAbsences}`;

    summaryRow.appendChild(moduleGradeCell);
    summaryRow.appendChild(companyGradeCell);
    summaryRow.appendChild(finalGradeCell);
    summaryRow.appendChild(absencesCell);
    summaryFooter.appendChild(summaryRow);
    summaryTable.appendChild(summaryFooter);

    if (container) container.appendChild(summaryTable);
};

const setActiveModule = function (moduleCode) {
    document.querySelectorAll(".module-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.module === moduleCode);
    });

    renderOutcomesTable(moduleCode);
};

const initApp = function () {
    createModuleNavigation();
    setActiveModule("0612_ICC0");

    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
};

document.addEventListener("DOMContentLoaded", initApp);
