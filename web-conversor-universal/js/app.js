import { conversionData } from "./data.js";

const categoryList = document.querySelector("#category-list");
const converter = document.querySelector("#converter");
const categoryCount = document.querySelector("#category-count");

const categories = Object.entries(conversionData);

const formatNumber = (value) =>
    value.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });

const convertValue = (categoryId, fromId, toId, rawValue) => {
    const result = converter.querySelector(".converter__result");
    const unit = converter.querySelector(".converter__unit");
    if (!result) return;

    const value = rawValue === "" ? Number.NaN : Number(rawValue);
    if (!Number.isFinite(value)) {
        result.textContent = "—";
        result.classList.remove("is-visible");
        if (unit) unit.textContent = "Introduce un valor para convertir";
        return;
    }

    const units = conversionData[categoryId].units;
    const fromUnit = units.find((item) => item.id === fromId);
    const toUnit = units.find((item) => item.id === toId);
    if (!fromUnit || !toUnit) return;

    const converted = toUnit.fromBase(fromUnit.toBase(value));
    if (!Number.isFinite(converted)) {
        result.textContent = "—";
        result.classList.remove("is-visible");
        if (unit) unit.textContent = "Este valor no se puede convertir";
        return;
    }

    result.textContent = formatNumber(converted);
    result.classList.add("is-visible");
    if (unit) {
        unit.textContent = `${formatNumber(value)} ${fromUnit.name} = ${toUnit.name}`;
    }
};

const setActiveCategory = (categoryId) => {
    categoryList.querySelectorAll(".category-button").forEach((button) => {
        const isActive = button.dataset.category === categoryId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
};

const createSelectField = (labelText, units, ariaLabel) => {
    const field = document.createElement("div");
    field.className = "select-field";

    const label = document.createElement("label");
    label.textContent = labelText;

    const select = document.createElement("select");
    select.className = "converter__select";
    select.setAttribute("aria-label", ariaLabel);

    units.forEach((unit) => {
        const option = document.createElement("option");
        option.value = unit.id;
        option.textContent = unit.name;
        select.append(option);
    });

    field.append(label, select);
    return { field, select };
};

const renderCategory = (categoryId) => {
    const category = conversionData[categoryId];
    if (!category) return;

    converter.replaceChildren();
    setActiveCategory(categoryId);

    const head = document.createElement("header");
    head.className = "converter__head";

    const headingGroup = document.createElement("div");
    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = "02 · La conversión";
    const title = document.createElement("h2");
    title.className = "converter__title";
    title.textContent = category.name;
    headingGroup.append(kicker, title);

    const unitCount = document.createElement("p");
    unitCount.className = "kicker";
    unitCount.textContent = `${category.units.length} unidades`;

    head.append(headingGroup, unitCount);

    const form = document.createElement("div");
    form.className = "converter__form";

    const valueField = document.createElement("div");
    valueField.className = "field";
    const valueLabel = document.createElement("label");
    valueLabel.htmlFor = "conversion-value";
    valueLabel.textContent = "Valor de origen";
    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.inputMode = "decimal";
    valueInput.step = "any";
    valueInput.id = "conversion-value";
    valueInput.className = "converter__value";
    valueInput.placeholder = "0";
    valueInput.value = "1";
    valueInput.setAttribute("aria-label", "Valor a convertir");
    valueField.append(valueLabel, valueInput);

    const selects = document.createElement("div");
    selects.className = "converter__selects";
    const from = createSelectField("Desde", category.units, "Unidad de origen");
    const swap = document.createElement("span");
    swap.className = "swap-mark";
    swap.setAttribute("aria-hidden", "true");
    swap.textContent = "→";
    const to = createSelectField("Hasta", category.units, "Unidad de destino");
    if (to.select.options.length > 1) {
        to.select.selectedIndex = 1;
    }
    selects.append(from.field, swap, to.field);

    const resultPanel = document.createElement("div");
    resultPanel.className = "result-panel";
    const resultLabel = document.createElement("p");
    resultLabel.className = "result-panel__label";
    resultLabel.textContent = "Resultado";
    const result = document.createElement("output");
    result.className = "converter__result";
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");
    const resultUnit = document.createElement("p");
    resultUnit.className = "converter__unit";
    resultPanel.append(resultLabel, result, resultUnit);

    const recalculate = () => {
        convertValue(categoryId, from.select.value, to.select.value, valueInput.value);
    };

    valueInput.addEventListener("input", recalculate);
    from.select.addEventListener("change", recalculate);
    to.select.addEventListener("change", recalculate);

    form.append(valueField, selects, resultPanel);
    converter.append(head, form);
    recalculate();
};

categories.forEach(([categoryId, category]) => {
    const item = document.createElement("li");
    item.className = "category-list__item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = categoryId;
    button.setAttribute("aria-pressed", "false");
    button.textContent = category.name;
    button.addEventListener("click", () => renderCategory(categoryId));

    item.append(button);
    categoryList.append(item);
});

if (categoryCount) {
    categoryCount.textContent = String(categories.length).padStart(2, "0");
}

const initialCategory = categories[0]?.[0];
if (initialCategory) {
    renderCategory(initialCategory);
}
