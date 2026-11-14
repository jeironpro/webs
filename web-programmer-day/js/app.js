import * as THREE from "../vendor/three.module.js";

const COPY = {
    es: {
        htmlLang: "es",
        title: "programmer-day — Día del Programador · 256",
        live: "EN VIVO",
        day: "DÍA 256",
        meta: (year, day, total) => `${year} · ${day}/${total} días`,
        eyebrow: "CUENTA ATRÁS",
        target: "para el día 256",
        labels: ["días", "horas", "min", "seg"],
        cta: "DESLIZA PARA COMPILAR",
        whyEyebrow: "por qué 256",
        navWhy: "por-que-256",
        navByte: "el-byte",
        whyTitle: "Porque un byte se escribe una vez al año",
        why1: "El 13 de septiembre es el día 256 de un año común: 2⁸, el número de valores que cabe en un byte. Un byte completo, de 00000000 a 11111111. Los bisiestos lo celebran un día antes, el 12 de septiembre.",
        why2: "La propuesta partió de Valentin Balt en 2002, recogiendo firmas para que Rusia reconociera oficialmente el Día del Programador. Lo logró en 2009, y desde entonces la fecha se celebra en todo el mundo.",
        why3: "¿Por qué importa un número? Porque detrás de cada byte hay alguien que escribe, depura y compila. Hoy es su día.",
        factsTitle: "2⁸ en memoria",
        factsCaption: "cuatro bytes, cuatro valores: así de simple y así de enorme",
        byteEyebrow: "el byte",
        byteTitle: "Ocho bits, un día entero",
        byteHint: "recorre los bits con el cursor para encenderlos",
        byteCta: "vuelve el 13 de septiembre",
        footer: "Compilado con cariño por un programador, para los programadores.",
        footerSub: "Día del Programador · día 256 del año · 2⁸ = 256",
        lang: "English",
        langLabel: "Cambiar a inglés",
        soundOn: "Silenciar fanfarria",
        soundOff: "Activar fanfarria",
        celebrating: "ensamblando el byte…",
        compiled: "byte compilado. feliz 256.",
        celebrateTitle: "¡Feliz Día del Programador!",
        dismiss: "✕ Ver la página",
        dateLocale: "es-ES",
    },
    en: {
        htmlLang: "en",
        title: "programmer-day — Programmer’s Day · 256",
        live: "LIVE",
        day: "DAY 256",
        meta: (year, day, total) => `${year} · ${day}/${total} days`,
        eyebrow: "COUNTDOWN",
        target: "until day 256",
        labels: ["days", "hours", "min", "sec"],
        cta: "SCROLL TO COMPILE",
        whyEyebrow: "why 256",
        navWhy: "why-256",
        navByte: "the-byte",
        whyTitle: "Because a byte is written once a year",
        why1: "September 13 is day 256 of a common year: 2⁸, the number of values that fit in a byte. A full byte, from 00000000 to 11111111. Leap years celebrate it one day earlier, on September 12.",
        why2: "The idea came from Valentin Balt in 2002, who gathered signatures for Russia to officially recognize Programmer’s Day. It succeeded in 2009, and the date has been celebrated worldwide ever since.",
        why3: "Why does a number matter? Because behind every byte there is someone who writes, debugs and compiles. Today is their day.",
        factsTitle: "2⁸ in memory",
        factsCaption: "four bytes, four values: that simple and that huge",
        byteEyebrow: "the byte",
        byteTitle: "Eight bits, a whole day",
        byteHint: "hover the bits to switch them on",
        byteCta: "come back on September 13",
        footer: "Compiled with care by a programmer, for programmers.",
        footerSub: "Programmer’s Day · day 256 of the year · 2⁸ = 256",
        lang: "Español",
        langLabel: "Switch to Spanish",
        soundOn: "Mute fanfare",
        soundOff: "Enable fanfare",
        celebrating: "assembling the byte…",
        compiled: "byte compiled. happy 256.",
        celebrateTitle: "Happy Programmer’s Day!",
        dismiss: "✕ View the page",
        dateLocale: "en-US",
    },
};

const params = new URLSearchParams(window.location.search);
const forcedDay = Number(params.get("day"));
const now = new Date();
const year = now.getFullYear();
const isLeap = (value) => (value % 4 === 0 && value % 100 !== 0) || value % 400 === 0;
const dayOfYear = (date) =>
    Math.floor(
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
            Date.UTC(date.getFullYear(), 0, 1)) /
            86400000
    ) + 1;
