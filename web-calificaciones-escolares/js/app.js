const $ = (selector) => document.querySelector(selector);

const MONTH_PERIODS = {
    "ago-sept-oct": "Ago–sept–oct",
    "nov-dic-ene": "Nov–dic–ene",
    "feb-mar": "Feb–mar",
    "abr-may-jun": "Abr–may–jun",
};

const TRIMESTER_METRICS = [
    ["cp1", "CP 1"],
    ["cp2", "CP 2"],
    ["cp3", "CP 3"],
    ["cp4", "CP 4"],
    ["pfp", "PFP"],
    ["cfp", "CFP"],
    ["cfa", "CFA"],
];

const PRE_PRIMARY_DIMENSIONS = [
    ["dimension_socio_emocional", "Dimensión socio-emocional"],
    ["dimension_de_la_expresion_y_comunicacion", "Dimensión de la expresión y comunicación"],
];

const LEVELS = [
    ["pre_primaria", "Pre primario"],
    ["primaria", "Primaria"],
    ["secundaria", "Secundaria"],
];

function formatCourseName(course) {
    return course
        .toLowerCase()
        .replace(
            /(^|(?<=\.)\s*)(\S)/g,
            (_match, previous, letter) => previous + letter.toUpperCase()
        );
}

function toTitleCase(key) {
    return key.replaceAll("_", " ").replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

function metricLabel(key) {
    return TRIMESTER_METRICS.find(([id]) => id === key)?.[1] ?? toTitleCase(key);
}

function periodLabel(key) {
    return MONTH_PERIODS[key] ?? toTitleCase(key);
}

function levelData(record) {
    return LEVELS.map(([key]) => record[key]);
}

function schoolYears(record) {
    return levelData(record).map((level) => level["año_escolar"]);
}

function fromHtml(html) {
    const parsed = new DOMParser().parseFromString(html.trim(), "text/html");
    return document.importNode(parsed.body.firstElementChild, true);
}

async function loadRecord() {
    const response = await fetch("data/qualifications.json");
    if (!response.ok)
        throw new Error(`No se pudo leer data/qualifications.json (${response.status})`);
    return response.json();
}

function renderHeader(record) {
    $("#institution").textContent = record.institucion;

    $("#enrollment").textContent = `Matrícula ${record.matricula}`;

    const years = schoolYears(record);
    const courseNames = levelData(record).map((level) => formatCourseName(level.curso));
    $("#lede").textContent =
        `Este documento reúne las calificaciones escolares correspondientes a la matrícula ` +
        `${record.matricula} en el ${record.institucion}: ${courseNames[0]} (${years[0]}), ` +
        `${courseNames[1]} (${years[1]}) y ${courseNames[2]} (${years[2]}).`;
}

function renderStats(record) {
    const finalIndex = record.secundaria.indice?.final;
    const finals = Object.values(record.secundaria.calificacion_final ?? {});
    const average = finals.length
        ? Math.round((finals.reduce((sum, grade) => sum + grade, 0) / finals.length) * 10) / 10
        : null;
    const years = schoolYears(record);

    const stats = [
        [finalIndex, "Índice académico final (6to. de secundaria)"],
        [average, "Promedio de calificaciones finales"],
        [`${years[0]} — ${years[2]}`, "Período cubierto por el expediente"],
    ].filter(([value]) => value !== null && value !== undefined);

    const container = $("#stats");
    for (const [value, label] of stats) {
        container.append(
            fromHtml(`
			<div class="stat">
				<span class="stat__value">${value}</span>
				<span class="stat__label">${label}</span>
			</div>
		`)
        );
    }
    container.hidden = false;
}

function markCell(value, label) {
    if (value) return `<td data-label="${label}"><span class="mark">✓</span></td>`;
    return `<td data-label="${label}"><span class="mark--empty" aria-label="Sin registro">—</span></td>`;
}

function gradeCell(value, label, highlighted = false) {
    const cssClass = highlighted ? "num highlighted" : "num";
    return value === null || value === undefined
        ? `<td class="${cssClass}" data-label="${label}">—</td>`
        : `<td class="${cssClass}" data-label="${label}">${value}</td>`;
}

function cardTable(tableHtml) {
    return `<div class="grade-card"><div class="table-wrap">${tableHtml}</div></div>`;
}

function levelSection(position, record, key, contentHtml) {
    const course = formatCourseName(record[key].curso);
    const year = record[key]["año_escolar"];
    return fromHtml(`
		<section class="level" id="${key}" aria-labelledby="title-${key}">
			<div class="level__header">
				<h2 class="level__title" id="title-${key}">${course}</h2>
				<span class="chip">${year}</span>
			</div>
			${contentHtml}
		</section>
	`);
}

function indicatorsTable(caption, indicators) {
    const rows = indicators
        .map(
            (indicator) => `
			<tr>
				<th scope="row">${indicator.indicador}</th>
				${markCell(indicator.inicio_ano_escolar, "Inicio")}
				${markCell(indicator.primer_periodo, "Primer período")}
				${markCell(indicator.segundo_periodo, "Segundo período")}
			</tr>`
        )
        .join("");

    return cardTable(`
		<table>
			<caption>${caption}</caption>
			<thead>
				<tr>
					<th scope="col">Indicador</th>
					<th scope="col">Inicio del año escolar</th>
					<th scope="col">Primer período</th>
					<th scope="col">Segundo período</th>
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>`);
}

function renderPrePrimary(record) {
    const prePrimary = record.pre_primaria;

    const content = PRE_PRIMARY_DIMENSIONS.map(([key, title]) =>
        indicatorsTable(title, prePrimary[key])
    ).join("");

    return levelSection("1", record, "pre_primaria", content);
}

function trimesterTable(name, subjects) {
    const hasCfa = Object.values(subjects).some(
        (subject) => subject.cfa !== null && subject.cfa !== undefined
    );
    const columns = TRIMESTER_METRICS.filter(([key]) => key !== "cfa" || hasCfa);

    const header = columns.map(([, label]) => `<th scope="col" class="num">${label}</th>`).join("");

    const rows = Object.entries(subjects)
        .map(([subjectName, grades]) => {
            const cells = columns
                .map(([key, label], index) =>
                    gradeCell(grades[key], label, index === columns.length - 1)
                )
                .join("");
            return `<tr><th scope="row">${toTitleCase(subjectName)}</th>${cells}</tr>`;
        })
        .join("");

    return cardTable(`
		<table>
			<caption>${name}</caption>
			<thead>
				<tr>
					<th scope="col">Asignatura</th>
					${header}
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>`);
}

function overallIndexTable(index) {
    if (!index) return "";

    const metrics = [
        ...new Set(Object.values(index).flatMap((trimester) => Object.keys(trimester))),
    ];
    const trimesterNames = Object.keys(index);
    const rows = metrics
        .map((metric) => {
            const cells = trimesterNames
                .map((trimester) => gradeCell(index[trimester][metric], toTitleCase(trimester)))
                .join("");
            return `<tr><th scope="row">${metricLabel(metric)}</th>${cells}</tr>`;
        })
        .join("");

    return `
		<h3>Índice general</h3>
		${cardTable(`
			<table>
				<thead>
					<tr>
						<th scope="col"></th>
						${trimesterNames.map((trimester) => `<th scope="col" class="num">${toTitleCase(trimester)}</th>`).join("")}
					</tr>
				</thead>
				<tbody>${rows}</tbody>
			</table>`)}`;
}

function legendCard(legend) {
    if (!legend) return "";
    const items = Object.entries(legend)
        .map(
            ([abbreviation, meaning]) =>
                `<strong>${abbreviation.toUpperCase()}</strong> — ${meaning}`
        )
        .join(" · ");
    return `<div class="grade-card"><p class="legend">${items}</p></div>`;
}

function renderPrimary(record) {
    const grades = record.primaria.notas;

    const trimesters = Object.entries(grades)
        .filter(([key]) => key.endsWith("_trimestre"))
        .map(([key, subjects]) => trimesterTable(toTitleCase(key), subjects))
        .join("");

    return levelSection(
        "2",
        record,
        "primaria",
        trimesters + overallIndexTable(grades.indice) + legendCard(grades.leyenda)
    );
}

function renderSecondary(record) {
    const partialGrades = record.secundaria.calificaciones_parciales;
    const finalGrades = record.secundaria.calificacion_final;
    const academicIndex = record.secundaria.indice;

    const periods = [
        ...new Set(Object.values(partialGrades).flatMap((grades) => Object.keys(grades))),
    ];

    const partialRows = Object.entries(partialGrades)
        .map(([subject, grades]) => {
            const cells = periods
                .map((period) => gradeCell(grades[period], periodLabel(period)))
                .join("");
            return `<tr><th scope="row">${toTitleCase(subject)}</th>${cells}</tr>`;
        })
        .join("");

    const finalRows = Object.entries(finalGrades)
        .map(([subject, grade], index, all) => {
            const isLast = index === all.length - 1;
            return `<tr><th scope="row">${toTitleCase(subject)}</th>${gradeCell(grade, "Calificación final", isLast)}</tr>`;
        })
        .join("");

    const indexRows = Object.entries(academicIndex)
        .map(([period, value], position, all) => {
            const isFinal = position === all.length - 1;
            const name = isFinal ? "Calificación final" : periodLabel(period);
            return `<tr><th scope="row">${name}</th>${gradeCell(value, "Índice", isFinal)}</tr>`;
        })
        .join("");

    const content = `
		<h3>Calificaciones parciales</h3>
		${cardTable(`
			<table>
				<thead>
					<tr>
						<th scope="col">Asignatura</th>
						${periods.map((period) => `<th scope="col" class="num">${periodLabel(period)}</th>`).join("")}
					</tr>
				</thead>
				<tbody>${partialRows}</tbody>
			</table>`)}

		<h3>Calificación final por asignatura</h3>
		${cardTable(`
			<table>
				<tbody>${finalRows}</tbody>
			</table>`)}

		<h3>Índice académico</h3>
		${cardTable(`
			<table>
				<tbody>${indexRows}</tbody>
			</table>`)}`;

    return levelSection("3", record, "secundaria", content);
}

function showLevel(levelKey) {
    for (const [key] of LEVELS) {
        const section = document.getElementById(key);
        if (section) section.hidden = key !== levelKey;
    }
    for (const link of $("#tabs").querySelectorAll("a")) {
        const isActive = link.getAttribute("href") === `#${levelKey}`;
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
    }
}

function levelFromHash() {
    const key = location.hash.replace("#", "");
    return LEVELS.some(([id]) => id === key) ? key : "pre_primaria";
}

function renderSections(record) {
    const container = $("#content");

    const sections = {
        pre_primaria: renderPrePrimary(record),
        primaria: renderPrimary(record),
        secundaria: renderSecondary(record),
    };

    const tabs = $("#tabs");
    for (const [key, label] of LEVELS) {
        sections[key].hidden = true;
        container.append(sections[key]);

        const link = fromHtml(`<a href="#${key}">${label}</a>`);
        link.addEventListener("click", (event) => {
            event.preventDefault();
            history.replaceState(null, "", `#${key}`);
            showLevel(key);
        });
        tabs.append(link);
    }

    window.addEventListener("hashchange", () => showLevel(levelFromHash()));

    tabs.hidden = false;
    container.hidden = false;
    showLevel(levelFromHash());
}

async function init() {
    try {
        const data = await loadRecord();
        renderHeader(data[0]);
        renderStats(data[0]);
        renderSections(data[0]);
    } catch (error) {
        const notice = $("#notice-error");
        notice.textContent = `No fue posible mostrar el expediente: ${error.message}`;
        notice.hidden = false;
        $("#lede").hidden = true;
    }
}

init();
