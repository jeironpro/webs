const { jsPDF } = window.jspdf;
import { theme } from "./shared/theme.js";
import { labels } from "./shared/i18n.js";
import { LANG_CODES, LANG_MAP } from "./shared/constants.js";

const cn = (...c) => c.filter(Boolean).join(" ");

const EMPTY_WORK = { dates: "", occupation: "", employer: "", location: "", description: [""] };
const EMPTY_EDU = { dates: "", qualification: "", institution: "" };
const EMPTY_PROFILE = {
    title: "",
    shortDescription: "",
    workExperience: [],
    education: [],
    languageSkills: [],
    digitalSkills: [],
    communicationSkills: [],
    organisationalSkills: [],
    jobRelatedSkills: [],
    additionalInfo: "",
};

const STEPS = [
    { id: 0, label: "Datos", icon: "person" },
    { id: 1, label: "Perfiles", icon: "description" },
    { id: 2, label: "Revisar", icon: "visibility" },
    { id: 3, label: "Descarga", icon: "download" },
];

const PROFILE_SECTIONS = [
    {
        key: "intro",
        icon: "track_changes",
        label: "Introducción",
        color: "from-violet-500 to-purple-600",
    },
    { key: "work", icon: "work", label: "Experiencia", color: "from-blue-500 to-cyan-600" },
    { key: "edu", icon: "school", label: "Educación", color: "from-emerald-500 to-teal-600" },
    { key: "lang", icon: "language", label: "Idiomas", color: "from-amber-500 to-orange-600" },
    { key: "skills", icon: "bolt", label: "Skills", color: "from-pink-500 to-rose-600" },
    { key: "comm", icon: "chat", label: "Comunicación", color: "from-sky-500 to-indigo-600" },
    { key: "org", icon: "assignment", label: "Organización", color: "from-lime-500 to-green-600" },
    { key: "tech", icon: "build", label: "Técnicas", color: "from-slate-500 to-slate-700" },
    { key: "extra", icon: "attach_file", label: "Extra", color: "from-fuchsia-500 to-pink-600" },
];

const store = {
    step_: 0,
    data_: {
        name: "",
        email: "",
        telephone: "",
        address: "",
        nationality: "",
        dateOfBirth: "",
        photo: null,
        photoPreview: null,
        socialLinks: [],
        profiles: {
            es: structuredClone(EMPTY_PROFILE),
            ca: structuredClone(EMPTY_PROFILE),
            en: structuredClone(EMPTY_PROFILE),
        },
    },
    activeLang_: "es",
    langsDone_: [],
    profileExpanded_: {},
    reviewLang_: "es",
};

const root = {
    indicator: document.getElementById("step-indicator"),
    wizard: document.getElementById("step-wizard"),
    content: document.getElementById("step-content"),
};

function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
const setFill = (d, c) => {
    const [r, g, b] = hexToRgb(c);
    d.setFillColor(r, g, b);
};
const setDraw = (d, c) => {
    const [r, g, b] = hexToRgb(c);
    d.setDrawColor(r, g, b);
};
const setText = (d, c) => {
    const [r, g, b] = hexToRgb(c);
    d.setTextColor(r, g, b);
};

