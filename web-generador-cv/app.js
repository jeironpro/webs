const { jsPDF } = window.jspdf;
import { theme } from './shared/theme.js';
import { labels } from './shared/i18n.js';
import { LANG_CODES, LANG_MAP } from './shared/constants.js';

const cn = (...c) => c.filter(Boolean).join(' ');

const EMPTY_WORK = { dates: '', occupation: '', employer: '', location: '', description: [''] };
const EMPTY_EDU = { dates: '', qualification: '', institution: '' };
const EMPTY_PROFILE = {
    title: '', shortDescription: '',
    workExperience: [], education: [],
    languageSkills: [], digitalSkills: [],
    communicationSkills: [], organisationalSkills: [],
    jobRelatedSkills: [], additionalInfo: '',
};

const STEPS = [
    { id: 0, label: 'Datos', icon: 'person' },
    { id: 1, label: 'Perfiles', icon: 'description' },
    { id: 2, label: 'Revisar', icon: 'visibility' },
    { id: 3, label: 'Descarga', icon: 'download' },
];

const PROFILE_SECTIONS = [
    { key: 'intro', icon: 'track_changes', label: 'Introducción', color: 'from-violet-500 to-purple-600' },
    { key: 'work', icon: 'work', label: 'Experiencia', color: 'from-blue-500 to-cyan-600' },
    { key: 'edu', icon: 'school', label: 'Educación', color: 'from-emerald-500 to-teal-600' },
    { key: 'lang', icon: 'language', label: 'Idiomas', color: 'from-amber-500 to-orange-600' },
    { key: 'skills', icon: 'bolt', label: 'Skills', color: 'from-pink-500 to-rose-600' },
    { key: 'comm', icon: 'chat', label: 'Comunicación', color: 'from-sky-500 to-indigo-600' },
    { key: 'org', icon: 'assignment', label: 'Organización', color: 'from-lime-500 to-green-600' },
    { key: 'tech', icon: 'build', label: 'Técnicas', color: 'from-slate-500 to-slate-700' },
    { key: 'extra', icon: 'attach_file', label: 'Extra', color: 'from-fuchsia-500 to-pink-600' },
];

const store = {
    step_: 0,
    data_: {
        name: '', email: '', telephone: '', address: '', nationality: '', dateOfBirth: '',
        photo: null, photoPreview: null, socialLinks: [],
        profiles: {
            es: structuredClone(EMPTY_PROFILE),
            ca: structuredClone(EMPTY_PROFILE),
            en: structuredClone(EMPTY_PROFILE),
        },
    },
    activeLang_: 'es',
    langsDone_: [],
    profileExpanded_: {},
    reviewLang_: 'es',
};

const root = {
    indicator: document.getElementById('step-indicator'),
    content: document.getElementById('step-content'),
};

const icon = (name, cls = '') => `<span class="material-symbols-outlined ${cls}">${name}</span>`;

