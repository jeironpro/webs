const CONSENT_KEY = "web-lexaro:storage-consent";
const APP_STORAGE_KEYS = ["tareasKanban", "contadorTareasKanban"];

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
    const revoke = document.getElementById("storage-consent-revoke");
    const reopen = document.getElementById("storage-consent-reopen");
    if (!banner || !accept || !decline || !revoke || !reopen) {
        return;
    }

    const initial = banner.querySelector("[data-consent-initial]");
    const declined = banner.querySelector("[data-consent-declined]");
    const active = banner.querySelector("[data-consent-active]");
    const confirm = banner.querySelector("[data-consent-confirm]");
    const error = banner.querySelector("[data-consent-error]");
    let phase = "initial";

    const show = (nextPhase) => {
        phase = nextPhase;
        banner.dataset.phase = phase;
        initial.hidden = phase !== "initial";
        declined.hidden = phase !== "declined";
        active.hidden = phase !== "active";
        confirm.hidden = phase !== "confirm";
        accept.hidden = phase !== "initial" && phase !== "declined";
        revoke.hidden = phase !== "active" && phase !== "confirm";
        decline.textContent =
            phase === "initial"
                ? "Ahora no"
                : phase === "declined"
                  ? "Entendido"
                  : phase === "active"
                    ? "Cerrar"
                    : "Cancelar";
        revoke.textContent =
            phase === "confirm" ? "Sí, borrar todo" : "Retirar consentimiento y borrar datos";
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
        if (phase === "confirm") {
            show("active");
            revoke.focus();
            return;
        }
        dismiss();
    });

    revoke.addEventListener("click", () => {
        if (phase === "active") {
            show("confirm");
            revoke.focus();
            return;
        }

        try {
            APP_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
            window.localStorage.removeItem(CONSENT_KEY);
        } catch {
            error.hidden = false;
            return;
        }
        window.location.reload();
    });

    reopen.addEventListener("click", () => {
        if (hasStorageConsent()) {
            show("active");
            revoke.focus();
        } else {
            show("declined");
            accept.focus();
        }
    });

    if (hasStorageConsent()) {
        banner.hidden = true;
        reopen.hidden = false;
        return;
    }

    show("initial");
}