function checkPage(doc, y, need = 60) {
    if (y + need > theme.page.height - theme.page.margin) {
        doc.addPage();
        drawLeftBg(doc);
        return theme.page.margin;
    }
    return y;
}
function drawLeftBg(doc) {
    setFill(doc, theme.leftPanel.bg);
    doc.rect(0, 0, theme.leftPanel.width, theme.page.height, "F");
}
function renderSectionHeading(doc, text, x, y, w) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setText(doc, theme.rightPanel.heading);
    doc.text(text, x, y);
    y += 5;
    setDraw(doc, theme.rightPanel.accent);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y);
    return y + 6;
}
function renderTimelineSection(doc, entries, x, y, w) {
    for (const e of entries) {
        y = checkPage(doc, y, 40);
        if (e.dates) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            setText(doc, theme.rightPanel.muted);
            doc.text(e.dates, x, y);
            y += 10;
        }
        const title = e.occupation || e.qualification || "";
        if (title) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            setText(doc, theme.rightPanel.heading);
            const lines = doc.splitTextToSize(title, w);
            doc.text(lines, x, y);
            y += lines.length * 12;
        }
        const meta = [e.employer || e.institution, e.location].filter(Boolean).join("  |  ");
        if (meta) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            setText(doc, theme.rightPanel.muted);
            doc.text(meta, x, y);
            y += 10;
        }
        if (e.description && e.description.length) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            setText(doc, theme.rightPanel.text);
            for (const line of e.description) {
                if (line) {
                    y = checkPage(doc, y, 12);
                    const lines = doc.splitTextToSize("•  " + line, w);
                    doc.text(lines, x, y);
                    y += lines.length * 10 + 2;
                }
            }
        }
        y += 4;
    }
    return y + 6;
}
function renderBulletList(doc, items, x, y, w) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setText(doc, theme.rightPanel.text);
    for (const item of items) {
        if (item) {
            y = checkPage(doc, y, 12);
            const lines = doc.splitTextToSize("•  " + item, w);
            doc.text(lines, x, y);
            y += lines.length * 10 + 3;
        }
    }
    return y;
}
function renderLeftPanel(doc, data, profile, t, photoUrl) {
    const pw = theme.leftPanel.width,
        pad = 22;
    const x = pad,
        w = pw - pad * 2;
    let y = 30;
    drawLeftBg(doc);
    const photoR = 35,
        photoCX = x + w / 2;
    if (photoUrl) {
        doc.addImage(
            photoUrl,
            "JPEG",
            photoCX - photoR,
            y,
            photoR * 2,
            photoR * 2,
            undefined,
            "FAST"
        );
    }
    doc.setLineWidth(1.5);
    setDraw(doc, theme.leftPanel.muted);
    doc.circle(photoCX, y + photoR, photoR, "S");
    y += photoR * 2 + 10;
    if (profile.shortDescription) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(doc, theme.leftPanel.text);
        const lines = doc.splitTextToSize(profile.shortDescription, w);
        doc.text(lines, x, y);
        y += lines.length * 10 + 6;
    }
    setDraw(doc, theme.leftPanel.muted);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y);
    y += 8;
    const info = [data.email, data.address, data.telephone, data.dateOfBirth, data.nationality];
    for (const v of info) {
        if (v) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            setText(doc, theme.leftPanel.text);
            doc.text(v, x + 12, y);
            y += 10;
        }
    }
    if (data.socialLinks && data.socialLinks.length) {
        for (const s of data.socialLinks) {
            if (s.url) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                setText(doc, theme.leftPanel.text);
                const lines = doc.splitTextToSize(s.url, w - 12);
                doc.text(lines, x + 12, y);
                y += lines.length * 8 + 4;
            }
        }
    }
    y += 5;
    setDraw(doc, theme.leftPanel.muted);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y);
    y += 10;
    if (profile.digitalSkills && profile.digitalSkills.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        setText(doc, theme.leftPanel.accent);
        doc.text(t.skillsShort.toUpperCase(), x, y);
        y += 10;
        for (const cat of profile.digitalSkills) {
            if (cat.category) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(6.5);
                setText(doc, theme.leftPanel.accent);
                doc.text(cat.category, x, y);
                y += 8;
            }
            if (cat.items && cat.items.length) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                setText(doc, theme.leftPanel.text);
                for (const skill of cat.items) {
                    if (skill) {
                        const lines = doc.splitTextToSize("• " + skill, w - 4);
                        doc.text(lines, x + 4, y);
                        y += lines.length * 8 + 3;
                    }
                }
            }
            y += 2;
        }
    }
    y += 2;
    setDraw(doc, theme.leftPanel.muted);
    doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y);
    y += 10;
    if (profile.languageSkills && profile.languageSkills.length) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        setText(doc, theme.leftPanel.accent);
        doc.text(t.languagesShort.toUpperCase(), x, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(doc, theme.leftPanel.text);
        for (const l of profile.languageSkills) {
            const label = l.writing ? l.language + "  " + l.writing : l.language;
            doc.text("• " + label, x, y);
            y += 12;
        }
    }
}
export function generateCV(data, lang, photoUrl) {
    const doc = new jsPDF({ orientation: "p", unit: "pt", format: theme.page.size.toLowerCase() });
    const t = labels[lang] || labels.es;
    const profile = (data.profiles && (data.profiles[lang] || data.profiles.es)) || {};

    renderLeftPanel(doc, data, profile, t, photoUrl);

    const rightX = theme.leftPanel.width + 18;
    const pw = theme.page.width - rightX - theme.page.margin;
    let y = 40;

    if (profile.title) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        setText(doc, theme.rightPanel.muted);
        doc.text(profile.title, rightX, y);
        y += 15;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    setText(doc, theme.rightPanel.heading);
    const nameLines = doc.splitTextToSize(data.name, pw);
    doc.text(nameLines, rightX, y);
    y += nameLines.length * 24 + 8;

    setDraw(doc, theme.rightPanel.border);
    doc.setLineWidth(0.5);
    doc.line(rightX, y, rightX + pw, y);
    y += 10;

    if (profile.workExperience && profile.workExperience.length) {
        y = checkPage(doc, y, 80);
        y = renderSectionHeading(doc, t.workExperience, rightX, y, pw);
        y = renderTimelineSection(doc, profile.workExperience, rightX, y, pw);
    }
    if (profile.education && profile.education.length) {
        y = checkPage(doc, y, 60);
        y = renderSectionHeading(doc, t.education, rightX, y, pw);
        y = renderTimelineSection(doc, profile.education, rightX, y, pw);
    }
    if (profile.communicationSkills && profile.communicationSkills.length) {
        y = checkPage(doc, y, 50);
        y = renderSectionHeading(doc, t.communicationSkills, rightX, y, pw);
        y = renderBulletList(doc, profile.communicationSkills, rightX, y, pw);
        y += 6;
    }
    if (profile.organisationalSkills && profile.organisationalSkills.length) {
        y = checkPage(doc, y, 50);
        y = renderSectionHeading(doc, t.organisationalSkills, rightX, y, pw);
        y = renderBulletList(doc, profile.organisationalSkills, rightX, y, pw);
        y += 6;
    }
    if (profile.jobRelatedSkills && profile.jobRelatedSkills.length) {
        y = checkPage(doc, y, 50);
        y = renderSectionHeading(doc, t.jobRelatedSkills, rightX, y, pw);
        y = renderBulletList(doc, profile.jobRelatedSkills, rightX, y, pw);
        y += 6;
    }
    if (profile.additionalInfo) {
        y = checkPage(doc, y, 30);
        y = renderSectionHeading(doc, t.additionalInfo, rightX, y, pw);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        setText(doc, theme.rightPanel.text);
        doc.text(doc.splitTextToSize(profile.additionalInfo, pw), rightX, y);
    }
    return doc;
}