function hexToRgb(h) { return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]; }
const setFill  = (d, c) => { const [r,g,b] = hexToRgb(c); d.setFillColor(r,g,b); };
const setDraw  = (d, c) => { const [r,g,b] = hexToRgb(c); d.setDrawColor(r,g,b); };
const setText  = (d, c) => { const [r,g,b] = hexToRgb(c); d.setTextColor(r,g,b); };

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
    doc.rect(0, 0, theme.leftPanel.width, theme.page.height, 'F');
}
function renderSectionHeading(doc, text, x, y, w) {
    doc.setFont('helvetica', 'bold');
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
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
            setText(doc, theme.rightPanel.muted);
            doc.text(e.dates, x, y); y += 10;
        }
        const title = e.occupation || e.qualification || '';
        if (title) {
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
            setText(doc, theme.rightPanel.heading);
            const lines = doc.splitTextToSize(title, w);
            doc.text(lines, x, y); y += lines.length * 12;
        }
        const meta = [e.employer || e.institution, e.location].filter(Boolean).join('  |  ');
        if (meta) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
            setText(doc, theme.rightPanel.muted);
            doc.text(meta, x, y); y += 10;
        }
        if (e.description && e.description.length) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
            setText(doc, theme.rightPanel.text);
            for (const line of e.description) {
                if (line) {
                    y = checkPage(doc, y, 12);
                    const lines = doc.splitTextToSize('•  ' + line, w);
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
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    setText(doc, theme.rightPanel.text);
    for (const item of items) {
        if (item) {
            y = checkPage(doc, y, 12);
            const lines = doc.splitTextToSize('•  ' + item, w);
            doc.text(lines, x, y);
            y += lines.length * 10 + 3;
        }
    }
    return y;
}
function renderLeftPanel(doc, data, profile, t, photoUrl) {
    const pw = theme.leftPanel.width, pad = 22;
    const x = pad, w = pw - pad * 2;
    let y = 30;
    drawLeftBg(doc);
    const photoR = 35, photoCX = x + w / 2;
    if (photoUrl) {
        doc.addImage(photoUrl, 'JPEG', photoCX - photoR, y, photoR * 2, photoR * 2, undefined, 'FAST');
    }
    doc.setLineWidth(1.5);
    setDraw(doc, theme.leftPanel.muted);
    doc.circle(photoCX, y + photoR, photoR, 'S');
    y += photoR * 2 + 10;
    if (profile.shortDescription) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
        setText(doc, theme.leftPanel.text);
        const lines = doc.splitTextToSize(profile.shortDescription, w);
        doc.text(lines, x, y); y += lines.length * 10 + 6;
    }
    setDraw(doc, theme.leftPanel.muted); doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y); y += 8;
    const info = [data.email, data.address, data.telephone, data.dateOfBirth, data.nationality];
    for (const v of info) {
        if (v) {
            doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
            setText(doc, theme.leftPanel.text);
            doc.text(v, x + 12, y); y += 10;
        }
    }
    if (data.socialLinks && data.socialLinks.length) {
        for (const s of data.socialLinks) {
            if (s.url) {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
                setText(doc, theme.leftPanel.text);
                const lines = doc.splitTextToSize(s.url, w - 12);
                doc.text(lines, x + 12, y); y += lines.length * 8 + 4;
            }
        }
    }
    y += 5;
    setDraw(doc, theme.leftPanel.muted); doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y); y += 10;
    if (profile.digitalSkills && profile.digitalSkills.length) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
        setText(doc, theme.leftPanel.accent);
        doc.text(t.skillsShort.toUpperCase(), x, y); y += 10;
        for (const cat of profile.digitalSkills) {
            if (cat.category) {
                doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5);
                setText(doc, theme.leftPanel.accent);
                doc.text(cat.category, x, y); y += 8;
            }
            if (cat.items && cat.items.length) {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(7);
                setText(doc, theme.leftPanel.text);
                for (const skill of cat.items) {
                    if (skill) {
                        const lines = doc.splitTextToSize('• ' + skill, w - 4);
                        doc.text(lines, x + 4, y);
                        y += lines.length * 8 + 3;
                    }
                }
            }
            y += 2;
        }
    }
    y += 2;
    setDraw(doc, theme.leftPanel.muted); doc.setLineWidth(0.5);
    doc.line(x, y, x + w, y); y += 10;
    if (profile.languageSkills && profile.languageSkills.length) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5);
        setText(doc, theme.leftPanel.accent);
        doc.text(t.languagesShort.toUpperCase(), x, y); y += 10;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
        setText(doc, theme.leftPanel.text);
        for (const l of profile.languageSkills) {
            const label = l.writing ? l.language + '  ' + l.writing : l.language;
            doc.text('• ' + label, x, y); y += 12;
        }
    }
}
export function generateCV(data, lang, photoUrl) {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: theme.page.size.toLowerCase() });
    const t = labels[lang] || labels.es;
    const profile = (data.profiles && (data.profiles[lang] || data.profiles.es)) || {};

    renderLeftPanel(doc, data, profile, t, photoUrl);

    const rightX = theme.leftPanel.width + 18;
    const pw = theme.page.width - rightX - theme.page.margin;
    let y = 40;

    if (profile.title) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
        setText(doc, theme.rightPanel.muted);
        doc.text(profile.title, rightX, y); y += 15;
    }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
    setText(doc, theme.rightPanel.heading);
    const nameLines = doc.splitTextToSize(data.name, pw);
    doc.text(nameLines, rightX, y);
    y += nameLines.length * 24 + 8;

    setDraw(doc, theme.rightPanel.border); doc.setLineWidth(0.5);
    doc.line(rightX, y, rightX + pw, y); y += 10;

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
        y = renderBulletList(doc, profile.communicationSkills, rightX, y, pw); y += 6;
    }
    if (profile.organisationalSkills && profile.organisationalSkills.length) {
        y = checkPage(doc, y, 50);
        y = renderSectionHeading(doc, t.organisationalSkills, rightX, y, pw);
        y = renderBulletList(doc, profile.organisationalSkills, rightX, y, pw); y += 6;
    }
    if (profile.jobRelatedSkills && profile.jobRelatedSkills.length) {
        y = checkPage(doc, y, 50);
        y = renderSectionHeading(doc, t.jobRelatedSkills, rightX, y, pw);
        y = renderBulletList(doc, profile.jobRelatedSkills, rightX, y, pw); y += 6;
    }
    if (profile.additionalInfo) {
        y = checkPage(doc, y, 30);
        y = renderSectionHeading(doc, t.additionalInfo, rightX, y, pw);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
        setText(doc, theme.rightPanel.text);
        doc.text(doc.splitTextToSize(profile.additionalInfo, pw), rightX, y);
    }
    return doc;
}

