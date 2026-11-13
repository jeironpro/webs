const display = document.querySelector("#display");
const keypad = document.querySelector("#keypad");

if (!display || !keypad) {
    throw new Error("No se encontraron los elementos de la calculadora");
}

const state = {
    operator: "",
    firstOperand: "",
    secondOperand: "",
    resultShown: false,
};

const setDisplay = (value) => {
    display.textContent = String(value);
};

const clearOperatorSelection = () => {
    keypad.querySelectorAll(".calculator__button--selected").forEach((button) => {
        button.classList.remove("calculator__button--selected");
    });
};

const markOperator = (operator) => {
    clearOperatorSelection();
    const button = [...keypad.querySelectorAll("[data-operator]")].find(
        (candidate) => candidate.dataset.operator === operator
    );
    button?.classList.add("calculator__button--selected");
};

const appendValue = (current, value) => {
    if (value === ".") {
        return current.includes(".") ? current : current === "" ? "0." : `${current}.`;
    }
    return current === "0" ? value : `${current}${value}`;
};

const enterDigit = (value) => {
    if (state.resultShown && state.operator === "") {
        state.firstOperand = "";
        state.resultShown = false;
    }

    if (state.operator === "") {
        state.firstOperand = appendValue(state.firstOperand, value);
        setDisplay(state.firstOperand || "0");
        return;
    }

    state.secondOperand = appendValue(state.secondOperand, value);
    setDisplay(state.secondOperand || "0");
};

const evaluate = (left, operation, right) => {
    switch (operation) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return left / right;
        case "%":
            return left / 100;
        case "√":
            return Math.sqrt(left);
        default:
            return left;
    }
};

const calculate = () => {
    if (state.operator === "") {
        return;
    }

    const left = Number.parseFloat(state.firstOperand);
    const right = Number.parseFloat(state.secondOperand);
    const result = evaluate(left, state.operator, right);

    clearOperatorSelection();
    state.operator = "";
    state.secondOperand = "";
    state.resultShown = true;

    if (!Number.isFinite(result)) {
        state.firstOperand = "";
        setDisplay("Error");
        return;
    }

    const normalized = Number(result.toPrecision(12));
    state.firstOperand = String(normalized);
    setDisplay(normalized);
};

const selectOperator = (operator) => {
    if (state.secondOperand !== "") {
        calculate();
    }

    state.operator = operator;
    state.resultShown = false;
    markOperator(operator);
};

const clearEntry = () => {
    if (state.resultShown) {
        clearAll();
        return;
    }

    const nextValue = display.textContent.length > 1 ? display.textContent.slice(0, -1) : "0";
    setDisplay(nextValue);

    if (state.operator === "") {
        state.firstOperand = nextValue === "0" ? "" : nextValue;
    } else {
        state.secondOperand = nextValue === "0" ? "" : nextValue;
    }
};

const clearAll = () => {
    state.operator = "";
    state.firstOperand = "";
    state.secondOperand = "";
    state.resultShown = false;
    clearOperatorSelection();
    setDisplay("0");
};

const handleKeyboard = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }

    const { key } = event;
    const isButton = event.target instanceof Element && event.target.closest("button");

    if (isButton && key === "Enter") {
        return;
    }

    if (/^[0-9]$/.test(key)) {
        enterDigit(key);
        return;
    }

    if (key === "." || key === ",") {
        event.preventDefault();
        enterDigit(".");
        return;
    }

    if (["+", "-", "*", "/", "%"].includes(key)) {
        event.preventDefault();
        selectOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        clearEntry();
        return;
    }

    if (key === "Escape" || key === "Delete") {
        clearAll();
    }
};

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        enterDigit(button.dataset.digit);
        return;
    }

    if (button.dataset.operator !== undefined) {
        selectOperator(button.dataset.operator);
        return;
    }

    if (button.dataset.action === "equals") {
        calculate();
        return;
    }

    if (button.dataset.action === "clear") {
        clearEntry();
        return;
    }

    if (button.dataset.action === "clear-all") {
        clearAll();
    }
});

document.addEventListener("keydown", handleKeyboard);