function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [],
        raf;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1,
            a: Math.random() * 0.4 + 0.1,
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(43, 108, 176, ${p.a})`;
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x,
                    dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(43, 108, 176, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
    };
}

function anadir(destino, hijos) {
    for (const hijo of [].concat(hijos)) {
        if (hijo === undefined || hijo === null || hijo === false) continue;
        destino.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    }
    return destino;
}

function crear(etiqueta, props = {}, hijos = []) {
    const el = document.createElement(etiqueta);
    for (const [clave, valor] of Object.entries(props)) {
        if (valor === undefined || valor === null || valor === false) continue;
        if (clave === "clase") el.className = cn(...[].concat(valor));
        else if (clave === "texto") el.textContent = valor;
        else if (clave === "on") {
            for (const [evento, fn] of Object.entries(valor)) el.addEventListener(evento, fn);
        } else el.setAttribute(clave, valor === true ? "" : String(valor));
    }
    anadir(el, hijos);
    return el;
}

function fragmento(...hijos) {
    return anadir(document.createDocumentFragment(), hijos);
}

const icono = (name, cls = "") =>
    crear("span", { clase: ["material-symbols-outlined", cls], texto: name });

function input(label, value, handler, type = "text", placeholder = "", colSpan = 1) {
    const span = colSpan === 2 ? "md:col-span-2" : "";
    return crear("label", { clase: ["block", span] }, [
        crear("span", { clase: "label-base", texto: label }),
        crear("input", {
            clase: "input-base",
            type,
            value,
            placeholder,
            on: { input: (e) => handler(e.target.value) },
        }),
    ]);
}

function arrayField(label, values, updateHandler, addHandler, removeHandler, placeholder) {
    const items = values.map((v, i) =>
        crear("div", { clase: "array-item", style: `animation-delay:${i * 0.03}s` }, [
            crear("input", {
                clase: "input-base flex-1",
                value: v,
                placeholder,
                on: { input: (e) => updateHandler(i, e.target.value) },
            }),
            crear("button", {
                clase: "remove-btn",
                type: "button",
                texto: "\u00d7",
                on: { click: () => removeHandler(i) },
            }),
        ])
    );
    return crear("div", { clase: "array-field" }, [
        crear("span", { clase: "label-base", texto: label }),
        ...items,
        crear(
            "button",
            {
                clase: "array-add-btn",
                type: "button",
                on: { click: addHandler },
            },
            [crear("span", { clase: "plus-icon", texto: "+" }), " Añadir"]
        ),
    ]);
}

const botonAnadir = (texto, fn) =>
    crear(
        "button",
        {
            clase: "inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors mt-4",
            type: "button",
            on: { click: fn },
        },
        [
            crear("span", {
                clase: "w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold",
                texto: "+",
            }),
            ` ${texto}`,
        ]
    );

function degradado(color) {
    const [desde, hasta] = color.split(" ");
    return `linear-gradient(135deg, var(--color-${desde.replace("from-", "")}), var(--color-${hasta.replace("to-", "")}))`;
}

function entryCard(title, color, children, onDelete) {
    return crear("div", { clase: "entry-card" }, [
        title
            ? crear("div", { clase: "entry-card-title" }, [
                  crear("div", {
                      clase: "entry-card-color-bar",
                      style: `background:${degradado(color)}`,
                  }),
                  crear("span", { clase: "entry-card-title-text", texto: title }),
              ])
            : null,
        children,
        onDelete
            ? crear("button", {
                  clase: "entry-card-delete",
                  type: "button",
                  texto: "\u00d7",
                  on: { click: () => window[onDelete]() },
              })
            : null,
    ]);
}

function sectionCard(sec, idx) {
    const open = store.profileExpanded_[sec.key];
    const content = renderSectionContent(
        sec,
        store.data_.profiles[store.activeLang_] || EMPTY_PROFILE
    );
    return crear(
        "div",
        { clase: ["glass-card overflow-hidden transition-all duration-300", open && "shadow-xl"] },
        [
            crear(
                "button",
                {
                    clase: ["section-card-btn", open && "open"],
                    type: "button",
                    on: { click: () => window.toggleProfile(sec.key) },
                },
                [
                    crear("div", { clase: "flex items-center gap-3.5" }, [
                        crear(
                            "div",
                            {
                                clase: ["section-card-icon", open && "scale-110"],
                                style: `background:${degradado(sec.color)}`,
                            },
                            [icono(sec.icon, "text-white text-sm")]
                        ),
                        crear("span", { clase: "section-card-title" }, [
                            sec.label,
                            open && idx !== undefined
                                ? crear("span", {
                                      clase: "section-card-badge",
                                      texto: `Paso ${idx + 1}`,
                                  })
                                : null,
                        ]),
                    ]),
                    crear(
                        "div",
                        { clase: ["section-card-arrow", open && "section-card-arrow-rotate"] },
                        [icono("expand_more", "w-4 h-4")]
                    ),
                ]
            ),
            open
                ? crear("div", { clase: "px-6 pb-6 space-y-5 animate-slide-down" }, [content])
                : null,
        ]
    );
}

function renderSectionContent(sec, prof) {
    switch (sec.key) {
        case "intro":
            return fragmento(
                crear("div", { clase: "grid grid-cols-1 gap-4" }, [
                    input(
                        "Título profesional",
                        prof.title,
                        (v) => window.setProf("title", v),
                        "text",
                        "Ej: Desarrollador Full Stack"
                    ),
                ]),
                crear("div", { clase: "mt-4" }, [
                    crear("label", { clase: "block" }, [
                        crear("span", { clase: "label-base", texto: "Descripción corta" }),
                        crear(
                            "textarea",
                            {
                                clase: "input-base resize-none",
                                rows: "3",
                                placeholder: "Descripción breve...",
                                on: {
                                    input: (e) =>
                                        window.setProf("shortDescription", e.target.value),
                                },
                            },
                            [prof.shortDescription]
                        ),
                    ]),
                ])
            );

        case "work": {
            const nodos = [];
            if (!prof.workExperience.length) {
                nodos.push(
                    crear("p", {
                        clase: "text-sm text-slate-400 italic",
                        texto: "Sin experiencia laboral añadida.",
                    })
                );
            }
            prof.workExperience.forEach((w, i) => {
                nodos.push(
                    entryCard(
                        `Experiencia ${i + 1}`,
                        sec.color,
                        fragmento(
                            input(
                                "Fechas",
                                w.dates,
                                (v) => window.setWorkField(i, "dates", v),
                                "text",
                                "ene 2024 - actualidad"
                            ),
                            input(
                                "Ocupación",
                                w.occupation,
                                (v) => window.setWorkField(i, "occupation", v),
                                "text",
                                "Desarrollador Full Stack"
                            ),
                            input(
                                "Empleador",
                                w.employer,
                                (v) => window.setWorkField(i, "employer", v),
                                "text",
                                "Empresa S.L."
                            ),
                            input(
                                "Ubicación",
                                w.location,
                                (v) => window.setWorkField(i, "location", v),
                                "text",
                                "Barcelona, España"
                            ),
                            arrayField(
                                "Tareas",
                                w.description,
                                (item, value) => window.setWorkDesc(i, item, value),
                                () => window.addWorkDesc(i),
                                (item) => window.removeWorkDesc(i, item),
                                "Ej: Desarrollo de APIs REST"
                            )
                        ),
                        "removeWork"
                    )
                );
            });
            nodos.push(botonAnadir("Añadir experiencia", () => window.addWork()));
            return fragmento(...nodos);
        }

        case "edu": {
            const nodos = [];
            if (!prof.education.length) {
                nodos.push(
                    crear("p", {
                        clase: "text-sm text-slate-400 italic",
                        texto: "Sin formación añadida.",
                    })
                );
            }
            prof.education.forEach((e, i) => {
                nodos.push(
                    entryCard(
                        `Formación ${i + 1}`,
                        sec.color,
                        fragmento(
                            input(
                                "Fechas",
                                e.dates,
                                (v) => window.setEduField(i, "dates", v),
                                "text",
                                "2020 - 2024"
                            ),
                            input(
                                "Titulación",
                                e.qualification,
                                (v) => window.setEduField(i, "qualification", v),
                                "text",
                                "Grado en Ingeniería"
                            ),
                            input(
                                "Institución",
                                e.institution,
                                (v) => window.setEduField(i, "institution", v),
                                "text",
                                "Universidad de Barcelona",
                                2
                            )
                        ),
                        "removeEdu"
                    )
                );
            });
            nodos.push(botonAnadir("Añadir formación", () => window.addEdu()));
            return fragmento(...nodos);
        }

        case "lang":
            return arrayField(
                "Idiomas",
                prof.languageSkills.map((l) => l.language),
                (i, value) => window.setLangSkill(i, value),
                () => window.addLangSkill(),
                (i) => window.removeLangSkill(i),
                "Ej: Inglés C1 Avanzado"
            );

        case "skills": {
            const nodos = [];
            if (!prof.digitalSkills.length) {
                nodos.push(
                    crear("p", {
                        clase: "text-sm text-slate-400 italic",
                        texto: "Sin categorías añadidas.",
                    })
                );
            }
            prof.digitalSkills.forEach((cat, i) => {
                nodos.push(
                    entryCard(
                        `Categoría ${i + 1}`,
                        sec.color,
                        fragmento(
                            input(
                                "Categoría",
                                cat.category,
                                (v) => window.setDigitalSkillCat(i, v),
                                "text",
                                "Ej: Backend, Frontend..."
                            ),
                            arrayField(
                                "Tecnologías",
                                cat.items,
                                (item, value) => window.setDigitalSkillItem(i, item, value),
                                () => window.addDigitalSkillItem(i),
                                (item) => window.removeDigitalSkillItem(i, item),
                                "Ej: React, Node.js..."
                            )
                        ),
                        "removeDigitalSkill"
                    )
                );
            });
            nodos.push(botonAnadir("Añadir categoría", () => window.addDigitalSkill()));
            return fragmento(...nodos);
        }

        default:
            return crear("p", {
                clase: "text-sm text-slate-400 italic",
                texto: "Esta sección está disponible pero no requiere entrada en este paso.",
            });
    }
}

function navButtons(step, onPrev, onNext) {
    return crear("div", { clase: "nav-buttons" }, [
        step === 0
            ? crear("div", {})
            : crear(
                  "button",
                  {
                      clase: "nav-btn prev",
                      type: "button",
                      on: { click: onPrev },
                  },
                  [icono("arrow_back", "w-4 h-4"), " Atrás"]
              ),
        crear(
            "button",
            {
                clase: "nav-btn next",
                type: "button",
                on: { click: onNext },
            },
            [" Continuar", icono("arrow_forward", "w-4 h-4")]
        ),
    ]);
}

function encabezadoPaso(color, name, titulo, subtitulo) {
    return crear("div", { clase: "flex items-center gap-3" }, [
        crear(
            "div",
            {
                clase: `w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`,
            },
            [icono(name, "text-white text-lg")]
        ),
        crear("div", {}, [
            crear("h2", { clase: "text-lg font-bold text-slate-800", texto: titulo }),
            crear("p", { clase: "text-xs text-slate-500" }, [subtitulo]),
        ]),
    ]);
}

function renderStep0() {
    const d = store.data_;
    const social = d.socialLinks.length
        ? fragmento(
              ...d.socialLinks.map((s, i) =>
                  entryCard(
                      null,
                      null,
                      fragmento(
                          input(
                              "Red",
                              s.name,
                              (v) => window.setSocialLinkName(i, v),
                              "text",
                              "LinkedIn, GitHub..."
                          ),
                          input(
                              "URL",
                              s.url,
                              (v) => window.setSocialLinkUrl(i, v),
                              "text",
                              "linkedin.com/in/usuario"
                          )
                      ),
                      () => window.removeSocialLink(i)
                  )
              )
          )
        : crear("p", { clase: "social-empty", texto: "Aún no has añadido ninguna red social." });

    const foto = d.photoPreview
        ? crear("div", { clase: "photo-preview" }, [
              crear("img", { src: d.photoPreview, alt: "" }),
              crear("button", {
                  clase: "remove-photo",
                  type: "button",
                  texto: "\u00d7",
                  on: { click: () => window.removePhoto() },
              }),
          ])
        : crear("div", { clase: "photo-placeholder" }, [icono("image", "w-10 h-10")]);

    return crear("div", { clase: "space-y-5 animate-fade-up" }, [
        crear("div", { clase: "flex items-center gap-3 mb-1" }, [
            crear(
                "div",
                {
                    clase: "w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-indigo-600 flex items-center justify-center text-white shadow-md",
                },
                [icono("person", "text-white text-lg")]
            ),
            crear("div", {}, [
                crear("h2", {
                    clase: "text-lg font-bold text-slate-800",
                    texto: "Información personal",
                }),
                crear("p", {
                    clase: "text-xs text-slate-500",
                    texto: "Tus datos de contacto y redes sociales",
                }),
            ]),
        ]),
        crear("div", { clase: "glass-card p-6" }, [
            crear("div", { clase: "grid grid-cols-1 md:grid-cols-2 gap-4" }, [
                input(
                    "Nombre completo",
                    d.name,
                    (v) => window.setDataName(v),
                    "text",
                    "Ej: María García López",
                    2
                ),
                input(
                    "Correo electrónico",
                    d.email,
                    (v) => window.setDataEmail(v),
                    "email",
                    "maria@ejemplo.com"
                ),
                input(
                    "Teléfono",
                    d.telephone,
                    (v) => window.setDataTelephone(v),
                    "text",
                    "+34 600 000 000"
                ),
                input(
                    "Dirección",
                    d.address,
                    (v) => window.setDataAddress(v),
                    "text",
                    "08001, Barcelona, España"
                ),
                input(
                    "Nacionalidad",
                    d.nationality,
                    (v) => window.setDataNationality(v),
                    "text",
                    "Española"
                ),
                input(
                    "Fecha de nacimiento",
                    d.dateOfBirth,
                    (v) => window.setDataDateOfBirth(v),
                    "date"
                ),
            ]),
        ]),
        crear("div", { clase: "glass-card p-6" }, [
            crear("div", { clase: "flex items-center gap-6 flex-wrap" }, [
                crear("div", { clase: "shrink-0" }, [foto]),
                crear("div", { clase: "flex-1 min-w-0" }, [
                    crear("label", { clase: "photo-upload-label" }, [
                        icono("upload", "w-4 h-4"),
                        " Subir foto",
                        crear("input", {
                            type: "file",
                            accept: "image/*",
                            on: { change: (e) => window.handlePhotoUpload(e) },
                        }),
                    ]),
                    crear("p", {
                        clase: "photo-hint",
                        texto: "PNG, JPG o WebP — se mostrará como recorte circular en el CV",
                    }),
                ]),
            ]),
        ]),
        crear("div", { clase: "glass-card p-6 space-y-4" }, [
            crear("div", { clase: "social-section-title" }, [
                icono("link", "w-5 h-5 text-slate-400"),
                crear("span", {
                    clase: "tracking-wider uppercase text-xs font-semibold text-slate-500",
                    texto: "Redes sociales",
                }),
            ]),
            social,
            crear(
                "button",
                {
                    clase: "inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors",
                    type: "button",
                    on: { click: () => window.addSocialLink() },
                },
                [
                    crear("span", {
                        clase: "w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold",
                        texto: "+",
                    }),
                    " Añadir red social",
                ]
            ),
        ]),
        navButtons(0, null, () => window.goToStep(1)),
    ]);
}

function renderStep1() {
    const langPills = store.langsDone_.length
        ? crear(
              "div",
              { clase: "lang-pills" },
              store.langsDone_.map((code) =>
                  crear("button", {
                      clase: ["lang-pill", code === store.activeLang_ && "active"],
                      type: "button",
                      texto: LANG_MAP[code],
                      on: { click: () => window.setActiveLang(code) },
                  })
              )
          )
        : null;

    return crear("div", { clase: "space-y-5 animate-fade-up" }, [
        crear("div", { clase: "flex items-center justify-between flex-wrap gap-3" }, [
            encabezadoPaso("from-violet-500 to-purple-600", "description", "Contenido del CV", [
                "Editando: ",
                LANG_MAP[store.activeLang_],
            ]),
            langPills,
        ]),
        crear(
            "div",
            { clase: "space-y-4" },
            PROFILE_SECTIONS.map((s, i) => sectionCard(s, i))
        ),
        navButtons(
            1,
            () => window.goToStep(0),
            () => window.checkLangDoneAndNext()
        ),
    ]);
}

function renderStep2() {
    const d = store.data_;
    const lang = store.reviewLang_;

    const hasData = (l) => {
        const p = d.profiles[l];
        return (
            p &&
            (p.title ||
                p.shortDescription ||
                p.workExperience.length ||
                p.education.length ||
                p.languageSkills.length ||
                p.digitalSkills.length ||
                p.communicationSkills.length ||
                p.organisationalSkills.length ||
                p.jobRelatedSkills.length ||
                p.additionalInfo)
        );
    };

    const available = LANG_CODES.filter(hasData);
    const currentLang = available.includes(lang) ? lang : available[0] || "es";
    const currentProf = d.profiles[currentLang] || {};

    const langTabs =
        available.length > 1
            ? crear(
                  "div",
                  {
                      clase: "inline-flex gap-1 bg-slate-100/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/60 shadow-sm",
                  },
                  available.map((code) =>
                      crear("button", {
                          clase: ["lang-tab", code === currentLang && "active"],
                          type: "button",
                          texto: LANG_MAP[code],
                          on: { click: () => window.setReviewLang(code) },
                      })
                  )
              )
            : null;

    const campoInfo = (label, value) =>
        value
            ? crear("div", { clase: "info-field" }, [
                  crear("span", { clase: "info-field-label", texto: label }),
                  crear("span", { clase: "info-field-value" }, [value]),
              ])
            : null;

    const listaInfo = (items) =>
        !items || !items.length
            ? null
            : crear(
                  "ul",
                  { clase: "info-list" },
                  items.filter((i) => i).map((i) => crear("li", { clase: "info-list-item" }, [i]))
              );

    const socialInfo = crear(
        "div",
        { clase: "space-y-2" },
        d.socialLinks
            .filter((s) => s.name || s.url)
            .map((s) =>
                crear("div", { clase: "info-list-item" }, [
                    s.name ? crear("span", { clase: "font-semibold" }, [`${s.name}: `]) : null,
                    s.url ? crear("span", { clase: "text-slate-500" }, [s.url]) : null,
                ])
            )
    );

    const workInfo = crear(
        "div",
        {},
        currentProf.workExperience.map((w, i) =>
            crear(
                "div",
                {
                    clase:
                        i < currentProf.workExperience.length - 1
                            ? "border-b border-slate-200 mb-4 pb-4"
                            : "",
                },
                [
                    crear("div", { clase: "flex items-start justify-between gap-4" }, [
                        crear("div", {}, [
                            crear("p", { clase: "font-semibold text-sm text-slate-800" }, [
                                w.occupation || "—",
                            ]),
                            crear("p", { clase: "text-xs text-slate-500" }, [
                                `${w.employer || ""}${w.employer && w.location ? " · " : ""}${w.location || ""}`,
                            ]),
                        ]),
                    ]),
                    listaInfo(w.description),
                ]
            )
        )
    );

    const eduInfo = crear(
        "div",
        {},
        currentProf.education.map((e, i) =>
            crear(
                "div",
                {
                    clase:
                        i < currentProf.education.length - 1
                            ? "border-b border-slate-200 mb-4 pb-4"
                            : "",
                },
                [
                    crear("div", { clase: "flex items-start justify-between gap-4" }, [
                        crear("div", {}, [
                            crear("p", { clase: "font-semibold text-sm text-slate-800" }, [
                                e.qualification || "—",
                            ]),
                            crear("p", { clase: "text-xs text-slate-500" }, [
                                `${e.institution || ""}${e.institution && e.dates ? " · " : ""}${e.dates || ""}`,
                            ]),
                        ]),
                    ]),
                ]
            )
        )
    );

    const infoCard = (title, inner, onEdit) =>
        crear("div", { clase: "info-card" }, [
            crear("div", { clase: "info-card-header" }, [
                crear("h3", { clase: "info-card-title", texto: title }),
                onEdit
                    ? crear("button", {
                          clase: "info-card-edit",
                          type: "button",
                          texto: "Editar",
                          on: { click: onEdit },
                      })
                    : null,
            ]),
            inner,
        ]);

    const foto = d.photoPreview
        ? crear("div", { clase: "mt-4" }, [
              crear("span", { clase: "info-field-label", texto: "Foto" }),
              crear(
                  "div",
                  {
                      clase: "mt-1 w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white shadow-md",
                  },
                  [
                      crear("img", {
                          src: d.photoPreview,
                          alt: "",
                          clase: "w-full h-full object-cover",
                      }),
                  ]
              ),
          ])
        : null;

    const tarjetas = [
        infoCard(
            "Información personal",
            fragmento(
                crear("div", { clase: "info-card-grid" }, [
                    campoInfo("Nombre", d.name),
                    campoInfo("Correo", d.email),
                    campoInfo("Teléfono", d.telephone),
                    campoInfo("Dirección", d.address),
                    campoInfo("Nacionalidad", d.nationality),
                    campoInfo("Fecha de nacimiento", d.dateOfBirth),
                ]),
                foto
            ),
            () => window.goToStep(0)
        ),
        d.socialLinks.length && d.socialLinks.some((s) => s.name || s.url)
            ? infoCard("Redes sociales", socialInfo, () => window.goToStep(0))
            : null,
        currentProf.title || currentProf.shortDescription
            ? infoCard(
                  `Introducción — ${LANG_MAP[currentLang]}`,
                  fragmento(
                      campoInfo("Título profesional", currentProf.title),
                      campoInfo("Descripción corta", currentProf.shortDescription)
                  ),
                  () => window.goToStep(1)
              )
            : null,
        currentProf.workExperience.length
            ? infoCard(`Experiencia laboral — ${LANG_MAP[currentLang]}`, workInfo, () =>
                  window.goToStep(1)
              )
            : null,
        currentProf.education.length
            ? infoCard(`Educación y formación — ${LANG_MAP[currentLang]}`, eduInfo, () =>
                  window.goToStep(1)
              )
            : null,
    ];

    return crear("div", { clase: "space-y-5 animate-fade-up" }, [
        crear("div", { clase: "step-title-area" }, [
            encabezadoPaso(
                "from-emerald-500 to-teal-600",
                "visibility",
                "Revisa tu CV",
                "Verifica que todos los datos sean correctos antes de descargar"
            ),
            langTabs,
        ]),
        ...tarjetas,
        navButtons(
            2,
            () => window.goToStep(1),
            () => window.goToStep(3)
        ),
    ]);
}

function renderStep3() {
    const d = store.data_;
    const withData = LANG_CODES.filter((l) => {
        const p = d.profiles[l];
        return (
            p && (p.title || p.shortDescription || p.workExperience.length || p.education.length)
        );
    });
    const currentLang = withData.includes(store.reviewLang_)
        ? store.reviewLang_
        : withData[0] || "es";
    const prof = d.profiles[currentLang] || {};

    const langTabs =
        withData.length > 1
            ? crear(
                  "div",
                  { clase: "download-preview-lang" },
                  withData.map((code) =>
                      crear("button", {
                          clase: ["lang-tab", code === currentLang && "active"],
                          type: "button",
                          texto: LANG_MAP[code],
                          on: { click: () => window.switchDownloadLang(code) },
                      })
                  )
              )
            : null;

    const previewContent =
        prof.title || prof.shortDescription || prof.workExperience.length || prof.education.length
            ? crear("div", { clase: "text-center text-slate-500" }, [
                  icono("picture_as_pdf", "w-12 h-12 mx-auto mb-2 text-slate-300"),
                  crear("p", { clase: "text-sm" }, [`PDF generado con ${d.name || "tu nombre"}`]),
              ])
            : crear("div", { clase: "text-center text-slate-400" }, [
                  crear("p", {
                      clase: "text-sm mb-2",
                      texto: "Completa los pasos anteriores para ver una vista previa",
                  }),
                  crear("button", {
                      clase: "btn-secondary mt-4",
                      type: "button",
                      texto: "Ir al paso 1",
                      on: { click: () => window.goToStep(0) },
                  }),
              ]);

    return crear("div", { clase: "space-y-5 animate-fade-up" }, [
        crear("div", { clase: "step-title-area" }, [
            encabezadoPaso(
                "from-emerald-500 to-teal-600",
                "download",
                "Descargar CV",
                "Genera tu currículum en PDF con el diseño profesional de dos columnas"
            ),
        ]),
        crear("div", { clase: "download-section" }, [
            crear("div", { clase: "download-preview" }, [
                crear("div", { clase: "download-preview-header" }, [
                    crear("span", {
                        clase: "download-preview-title",
                        texto: "Vista previa del PDF",
                    }),
                    langTabs,
                ]),
                crear("div", { clase: "pdf-preview-box" }, [previewContent]),
            ]),
            crear("div", { clase: "flex gap-3 justify-center flex-wrap" }, [
                crear(
                    "button",
                    {
                        clase: "btn-primary",
                        type: "button",
                        on: { click: (e) => window.downloadPDF(currentLang, e) },
                    },
                    [
                        icono("download", "w-5 h-5"),
                        ` Descargar CV en PDF (${LANG_MAP[currentLang]})`,
                    ]
                ),
                crear(
                    "button",
                    {
                        clase: "btn-secondary",
                        type: "button",
                        on: { click: () => window.goToStep(2) },
                    },
                    [icono("edit", "w-4 h-4"), " Volver a revisar"]
                ),
            ]),
            crear("p", {
                clase: "text-xs text-slate-400 text-center mt-4",
                texto: "El PDF se generará en el navegador usando jsPDF. No se envían datos a ningún servidor.",
            }),
        ]),
    ]);
}

function render() {
    switch (store.step_) {
        case 0:
            root.content.replaceChildren(renderStep0());
            break;
        case 1:
            root.content.replaceChildren(renderStep1());
            break;
        case 2:
            root.content.replaceChildren(renderStep2());
            break;
        case 3:
            root.content.replaceChildren(renderStep3());
            break;
    }
    renderIndicator();
}

function renderIndicator() {
    const iconos = ["person", "description", "visibility", "download"];

    if (root.indicator) {
        root.indicator.replaceChildren(
            ...STEPS.map((paso, i) => {
                const activo = i === store.step_;
                const hecho = i < store.step_;
                const estado = activo
                    ? "bg-navy-600 text-white shadow-md scale-110"
                    : hecho
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-100 text-slate-400";
                return crear(
                    "button",
                    {
                        clase: `w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${estado}`,
                        type: "button",
                        "aria-label": `Paso ${i + 1}: ${paso.label}`,
                        "aria-current": activo ? "step" : null,
                        on: { click: () => window.goToStep(i) },
                    },
                    [icono(hecho ? "check" : iconos[i])]
                );
            })
        );
    }

    if (root.wizard) {
        const pasos = STEPS.map((paso, i) => {
            const activo = i === store.step_;
            const hecho = i < store.step_;
            return crear(
                "button",
                {
                    clase: `flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all ${activo ? "bg-white shadow-md" : "hover:bg-white/60"}`,
                    type: "button",
                    on: { click: () => window.goToStep(i) },
                },
                [
                    crear(
                        "div",
                        {
                            clase: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activo ? "bg-gradient-to-br from-navy-500 to-navy-700 text-white shadow-sm" : hecho ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`,
                        },
                        [icono(hecho ? "check" : iconos[i])]
                    ),
                    crear("div", { clase: "min-w-0" }, [
                        crear(
                            "div",
                            {
                                clase: "text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400",
                            },
                            [`Paso ${i + 1}`]
                        ),
                        crear(
                            "div",
                            {
                                clase: `text-sm font-semibold ${activo ? "text-slate-800" : "text-slate-500"}`,
                            },
                            [paso.label]
                        ),
                    ]),
                ]
            );
        });

        const progreso = crear(
            "div",
            {
                clase: "mt-2 px-4 py-3 rounded-xl bg-gradient-to-br from-navy-50 to-indigo-50/50 border border-navy-100/50",
            },
            [
                crear(
                    "div",
                    { clase: "text-[0.7rem] font-semibold uppercase tracking-wider text-navy-500" },
                    ["Progreso"]
                ),
                crear("div", { clase: "mt-1.5 h-1.5 rounded-full bg-navy-100 overflow-hidden" }, [
                    crear("div", {
                        clase: "h-full rounded-full bg-gradient-to-r from-navy-500 to-indigo-500",
                        style: `width:${((store.step_ + 1) / STEPS.length) * 100}%`,
                    }),
                ]),
                crear("div", { clase: "mt-1 text-xs font-medium text-navy-400" }, [
                    `${store.step_ + 1} de ${STEPS.length}`,
                ]),
            ]
        );

        root.wizard.replaceChildren(...pasos, progreso);
    }
}