function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [], raf;

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
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(43, 108, 176, ${p.a})`;
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
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
    window.addEventListener('resize', resize);
    draw();

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
    };
}

function input(label, value, handler, type = 'text', placeholder = '', colSpan = 1) {
    const span = colSpan === 2 ? ' md:col-span-2' : '';
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="${span}">
            <label class="block">
                <span class="label-base">${label}</span>
                <input type="${type}" value="${value}" placeholder="${placeholder}" class="input-base" oninput="${handler}(this.value)">
            </label>
        </div>
    </div>`;
}

function arrayField(label, values, addHandler, removeHandler, placeholder) {
    let html = `<div class="array-field"><span class="label-base">${label}</span>`;
    values.forEach((v, i) => {
        html += `<div class="array-item" style="animation-delay:${i * 0.03}s">
            <input value="${v}" placeholder="${placeholder}" class="input-base flex-1" oninput="${addHandler}('${i}', this.value)">
            <button type="button" class="remove-btn" onclick="${removeHandler}(${i})">×</button>
        </div>`;
    });
    html += `<button type="button" class="array-add-btn" onclick="${addHandler}('new')">
        <span class="plus-icon">+</span> Añadir
    </button></div>`;
    return html;
}

function entryCard(title, color, children, onDelete) {
    return `<div class="entry-card">
        <div class="entry-card-title">
            <div class="entry-card-color-bar" style="background:linear-gradient(135deg, var(--${color.split(' ')[0].replace('from-','')}), var(--${color.split(' ')[1]}))"></div>
            <span class="entry-card-title-text">${title}</span>
        </div>
        ${children}
        ${onDelete ? `<button type="button" class="entry-card-delete" onclick="${onDelete}">×</button>` : ''}
    </div>`;
}

function sectionCard(sec, idx) {
    const open = store.profileExpanded_[sec.key];
    const content = renderSectionContent(sec, store.data_.profiles[store.activeLang_] || EMPTY_PROFILE, idx);
    return `<div class="glass-card overflow-hidden transition-all duration-300 ${open ? ' shadow-xl' : ''}">
        <button type="button" class="section-card-btn ${open ? 'open' : ''}" onclick="toggleProfile('${sec.key}')">
            <div class="flex items-center gap-3.5">
                <div class="section-card-icon ${open ? ' scale-110' : ''}" style="background:linear-gradient(135deg, var(--${sec.color.split(' ')[0].replace('from-','')}), var(--${sec.color.split(' ')[1]}))">
                    ${icon(sec.icon, 'text-white text-sm')}
                </div>
                <span class="section-card-title">${sec.label}${open && idx !== undefined ? '<span class="section-card-badge">Paso ' + (idx + 1) + '</span>' : ''}</span>
            </div>
            <div class="section-card-arrow ${open ? 'section-card-arrow-rotate' : ''}">
                ${icon('expand_more', 'w-4 h-4')}
            </div>
        </button>
        ${open ? '<div class="px-6 pb-6 space-y-5 animate-slide-down">' + content + '</div>' : ''}
    </div>`;
}