const today = dayOfYear(now);
const totalDays = isLeap(year) ? 366 : 365;
const day256 = isLeap(year) ? 12 : 13;
const celebrating = forcedDay === 256 || (forcedDay !== 256 && today === 256);
let lang = "es";
let countdownTimer = 0;
let soundOn = true;
let sceneStarted = false;
let scene = null;
let camera = null;
let renderer = null;
let byteGroup = null;
let frame = 0;
let audioContext = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const byId = (id) => document.getElementById(id);

function targetDate() {
    let target = new Date(year, 8, day256, 0, 0, 0, 0);
    if (now.getTime() >= target.getTime() && !celebrating) {
        target = new Date(year + 1, 8, isLeap(year + 1) ? 12 : 13, 0, 0, 0, 0);
    }
    return target;
}

function setText(id, value) {
    const node = byId(id);
    if (node !== null) {
        node.textContent = value;
    }
}

function setParagraph(id, value) {
    const node = byId(id);
    if (node === null) {
        return;
    }
    if (node.querySelector("strong") !== null) {
        const strong = node.querySelector("strong");
        strong.textContent = value;
    } else {
        node.textContent = value;
    }
}

function buildDigits() {
    const groups = $$(".count-group");
    groups.forEach((group, index) => {
        const digits = group.querySelector(".count-digits");
        if (digits === null) {
            return;
        }
        while (digits.firstChild) {
            digits.removeChild(digits.firstChild);
        }
        const amount = index === 0 ? 3 : 2;
        for (let position = 0; position < amount; position += 1) {
            const digit = document.createElement("span");
            digit.className = "digit";
            digit.textContent = "0";
            digits.appendChild(digit);
        }
    });
}

function updateCountdown() {
    const distance = Math.max(0, targetDate().getTime() - Date.now());
    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const values = [days, hours, minutes, seconds];
    $$(".count-group").forEach((group, index) => {
        const digits = group.querySelector(".count-digits");
        if (digits === null) {
            return;
        }
        const value = String(values[index]).padStart(index === 0 ? 3 : 2, "0");
        Array.from(digits.children).forEach((digit, position) => {
            digit.textContent = value[position] ?? "0";
        });
        const label = group.querySelector(".count-label");
        if (label !== null) {
            label.textContent = COPY[lang].labels[index];
        }
    });
    const count = $("#hero-count");
    if (count !== null) {
        count.setAttribute(
            "aria-label",
            `${days} ${COPY[lang].labels[0]} ${hours} ${COPY[lang].labels[1]} ${minutes} ${COPY[lang].labels[2]} ${seconds} ${COPY[lang].labels[3]}`
        );
    }
    if (distance === 0 && !celebrating) {
        startCelebration();
    }
}

function applyLanguage(next) {
    lang = next;
    const copy = COPY[lang];
    document.documentElement.lang = copy.htmlLang;
    document.title = copy.title;
    setText("nav-tag-text", celebrating ? copy.day : copy.live);
    document.querySelector(".nav-tag")?.classList.toggle("nav-tag--day", celebrating);
    setText("nav-link-why", copy.navWhy);
    setText("nav-link-byte", copy.navByte);
    setText("hero-eyebrow", copy.eyebrow);
    setText("hero-sub", copy.target);
    setText("why-eyebrow", copy.whyEyebrow);
    setText("why-title", copy.whyTitle);
    setParagraph("why-p1", copy.why1);
    setParagraph("why-p2", copy.why2);
    setParagraph("why-p3", copy.why3);
    setText("facts-title", copy.factsTitle);
    setText("facts-caption", copy.factsCaption);
    setText("byte-eyebrow", copy.byteEyebrow);
    setText("byte-title", copy.byteTitle);
    setText("byte-hint", copy.byteHint);
    setText("byte-cta", copy.byteCta);
    setText("footer-statement", copy.footer);
    setText("footer-sub", copy.footerSub);
    const meta = byId("hero-meta");
    if (meta !== null) {
        meta.textContent = "";
        const accent = document.createElement("span");
        accent.className = "hero-meta-accent";
        accent.textContent = "256";
        const separator = document.createElement("span");
        separator.className = "hero-meta-sep";
        separator.textContent = "·";
        meta.append(accent, separator, document.createTextNode(copy.meta(year, today, totalDays)));
    }
    $$(".nav-lang").forEach((button) => {
        button.textContent = lang === "es" ? "EN" : "ES";
        button.setAttribute("aria-label", copy.langLabel);
        button.title = copy.langLabel;
    });
    $$(".footer-lang").forEach((button) => {
        button.textContent = copy.lang;
    });
    const cta = $(".hero-cta span");
    if (cta !== null) {
        cta.textContent = copy.cta;
    }
    const sound = $(".sound-toggle");
    if (sound !== null) {
        sound.setAttribute("aria-label", soundOn ? copy.soundOn : copy.soundOff);
        sound.title = soundOn ? copy.soundOn : copy.soundOff;
    }
    setText("cele-title", copy.celebrateTitle);
    const sub = $(".cele-sub");
    if (sub !== null && !$("#celebration")?.classList.contains("cele-done")) {
        sub.textContent = copy.celebrating;
    }
    const dismiss = byId("cele-dismiss");
    if (dismiss !== null) {
        dismiss.textContent = copy.dismiss;
    }
    updateCountdown();
}