window.setDataName = (v) => {
    store.data_.name = v;
};
window.setDataEmail = (v) => {
    store.data_.email = v;
};
window.setDataTelephone = (v) => {
    store.data_.telephone = v;
};
window.setDataAddress = (v) => {
    store.data_.address = v;
};
window.setDataNationality = (v) => {
    store.data_.nationality = v;
};
window.setDataDateOfBirth = (v) => {
    store.data_.dateOfBirth = v;
};

window.setSocialLinkName = (i, v) => {
    store.data_.socialLinks[i].name = v;
};
window.setSocialLinkUrl = (i, v) => {
    store.data_.socialLinks[i].url = v;
};
window.removeSocialLink = (i) => {
    store.data_.socialLinks = store.data_.socialLinks.filter((_, index) => index !== i);
    render();
};
window.addSocialLink = () => {
    store.data_.socialLinks = [...store.data_.socialLinks, { name: "", url: "" }];
    render();
};
window.removePhoto = () => {
    store.data_.photo = null;
    store.data_.photoPreview = null;
    render();
};

window.handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    store.data_.photo = file;
    const r = new FileReader();
    r.onload = (ev) => {
        store.data_.photoPreview = ev.target.result;
        render();
    };
    r.readAsDataURL(file);
};

window.setProf = (k, v) => {
    store.data_.profiles[store.activeLang_][k] = v;
};
window.setActiveLang = (lang) => {
    store.activeLang_ = lang;
    render();
};
window.toggleProfile = (key) => {
    store.profileExpanded_[key] = !store.profileExpanded_[key];
    render();
};
window.setReviewLang = (lang) => {
    store.reviewLang_ = lang;
    render();
};