function renderSectionContent(sec, prof, idx) {
    switch (sec.key) {
        case 'intro':
            return cn(
                input('Título profesional', prof.title, 'setProf', 'text', 'Ej: Desarrollador Full Stack'),
                `<div class="mt-4"><label class="block"><span class="label-base">Descripción corta</span>
                    <textarea rows="3" class="input-base resize-none" oninput="setProf('shortDescription', this.value)" placeholder="Descripción breve...">${prof.shortDescription}</textarea>
                </label></div>`
            );

        case 'work': {
            let html = '';
            if (!prof.workExperience.length) html += '<p class="text-sm text-slate-400 italic">Sin experiencia laboral añadida.</p>';
            prof.workExperience.forEach((w, i) => {
                html += entryCard(`Experiencia ${i + 1}`, sec.color,
                    cn(
                        input('Fechas', w.dates, 'setWorkField', 'text', 'ene 2024 - actualidad'),
                        input('Ocupación', w.occupation, 'setWorkField', 'text', 'Desarrollador Full Stack'),
                        input('Empleador', w.employer, 'setWorkField', 'text', 'Empresa S.L.'),
                        input('Ubicación', w.location, 'setWorkField', 'text', 'Barcelona, España'),
                        arrayField('Tareas', w.description, 'addWorkDesc', 'removeWork', 'Ej: Desarrollo de APIs REST')
                    ),
                    'removeWork'
                );
            });
            html += `<button type="button" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors mt-4" onclick="addWork()">
                <span class="w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold">+</span>
                Añadir experiencia
            </button>`;
            return html;
        }

        case 'edu': {
            let html = '';
            if (!prof.education.length) html += '<p class="text-sm text-slate-400 italic">Sin formación añadida.</p>';
            prof.education.forEach((e, i) => {
                html += entryCard(`Formación ${i + 1}`, sec.color,
                    cn(
                        input('Fechas', e.dates, 'setEduField', 'text', '2020 - 2024'),
                        input('Titulación', e.qualification, 'setEduField', 'text', 'Grado en Ingeniería'),
                        input('Institución', e.institution, 'setEduField', 'text', 'Universidad de Barcelona', 2)
                    ),
                    'removeEdu'
                );
            });
            html += `<button type="button" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors mt-4" onclick="addEdu()">
                <span class="w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold">+</span>
                Añadir formación
            </button>`;
            return html;
        }

        case 'lang':
            return arrayField('Idiomas', prof.languageSkills.map(l => l.language), 'addLangSkill', 'removeLangSkill', 'Ej: Inglés C1 Avanzado');

        case 'skills': {
            let html = '';
            if (!prof.digitalSkills.length) html += '<p class="text-sm text-slate-400 italic">Sin categorías añadidas.</p>';
            prof.digitalSkills.forEach((cat, i) => {
                html += entryCard(`Categoría ${i + 1}`, sec.color,
                    cn(
                        input('Categoría', cat.category, 'setDigitalSkillCat', 'text', 'Ej: Backend, Frontend...'),
                        arrayField('Tecnologías', cat.items, 'addDigitalSkillItems', 'removeDigitalSkillItems', 'Ej: React, Node.js...')
                    ),
                    'removeDigitalSkill'
                );
            });
            html += `<button type="button" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors mt-4" onclick="addDigitalSkill()">
                <span class="w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold">+</span>
                Añadir categoría
            </button>`;
            return html;
        }

        default:
            return '<p class="text-sm text-slate-400 italic">Esta sección está disponible pero no requiere entrada en este paso.</p>';
    }
}

function navButtons(step, onPrev, onNext) {
    const prevDisabled = step === 0;
    return `<div class="nav-buttons">
        <button type="button" class="nav-btn prev" ${prevDisabled ? 'disabled' : ''} onclick="${onPrev}">
            ${icon('arrow_back', 'w-4 h-4')} Atrás
        </button>
        <button type="button" class="nav-btn next" onclick="${onNext}">
            Continuar ${icon('arrow_forward', 'w-4 h-4')}
        </button>
    </div>`;
}

