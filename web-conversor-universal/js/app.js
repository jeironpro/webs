import { conversionData } from "./data.js";

const categoryList = document.querySelector("#category-list");
const converter = document.querySelector("#converter");

const convertValue = (categoryId, fromId, toId, rawValue) => {
    const result = converter.querySelector(".converter__result");
    if (!result) return;

    const value = rawValue === "" ? Number.NaN : Number(rawValue);
    if (!Number.isFinite(value)) {
        result.textContent = "";
        result.classList.remove("is-visible");
        return;
    }

    const units = conversionData[categoryId].units;
    const fromUnit = units.find((unit) => unit.id === fromId);
    const toUnit = units.find((unit) => unit.id === toId);
    if (!fromUnit || !toUnit) return;

    const converted = toUnit.fromBase(fromUnit.toBase(value));
    if (!Number.isFinite(converted)) {
        result.textContent = "";
        result.classList.remove("is-visible");
        return;
    }

    result.textContent = converted.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    result.classList.add("is-visible");
};

const setActiveCategory = (categoryId) => {
    categoryList.querySelectorAll(".category-button").forEach((button) => {
        const isActive = button.dataset.category === categoryId;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
};

const renderCategory = (categoryId) => {
    converter.replaceChildren();
    setActiveCategory(categoryId);

    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.inputMode = "decimal";
    valueInput.id = "conversion-value";
    valueInput.className = "converter__value";
    valueInput.setAttribute("aria-label", "Valor a convertir");

    const selects = document.createElement("div");
    selects.className = "converter__selects";

    const units = conversionData[categoryId].units;
    const fromSelect = document.createElement("select");
    fromSelect.className = "converter__select";
    fromSelect.setAttribute("aria-label", "Unidad de origen");

    units.forEach((unit) => {
        const option = document.createElement("option");
        option.value = unit.id;
        option.textContent = unit.name;
        fromSelect.append(option);
    });

    const toSelect = fromSelect.cloneNode(true);
    toSelect.setAttribute("aria-label", "Unidad de destino");
    if (toSelect.options.length > 1) {
        toSelect.selectedIndex = 1;
    }

    selects.append(fromSelect, toSelect);

    const result = document.createElement("span");
    result.className = "converter__result";
    result.setAttribute("role", "status");
    result.setAttribute("aria-live", "polite");

    const recalculate = () => {
        convertValue(categoryId, fromSelect.value, toSelect.value, valueInput.value);
    };

    valueInput.addEventListener("input", recalculate);
    fromSelect.addEventListener("change", recalculate);
    toSelect.addEventListener("change", recalculate);

    converter.append(valueInput, selects, result);
};

Object.entries(conversionData).forEach(([categoryId, category]) => {
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