function toggleLanguage() {
    applyLanguage(lang === "es" ? "en" : "es");
}

function updateByte() {
    const bits = $$(".bit");
    let value = 0;
    bits.forEach((bit, index) => {
        const on = bit.getAttribute("aria-pressed") === "true";
        bit.classList.toggle("bit--on", on);
        bit.querySelector(".bit-value").textContent = on ? "1" : "0";
        const weight = 7 - index;
        bit.setAttribute(
            "aria-label",
            `${on ? "1" : "0"} — ${on ? "encendido" : "apagado"} (2^${weight})`
        );
        if (on) {
            value += 2 ** weight;
        }
    });
    const readout = $(".byte-readout");
    if (readout !== null) {
        readout.textContent = "";
        readout.append(
            document.createTextNode(
                `0b${bits.map((bit) => (bit.getAttribute("aria-pressed") === "true" ? "1" : "0")).join("")} = `
            )
        );
        const strong = document.createElement("strong");
        strong.textContent = String(value);
        readout.appendChild(strong);
    }
}

function initBits() {
    $$(".bit").forEach((bit) => {
        bit.addEventListener("click", () => {
            bit.setAttribute(
                "aria-pressed",
                bit.getAttribute("aria-pressed") === "true" ? "false" : "true"
            );
            updateByte();
        });
        bit.addEventListener("pointerenter", () => {
            bit.classList.add("bit--on");
        });
        bit.addEventListener("pointerleave", () => {
            bit.classList.toggle("bit--on", bit.getAttribute("aria-pressed") === "true");
        });
    });
    updateByte();
}

function makeDigitTexture(value) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    context.fillStyle = "#04120a";
    context.fillRect(0, 0, 256, 256);
    context.strokeStyle = "#62eb80";
    context.lineWidth = 7;
    context.strokeRect(11, 11, 234, 234);
    context.fillStyle = "#baffc9";
    context.font = '700 156px "JetBrains Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(value, 128, 138);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function initByteScene() {
    if (sceneStarted) {
        return;
    }
    const canvas = byId("byte-canvas");
    if (canvas === null) {
        return;
    }
    sceneStarted = true;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 0.9, 10.5);
        byteGroup = new THREE.Group();
        byteGroup.position.y = 3.2;
        scene.add(byteGroup);
        const digits = ["0", "1", "0", "1", "0", "1", "0", "1"];
        digits.forEach((digit, index) => {
            const geometry = new THREE.BoxGeometry(1.05, 1.05, 1.05);
            const front = new THREE.MeshBasicMaterial({ map: makeDigitTexture(digit) });
            const side = new THREE.MeshStandardMaterial({
                color: 0x071a0e,
                roughness: 0.45,
                metalness: 0.35,
            });
            const cube = new THREE.Mesh(geometry, [side, side, side, side, front, side]);
            cube.position.x = (index - 3.5) * 1.3;
            cube.position.y = Math.sin(index * 0.8) * 0.15;
            cube.rotation.y = -0.18;
            byteGroup.add(cube);
        });
        scene.add(new THREE.AmbientLight(0x8fffa7, 1.2));
        const key = new THREE.PointLight(0x62eb80, 40, 30);
        key.position.set(-5, 4, 8);
        scene.add(key);
        const fill = new THREE.PointLight(0x22c55e, 24, 30);
        fill.position.set(6, -3, 5);
        scene.add(fill);
        const fallback = $(".cele-byte");
        if (fallback !== null) {
            fallback.classList.add("cele-byte--hidden");
        }
        resizeScene();
        renderScene();
    } catch {
        sceneStarted = false;
        const fallback = $(".cele-byte");
        if (fallback !== null) {
            fallback.classList.remove("cele-byte--hidden");
        }
        canvas.hidden = true;
    }
}