function renderStep0() {
    const d = store.data_;
    let social = '';
    if (!d.socialLinks.length) {
        social = '<p class="social-empty">Aún no has añadido ninguna red social.</p>';
    } else {
        d.socialLinks.forEach((s, i) => {
            social += entryCard(null, null,
                cn(
                    input('Red', s.name, 'setSocialLinkName', 'text', 'LinkedIn, GitHub...'),
                    input('URL', s.url, 'setSocialLinkUrl', 'text', 'linkedin.com/in/usuario')
                ),
                'removeSocialLink'
            );
        });
    }

    return cn(
        `<div class="space-y-5 animate-fade-up">
            <div class="flex items-center gap-3 mb-1">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    ${icon('person', 'text-white text-lg')}
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Información personal</h2>
                    <p class="text-xs text-slate-500">Tus datos de contacto y redes sociales</p>
                </div>
            </div>
            <div class="glass-card p-6 space-y-5">
                ${input('Nombre completo', d.name, 'setDataName', 'text', 'Ej: María García López', 2)}
                ${input('Correo electrónico', d.email, 'setDataEmail', 'email', 'maria@ejemplo.com')}
                ${input('Teléfono', d.telephone, 'setDataTelephone', 'text', '+34 600 000 000')}
                ${input('Dirección', d.address, 'setDataAddress', 'text', '08001, Barcelona, España')}
                ${input('Nacionalidad', d.nationality, 'setDataNationality', 'text', 'Española')}
                ${input('Fecha de nacimiento', d.dateOfBirth, 'setDataDateOfBirth', 'date')}
            </div>
            <div class="glass-card p-6">
                <div class="flex items-center gap-6 flex-wrap">
                    <div class="shrink-0">
                        ${d.photoPreview
                            ? `<div class="photo-preview"><img src="${d.photoPreview}" alt="">
                                <button type="button" class="remove-photo" onclick="removePhoto()">×</button></div>`
                            : `<div class="photo-placeholder">${icon('person', 'w-10 h-10')}</div>`}
                    </div>
                    <div class="flex-1 min-w-0">
                        <label class="photo-upload-label">
                            ${icon('upload', 'w-4 h-4')} Subir foto
                            <input type="file" accept="image/*" onchange="handlePhotoUpload(event)">
                        </label>
                        <p class="photo-hint">PNG, JPG o WebP — se mostrará como recorte circular en el CV</p>
                    </div>
                </div>
            </div>
            <div class="glass-card p-6 space-y-4">
                <div class="social-section-title">
                    ${icon('link', 'w-5 h-5 text-slate-400')}<span class="tracking-wider uppercase text-xs font-semibold text-slate-500">Redes sociales</span>
                </div>
                ${social}
                <button type="button" class="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-700 transition-colors" onclick="addSocialLink()">
                    <span class="w-5 h-5 rounded-full border-2 border-navy-400 flex items-center justify-center text-xs font-bold">+</span>
                    Añadir red social
                </button>
            </div>
            ${navButtons(0, '', 'goToStep(1)')}
        </div>`
    );
}

function renderStep1() {
    const d = store.data_;
    const langPills = d.langsDone_.length
        ? d.langsDone_.map(code =>
            `<button type="button" class="lang-pill ${code === d.activeLang_ ? 'active' : ''}" onclick="setActiveLang('${code}')">${LANG_MAP[code]}</button>`
        ).join('')
        : '';

    return cn(
        `<div class="space-y-5 animate-fade-up">
            <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                        ${icon('description', 'text-white text-lg')}
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">Contenido del CV</h2>
                        <p class="text-xs text-slate-500">Editando: ${LANG_MAP[d.activeLang_]}</p>
                    </div>
                </div>
                ${langPills ? `<div class="lang-pills">${langPills}</div>` : ''}
            </div>
            <div class="space-y-4">
                ${PROFILE_SECTIONS.map((s, i) => sectionCard(s, i)).join('')}
            </div>
            ${navButtons(1, 'goToStep(0)', 'checkLangDoneAndNext()')}
        </div>`
    );
}

