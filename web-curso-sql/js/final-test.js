function checkAnswers() {
    let score = 0;
    const form = document.getElementById("quiz-form");
    const resultBox = document.getElementById("quiz-result");
    const totalQuestions = 25;

    const answers = {
        q1: "b", q2: "c", q3: "c",
        q4: "b", q5: "c", q6: "b",
        q7: "b", q8: "c", q9: "b", q10: "c",
        q11: "b", q12: "b", q13: "c",
        q14: "b", q15: "b", q16: "a", q17: "b",
        q18: "b", q19: "c", q20: "a",
        q21: "b", q22: "b", q23: "a", q24: "b", q25: "b"
    };

    for (let i = 1; i <= totalQuestions; i++) {
        if (form["q" + i].value === answers["q" + i]) {
            score++;
        }
    }

    const percentage = (score / totalQuestions) * 100;
    resultBox.textContent = `Has acertado ${score} de ${totalQuestions} preguntas (${percentage.toFixed(0)}%).`;
    resultBox.style.backgroundColor = "#f3f4f6";

    if (score === totalQuestions) {
        resultBox.style.color = "green";
        resultBox.textContent += " ¡PERFECTO! Eres un verdadero Maestro SQL.";
    } else if (score >= 22) {
        resultBox.style.color = "#2563eb";
        resultBox.textContent += " ¡Excelente! Dominas SQL a nivel experto.";
    } else if (score >= 18) {
        resultBox.style.color = "#059669";
        resultBox.textContent += " ¡Muy bien! Tienes un nivel sólido.";
    } else if (score >= 13) {
        resultBox.style.color = "orange";
        resultBox.textContent += " Buen trabajo, pero repasa algunos temas.";
    } else {
        resultBox.style.color = "red";
        resultBox.textContent += " Sigue estudiando, ¡tú puedes!";
    }
}

const checkButton = document.getElementById("check-button");
checkButton.addEventListener("click", checkAnswers);