window.setWorkField = (i, field, value) => {
    const we = store.data_.profiles[store.activeLang_].workExperience.map((x, j) =>
        j === i ? structuredClone(x) : x
    );
    we[i][field] = value;
    store.data_.profiles[store.activeLang_].workExperience = we;
};
window.setWorkDesc = (workIndex, itemIndex, value) => {
    store.data_.profiles[store.activeLang_].workExperience[workIndex].description[itemIndex] =
        value;
};
window.addWorkDesc = (workIndex) => {
    store.data_.profiles[store.activeLang_].workExperience[workIndex].description.push("");
    render();
};
window.removeWorkDesc = (workIndex, itemIndex) => {
    store.data_.profiles[store.activeLang_].workExperience[workIndex].description.splice(
        itemIndex,
        1
    );
    render();
};
window.removeWork = () => {
    const we = store.data_.profiles[store.activeLang_].workExperience;
    we.pop();
    render();
};
window.addWork = () => {
    store.data_.profiles[store.activeLang_].workExperience.push(structuredClone(EMPTY_WORK));
    render();
};

window.setEduField = (i, field, value) => {
    const ed = store.data_.profiles[store.activeLang_].education.map((x, j) =>
        j === i ? structuredClone(x) : x
    );
    ed[i][field] = value;
    store.data_.profiles[store.activeLang_].education = ed;
};
window.removeEdu = () => {
    const ed = store.data_.profiles[store.activeLang_].education;
    ed.pop();
    render();
};
window.addEdu = () => {
    store.data_.profiles[store.activeLang_].education.push(structuredClone(EMPTY_EDU));
    render();
};