function renderStep2() {
    const d = store.data_;
    const lang = store.reviewLang_;
    const prof = d.profiles[lang] || {};

    const hasData = (l) => {
        const p = d.profiles[l];
        return p && (p.title || p.shortDescription || p.workExperience.length || p.education.length ||
            p.languageSkills.length || p.digitalSkills.length || p.communicationSkills.length ||
            p.organisationalSkills.length || p.jobRelatedSkills.length || p.additionalInfo);
    };

    const available = LANG_CODES.filter(hasData);
    const currentLang = available.includes(lang) ? lang : (available[0] || 'es');
    const currentProf = d.profiles[currentLang] || {};

    const langTabs = available.length > 1
        ? `<div class="inline-flex gap-1 bg-slate-100/80 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/60 shadow-sm">
            ${available.map(code => `<button type="button" class="lang-tab ${code === currentLang ? 'active' : ''}" onclick="setReviewLang('${code}')">${LANG_MAP[code]}</button>`).join('')}
          </div>`
        : '';

    const field = (label, value) => (!value) ? '' : `<div class="info-field"><span class="info-field-label">${label}</span><span class="info-field-value">${value}</span></div>`;
    const listBlock = (items) => (!items || !items.length) ? '' : `<ul class="info-list">${items.filter(i => i).map(i => `<li class="info-list-item">${i}</li>`).join('')}</ul>`;

    const socialHtml = d.socialLinks.filter(s => s.name || s.url).map(s =>
        `<div class="info-list-item">${(s.name ? `<span class="font-semibold">${s.name}: </span>` : '')}${(s.url ? `<span class="text-slate-500">${s.url}</span>` : '')}</div>`
    ).join('');

    const workHtml = currentProf.workExperience.map((w, i) =>
        `<div class="${i < currentProf.workExperience.length - 1 ? 'border-b border-slate-200 mb-4 pb-4' : ''}">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="font-semibold text-sm text-slate-800">${w.occupation || '—'}</p>
                    <p class="text-xs text-slate-500">${w.employer}${w.employer && w.location ? ' · ' : ''}${w.location}</p>
                </div>
            </div>
            ${listBlock(w.description)}
        </div>`
    ).join('');

    const eduHtml = currentProf.education.map((e, i) =>
        `<div class="${i < currentProf.education.length - 1 ? 'border-b border-slate-200 mb-4 pb-4' : ''}">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="font-semibold text-sm text-slate-800">${e.qualification || '—'}</p>
                    <p class="text-xs text-slate-500">${e.institution}${e.institution && e.dates ? ' · ' : ''}${e.dates}</p>
                </div>
            </div>
        </div>`
    ).join('');

    const infoCard = (title, inner, onEdit) =>
        `<div class="info-card">
            <div class="info-card-header">
                <h3 class="info-card-title">${title}</h3>
                ${onEdit ? `<button type="button" class="info-card-edit" onclick="${onEdit}">Editar</button>` : ''}
            </div>
            ${inner}
        </div>`;

    return cn(
        `<div class="space-y-5 animate-fade-up">
            <div class="step-title-area">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                        ${icon('visibility', 'text-white text-lg')}
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">Revisa tu CV</h2>
                        <p class="text-xs text-slate-500">Verifica que todos los datos sean correctos antes de descargar</p>
                    </div>
                </div>
                ${langTabs}
            </div>
            ${infoCard('Información personal',
                `<div class="info-card-grid">
                    ${field('Nombre', d.name)}
                    ${field('Correo', d.email)}
                    ${field('Teléfono', d.telephone)}
                    ${field('Dirección', d.address)}
                    ${field('Nacionalidad', d.nationality)}
                    ${field('Fecha de nacimiento', d.dateOfBirth)}
                </div>
                ${d.photoPreview ? `<div class="mt-4"><span class="info-field-label">Foto</span><div class="mt-1 w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white shadow-md"><img src="${d.photoPreview}" alt="" class="w-full h-full object-cover"></div></div>` : ''}`,
                'goToStep(0)'
            )}
            ${d.socialLinks.length && d.socialLinks.some(s => s.name || s.url)
                ? infoCard('Redes sociales', `<div class="space-y-2">${socialHtml}</div>`, 'goToStep(0)')
                : ''}
            ${currentProf.title || currentProf.shortDescription
                ? infoCard(`Introducción — ${LANG_MAP[currentLang]}`, cn(field('Título profesional', currentProf.title), field('Descripción corta', currentProf.shortDescription)), 'goToStep(1)')
                : ''}
            ${currentProf.workExperience.length
                ? infoCard(`Experiencia laboral — ${LANG_MAP[currentLang]}`, workHtml, 'goToStep(1)')
                : ''}
            ${currentProf.education.length
                ? infoCard(`Educación y formación — ${LANG_MAP[currentLang]}`, eduHtml, 'goToStep(1)')
                : ''}
            ${navButtons(2, 'goToStep(1)', 'goToStep(3)')}
        </div>`
    );
}