function resizeScene() {
    const canvas = byId("byte-canvas");
    if (renderer === null || camera === null || canvas === null) {
        return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function renderScene() {
    if (renderer === null || scene === null || camera === null || byteGroup === null) {
        return;
    }
    frame += 0.012;
    byteGroup.rotation.y = Math.sin(frame * 0.55) * 0.16;
    byteGroup.rotation.x = Math.sin(frame * 0.4) * 0.05;
    byteGroup.children.forEach((cube, index) => {
        cube.position.y = Math.sin(index * 0.8 + frame * 1.8) * 0.18;
        cube.rotation.z = Math.sin(frame * 0.7 + index) * 0.03;
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderScene);
}

function buildConfetti() {
    const container = byId("confetti");
    if (container === null) {
        return;
    }
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    for (let index = 0; index < 90; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-bit";
        piece.textContent = index % 2 === 0 ? "1" : "0";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.fontSize = `${10 + Math.random() * 16}px`;
        piece.style.animationDelay = `${Math.random() * 6}s`;
        piece.style.animationDuration = `${5 + Math.random() * 7}s`;
        container.appendChild(piece);
    }
}

function playFanfare() {
    if (!soundOn) {
        return;
    }
    try {
        audioContext = audioContext ?? new AudioContext();
        if (audioContext.state === "suspended") {
            void audioContext.resume();
        }
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((frequency, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.type = "triangle";
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.12,
                audioContext.currentTime + 0.03 + index * 0.09
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                audioContext.currentTime + 0.55 + index * 0.09
            );
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.start(audioContext.currentTime + index * 0.09);
            oscillator.stop(audioContext.currentTime + 0.7 + index * 0.09);
        });
    } catch {
        soundOn = false;
    }
}

function startCelebration() {
    const overlay = byId("celebration");
    if (overlay === null || !overlay.hidden) {
        return;
    }
    overlay.hidden = false;
    overlay.classList.remove("cele-done");
    document.body.classList.add("is-celebrating");
    buildConfetti();
    window.requestAnimationFrame(() => {
        initByteScene();
        resizeScene();
    });
    window.setTimeout(() => {
        overlay.classList.add("cele-done");
        const sub = $(".cele-sub");
        if (sub !== null) {
            sub.textContent = COPY[lang].compiled;
        }
        const dismiss = byId("cele-dismiss");
        if (dismiss !== null) {
            dismiss.hidden = false;
        }
    }, 4200);
    playFanfare();
    const sound = $(".sound-toggle");
    if (sound !== null) {
        sound.classList.toggle("sound-toggle--off", !soundOn);
        sound.setAttribute("aria-pressed", String(soundOn));
    }
}

function dismissCelebration() {
    const overlay = byId("celebration");
    const dismiss = byId("cele-dismiss");
    if (overlay === null) {
        return;
    }
    overlay.hidden = true;
    document.body.classList.remove("is-celebrating");
    if (dismiss !== null) {
        dismiss.hidden = true;
    }
}

function initReveals() {
    const targets = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
        targets.forEach((target) => target.classList.add("is-visible"));
        return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    targets.forEach((target) => observer.observe(target));
}

function initControls() {
    $$(".nav-lang, .footer-lang").forEach((button) => {
        button.addEventListener("click", toggleLanguage);
    });
    const sound = $(".sound-toggle");
    if (sound !== null) {
        sound.addEventListener("click", () => {
            soundOn = !soundOn;
            sound.classList.toggle("sound-toggle--off", !soundOn);
            sound.setAttribute("aria-pressed", String(soundOn));
            sound.setAttribute("aria-label", soundOn ? COPY[lang].soundOn : COPY[lang].soundOff);
            sound.title = soundOn ? COPY[lang].soundOn : COPY[lang].soundOff;
            if (soundOn) {
                playFanfare();
            }
        });
    }
    byId("cele-dismiss")?.addEventListener("click", dismissCelebration);
    window.addEventListener("resize", resizeScene);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !celebrating) {
            updateCountdown();
        }
    });
}

buildDigits();
initControls();
initReveals();
initBits();
applyLanguage(params.get("lang") === "en" ? "en" : "es");
if (celebrating) {
    startCelebration();
    window.clearInterval(countdownTimer);
} else {
    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);
}
