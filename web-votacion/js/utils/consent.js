const CONSENT_KEY = "web-votacion:storage-consent";

export function hasStorageConsent() {
    try {
        return window.localStorage.getItem(CONSENT_KEY) === "granted";
    } catch {
        return false;
    }
}

export function initStorageConsent() {
    const banner = document.getElementById("storage-consent");
    const accept = document.getElementById("storage-consent-accept");
    const decline = document.getElementById("storage-consent-decline");
    const reopen = document.getElementById("storage-consent-reopen");
    if (!banner || !accept || !decline || !reopen) {
        return;
    }

    const initial = banner.querySelector("[data-consent-initial]");
    const declined = banner.querySelector("[data-consent-declined]");
    const error = banner.querySelector("[data-consent-error]");
    let phase = "initial";

    const show = (nextPhase = "initial") => {
        phase = nextPhase;
        initial.hidden = phase !== "initial";
        declined.hidden = phase !== "declined";
        decline.textContent = phase === "declined" ? "Entendido" : "Ahora no";
        error.hidden = true;
        banner.hidden = false;
        reopen.hidden = true;
    };

    const dismiss = () => {
        banner.hidden = true;
        reopen.hidden = false;
        reopen.focus();
    };

    accept.addEventListener("click", () => {
        try {
            window.localStorage.setItem(CONSENT_KEY, "granted");
        } catch {
            error.hidden = false;
            return;
        }
        window.location.reload();
    });

    decline.addEventListener("click", () => {
        if (phase === "initial") {
            show("declined");
            accept.focus();
            return;
        }
        dismiss();
    });

    reopen.addEventListener("click", () => {
        show("declined");
        accept.focus();
    });

    if (hasStorageConsent()) {
        banner.hidden = true;
        reopen.hidden = true;
        return;
    }

    show("initial");
}