function renderStep3() {
    const d = store.data_;
    const withData = LANG_CODES.filter(l => {
        const p = d.profiles[l];
        return p && (p.title || p.shortDescription || p.workExperience.length || p.education.length);
    });
    const currentLang = withData.includes(store.reviewLang_) ? store.reviewLang_ : (withData[0] || 'es');
    const prof = d.profiles[currentLang] || {};

    const langTabs = withData.length > 1
        ? `<div class="download-preview-lang">
            ${withData.map(code => `<button type="button" class="lang-tab ${code === currentLang ? 'active' : ''}" onclick="switchDownloadLang('${code}')">${LANG_MAP[code]}</button>`).join('')}
          </div>`
        : '';

    const previewContent = (prof.title || prof.shortDescription || prof.workExperience.length || prof.education.length)
        ? `<div class="text-center text-slate-500">
            ${icon('picture_as_pdf', 'w-12 h-12 mx-auto mb-2 text-slate-300')}
            <p class="text-sm">PDF generado con ${d.name || 'tu nombre'}</p>
          </div>`
        : `<div class="text-center text-slate-400">
            <p class="text-sm mb-2">Completa los pasos anteriores para ver una vista previa</p>
            <button type="button" class="btn-secondary mt-4" onclick="goToStep(0)">Ir al paso 1</button>
          </div>`;

    return cn(
        `<div class="space-y-5 animate-fade-up">
            <div class="step-title-area">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                        ${icon('download', 'text-white text-lg')}
                    </div>
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">Descargar CV</h2>
                        <p class="text-xs text-slate-500">Genera tu currículum en PDF con el diseño profesional de dos columnas</p>
                    </div>
                </div>
            </div>
            <div class="download-section">
                <div class="download-preview">
                    <div class="download-preview-header">
                        <span class="download-preview-title">Vista previa del PDF</span>
                        ${langTabs}
                    </div>
                    <div class="pdf-preview-box">${previewContent}</div>
                </div>
                <div class="flex gap-3 justify-center flex-wrap">
                    <button type="button" class="btn-primary" onclick="downloadPDF('${currentLang}')">
                        ${icon('download', 'w-5 h-5')} Descargar CV en PDF (${LANG_MAP[currentLang]})
                    </button>
                    <button type="button" class="btn-secondary" onclick="goToStep(2)">
                        ${icon('edit', 'w-4 h-4')} Volver a revisar
                    </button>
                </div>
                <p class="text-xs text-slate-400 text-center mt-4">
                    El PDF se generará en el navegador usando jsPDF. No se envían datos a ningún servidor.
                </p>
            </div>
        </div>`
    );
}

function render() {
    switch (store.step_) {
        case 0: root.content.innerHTML = renderStep0(); break;
        case 1: root.content.innerHTML = renderStep1(); break;
        case 2: root.content.innerHTML = renderStep2(); break;
        case 3: root.content.innerHTML = renderStep3(); break;
    }
    renderIndicator();
}

function renderIndicator() {
    let html = '';
    STEPS.forEach((s, i) => {
        const active = i === store.step_;
        const done = i < store.step_;
        const bg = done ? 'var(--emerald-100)' : active ? 'linear-gradient(135deg, var(--navy-500), var(--navy-700))' : 'var(--slate-100)';
        const col = done ? 'var(--emerald-600)' : active ? 'white' : 'var(--slate-400)';
        const numCol = active ? 'var(--navy-700)' : done ? 'var(--emerald-600)' : 'var(--slate-400)';
        const labCol = active ? 'var(--slate-800)' : 'var(--slate-500)';
        html += `<button type="button" class="step-btn ${active ? 'active' : ''} ${done ? 'done' : ''}" onclick="goToStep(${i})">
            <div class="step-btn-icon" style="background:${bg}; color:${col}">${icon(done ? 'check' : s.icon)}</div>
            <div>
                <span class="step-btn-number" style="color:${numCol}">Paso ${i + 1}</span>
                <span class="step-btn-label" style="color:${labCol}">${s.label}</span>
            </div>
            ${done ? '<div class="ml-auto"><div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div></div>' : ''}
        </button>`;
    });
    html += `<div class="step-progress">
        <div class="step-progress-label">Progreso</div>
        <div class="step-progress-bar"><div class="step-progress-fill" style="width:${((store.step_ + 1) / STEPS.length) * 100}%"></div></div>
        <div class="step-progress-text">${store.step_ + 1} de ${STEPS.length}</div>
    </div>`;
    root.indicator.innerHTML = html;
}

window.setDataName = (v) => { store.data_.name = v; render(); };
window.setDataEmail = (v) => { store.data_.email = v; render(); };
window.setDataTelephone = (v) => { store.data_.telephone = v; render(); };
window.setDataAddress = (v) => { store.data_.address = v; render(); };
window.setDataNationality = (v) => { store.data_.nationality = v; render(); };
window.setDataDateOfBirth = (v) => { store.data_.dateOfBirth = v; render(); };

window.setSocialLinkName = (v) => { store.data_.socialLinks[0].name = v; render(); };
window.setSocialLinkUrl = (v) => { store.data_.socialLinks[0].url = v; render(); };
window.removeSocialLink = () => {
    store.data_.socialLinks = store.data_.socialLinks.slice(1);
    render();
};
window.addSocialLink = () => {
    store.data_.socialLinks = [...store.data_.socialLinks, { name: '', url: '' }];
    render();
};
window.removePhoto = () => { store.data_.photo = null; store.data_.photoPreview = null; render(); };

