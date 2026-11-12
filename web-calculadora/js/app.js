const display = document.getElementById("display");
const keypad = document.querySelector(".keypad");

let operator = "";
let firstOperand = "";
let secondOperand = "";
let operatorSelected = false;

function enterDigit(value) {
    if (operator === "") {
        if (firstOperand === "" && value === ".") {
            firstOperand += "0.";
            display.value += "0.";
        } else if (firstOperand === "" && value === "0") {
            return;
        } else if (value === "-" && firstOperand === "") {
            firstOperand += value;
            display.value += value;
        } else {
            firstOperand += value;
            if (operatorSelected) {
                display.value = "";
                operatorSelected = false;
            }
            display.value += value;
        }
    } else {
        if (secondOperand === "" && value === ".") {
            secondOperand += "0";
        } else if (secondOperand === "0" && value !== ".") {
            secondOperand = "";
        }
        secondOperand += value;
        display.value = "";
    }
    display.value += secondOperand;
}

function selectOperator(nextOperator) {
    if (secondOperand !== "") {
        calculate();
    }

    operator = nextOperator;
    operatorSelected = true;

    keypad.querySelectorAll(".button--operator").forEach((button) => {
        button.classList.remove("is-selected");
    });

    const operatorButton = keypad.querySelector(`button[data-operator="${operator}"]`);
    if (operatorButton) {
        operatorButton.classList.add("is-selected");
    }
}

function evaluate(left, operation, right) {
    const a = parseFloat(left);
    const b = parseFloat(right);

    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return a / b;
        default:
            return b ? NaN : a;
    }
}

function calculate() {
    const operatorButton = keypad.querySelector(`button[data-operator="${operator}"]`);
    if (operatorButton) {
        operatorButton.classList.remove("is-selected");
    }

    let result;
    if (operator === "%") {
        result = parseFloat(firstOperand) / 100;
    } else if (operator === "√") {
        result = Math.sqrt(firstOperand);
    } else {
        result = evaluate(firstOperand, operator, secondOperand);
    }

    if (!Number.isFinite(result)) {
        result = "Error";
    }

    display.value = result;
    operator = "";
    firstOperand = result.toString();
    secondOperand = "";
    operatorSelected = false;
}

function clearEntry() {
    const currentValue = display.value;
    display.value = currentValue.slice(0, -1);
    if (operator === "") {
        firstOperand = display.value;
    } else {
        secondOperand = display.value;
    }
}

function clearAll() {
    display.value = "";
    operator = "";
    firstOperand = "";
    secondOperand = "";
    operatorSelected = false;

    keypad.querySelectorAll(".button--operator").forEach((button) => {
        button.classList.remove("is-selected");
    });
}

function handleKeyboard(event) {
    const key = event.key;
    if (/^[0-9]$/.test(key)) {
        enterDigit(key);
        return;
    }
    if (key === "." || key === ",") {
        enterDigit(".");
        return;
    }
    if (key === "+" || key === "-" || key === "*" || key === "/") {
        selectOperator(key);
        return;
    }
    if (key === "%") {
        selectOperator("%");
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
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.digit !== undefined) {
        enterDigit(button.dataset.digit);
    } else if (button.dataset.operator !== undefined) {
        selectOperator(button.dataset.operator);
    } else if (button.dataset.action === "equals") {
        calculate();
    } else if (button.dataset.action === "clear") {
        clearEntry();
    } else if (button.dataset.action === "clear-all") {
        clearAll();
    }
});

document.addEventListener("keydown", handleKeyboard);