window.setLangSkill = (i, value) => {
    store.data_.profiles[store.activeLang_].languageSkills[i].language = value;
};
window.addLangSkill = () => {
    store.data_.profiles[store.activeLang_].languageSkills.push({ language: "" });
    render();
};
window.removeLangSkill = (i) => {
    store.data_.profiles[store.activeLang_].languageSkills.splice(i, 1);
    render();
};

window.setDigitalSkillCat = (i, value) => {
    store.data_.profiles[store.activeLang_].digitalSkills[i].category = value;
};
window.setDigitalSkillItem = (categoryIndex, itemIndex, value) => {
    store.data_.profiles[store.activeLang_].digitalSkills[categoryIndex].items[itemIndex] = value;
};
window.addDigitalSkillItem = (categoryIndex) => {
    store.data_.profiles[store.activeLang_].digitalSkills[categoryIndex].items.push("");
    render();
};
window.removeDigitalSkillItem = (categoryIndex, itemIndex) => {
    store.data_.profiles[store.activeLang_].digitalSkills[categoryIndex].items.splice(itemIndex, 1);
    render();
};
window.removeDigitalSkill = (i) => {
    store.data_.profiles[store.activeLang_].digitalSkills.splice(i, 1);
    render();
};
window.addDigitalSkill = () => {
    store.data_.profiles[store.activeLang_].digitalSkills.push({ category: "", items: [""] });
    render();
};