window.handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    store.data_.photo = file;
    const r = new FileReader();
    r.onload = (ev) => { store.data_.photoPreview = ev.target.result; render(); };
    r.readAsDataURL(file);
};

window.setProf = (k, v) => { store.data_.profiles[store.activeLang_][k] = v; render(); };
window.setActiveLang = (lang) => { store.activeLang_ = lang; render(); };
window.toggleProfile = (key) => { store.profileExpanded_[key] = !store.profileExpanded_[key]; render(); };
window.setReviewLang = (lang) => { store.reviewLang_ = lang; render(); };

window.setWorkField = (i, field, value) => {
    const we = store.data_.profiles[store.activeLang_].workExperience.map((x, j) => j === i ? structuredClone(x) : x);
    we[i][field] = value;
    store.data_.profiles[store.activeLang_].workExperience = we;
    render();
};
window.addWorkDesc = (i, value) => {
    if (i === 'new') {
        store.data_.profiles[store.activeLang_].workExperience.push(structuredClone(EMPTY_WORK));
    } else {
        const we = store.data_.profiles[store.activeLang_].workExperience;
        we[i].description = value;
    }
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
    const ed = store.data_.profiles[store.activeLang_].education.map((x, j) => j === i ? structuredClone(x) : x);
    ed[i][field] = value;
    store.data_.profiles[store.activeLang_].education = ed;
    render();
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

window.addLangSkill = (v) => {
    if (v === 'new') {
        store.data_.profiles[store.activeLang_].languageSkills.push({ language: '' });
    } else {
        const cur = store.data_.profiles[store.activeLang_].languageSkills.map(l => l.language);
        store.data_.profiles[store.activeLang_].languageSkills = cur.map(l => ({ language: l }));
    }
    render();
};
window.removeLangSkill = () => {
    const cur = store.data_.profiles[store.activeLang_].languageSkills;
    cur.pop();
    store.data_.profiles[store.activeLang_].languageSkills = cur.map(l => ({ language: l.language }));
    render();
};

window.setDigitalSkillCat = (i, value) => {
    const ds = store.data_.profiles[store.activeLang_].digitalSkills;
    ds[i].category = value;
    render();
};
window.addDigitalSkillItems = (i, value) => {
    if (i === 'new') {
        store.data_.profiles[store.activeLang_].digitalSkills.push({ category: '', items: [''] });
    } else {
        const ds = store.data_.profiles[store.activeLang_].digitalSkills;
        ds[i].items = value;
    }
    render();
};
window.removeDigitalSkillItems = () => {
    const ds = store.data_.profiles[store.activeLang_].digitalSkills;
    ds.pop();
    render();
};
window.removeDigitalSkill = () => {
    const ds = store.data_.profiles[store.activeLang_].digitalSkills;
    ds.pop();
    render();
};
window.addDigitalSkill = () => {
    store.data_.profiles[store.activeLang_].digitalSkills.push({ category: '', items: [''] });
    render();
};

window.goToStep = (step) => { store.step_ = step; render(); };

window.checkLangDoneAndNext = () => {
    const prof = store.data_.profiles[store.activeLang_];
    if (prof.title || prof.shortDescription || prof.workExperience.length || prof.education.length ||
        prof.languageSkills.length || prof.digitalSkills.length || prof.communicationSkills.length ||
        prof.organisationalSkills.length || prof.jobRelatedSkills.length || prof.additionalInfo) {
        if (!store.langsDone_.includes(store.activeLang_)) {
            store.langsDone_ = [...store.langsDone_, store.activeLang_];
        }
    }
    store.step_ = 2;
    store.reviewLang_ = store.activeLang_;
    render();
};

window.switchDownloadLang = (lang) => { store.reviewLang_ = lang; render(); };

window.downloadPDF = async (lang) => {
    const btn = event.currentTarget;
    btn.disabled = true;
    const orig = btn.innerHTML;
    btn.innerHTML = icon('hourglass_top', 'w-5 h-5') + ' Generando PDF...';

    try {
        const doc = generateCV(store.data_, lang, store.data_.photoPreview);
        doc.save('curriculum-' + lang + '.pdf');
    } catch (err) {
        console.error('Error generando PDF:', err);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }

    btn.disabled = false;
    btn.innerHTML = orig;
};

function init() {
    PROFILE_SECTIONS.forEach(s => { store.profileExpanded_[s.key] = true; });
    initParticles();
    render();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
