let root = null;
let hideTimer = null;

export function initToast() {
    root = document.getElementById("toast");
}

function hide() {
    clearTimeout(hideTimer);
    if (root) {
        root.hidden = true;
        root.replaceChildren();
    }
}

export function showToast({ message, tone = "error", action = null } = {}) {
    if (!root) {
        return;
    }

    root.classList.toggle("toast--error", tone === "error");
    root.replaceChildren();

    const msg = document.createElement("span");
    msg.className = "toast__msg";
    msg.textContent = message;
    root.append(msg);

    if (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "toast__action";
        button.textContent = action.label;
        button.addEventListener("click", () => {
            action.run();
            hide();
        });
        root.append(button);
    }

    root.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 6000);
}