window.goToStep = (step) => {
    store.step_ = step;
    render();
};

window.checkLangDoneAndNext = () => {
    const prof = store.data_.profiles[store.activeLang_];
    if (
        prof.title ||
        prof.shortDescription ||
        prof.workExperience.length ||
        prof.education.length ||
        prof.languageSkills.length ||
        prof.digitalSkills.length ||
        prof.communicationSkills.length ||
        prof.organisationalSkills.length ||
        prof.jobRelatedSkills.length ||
        prof.additionalInfo
    ) {
        if (!store.langsDone_.includes(store.activeLang_)) {
            store.langsDone_ = [...store.langsDone_, store.activeLang_];
        }
    }
    store.step_ = 2;
    store.reviewLang_ = store.activeLang_;
    render();
};

window.switchDownloadLang = (lang) => {
    store.reviewLang_ = lang;
    render();
};

window.downloadPDF = async (lang, evento) => {
    const btn = evento.currentTarget;
    btn.disabled = true;
    const original = [...btn.childNodes];
    btn.replaceChildren(icono("hourglass_top", "w-5 h-5"), " Generando PDF...");

    try {
        const doc = generateCV(store.data_, lang, store.data_.photoPreview);
        doc.save("curriculum-" + lang + ".pdf");
    } catch {
        alert("Error al generar el PDF. Por favor, inténtalo de nuevo.");
    }

    btn.disabled = false;
    btn.replaceChildren(...original);
};

function init() {
    PROFILE_SECTIONS.forEach((s) => {
        store.profileExpanded_[s.key] = false;
    });
    initParticles();
    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
