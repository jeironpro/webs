// Vanilla JS migration of programmer-day
// Three.js + GSAP — no React, no React Three Fiber

import * as THREE from 'three';

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initThreeScene();
  initCountdown();
  initEventListeners();
});

// ── i18n (mínimo sin contexto React) ──
const i18n = {
  lang: 'es',
  translations: {
    es: {
      nav: {
        home: 'inicio',
        why: 'por-que-256',
        byte: 'el-byte',
        langLabel: 'EN',
        langTitle: 'Cambiar a inglés',
        liveTag: 'EN VIVO',
        dayTag: 'DÍA 256',
        homeAria: 'Ir al inicio',
      },
      hero: {
        countEyebrow: 'cuenta atrás',
        celebratingTitle: 'Feliz Día del Programador',
        celebratingSub: 'Hoy el año llega a su byte 256. 2⁸ = 256. Un byte completo de tiempo.',
        countdownLabel: 'para el día 256',
        daysLabel: 'días',
        hoursLabel: 'horas',
        minutesLabel: 'min',
        secondsLabel: 'seg',
        cta: 'desliza para compilar',
        yearTag: 'año {year} · {today}/{total} días',
      },
      why: {
        eyebrow: 'por qué 256',
        title: 'Porque un byte se escribe una vez al año',
        p1: 'El 13 de septiembre es el día 256 de un año común: 2⁸, el número de valores que cabe en un byte. Un byte completo, de 00000000 a 11111111. Los bisiestos lo celebran un día antes, el 12 de septiembre.',
        p2: 'La propuesta partió de Valentin Balt en 2002, recogiendo firmas para que Rusia reconociera oficialmente el Día del Programador. Lo logró en 2009, y desde entonces la fecha se celebra en todo el mundo.',
        p3: '¿Por qué importa un número? Porque detrás de cada byte hay alguien que escribe, depura y compila. Hoy es su día.',
        factsTitle: '2⁸ en memoria',
        facts: [
          { bits: '00000000', value: '0' },
          { bits: '00010000', value: '16' },
          { bits: '10000000', value: '128' },
          { bits: '11111111', value: '255' },
        ],
        factsCaption: 'cuatro bytes, cuatro valores: así de simple y así de enorme',
      },
      byte: {
        eyebrow: 'el byte',
        title: 'Ocho bits, un día entero',
        hint: 'recorre los bits con el cursor para encenderlos',
        bitsLabel: 'byte de la sesión',
        bitOn: '1 — encendido',
        bitOff: '0 — apagado',
        cta: 'vuelve el 13 de septiembre',
      },
      footer: {
        statement: 'Compilado con cariño por un programador, para los programadores.',
        sub: 'Día del Programador · día 256 del año · 2⁸ = 256',
        langTitle: 'Cambiar idioma',
      },
      celebration: {
        title: '¡Feliz Día del Programador!',
        assemble: 'ensamblando el byte…',
        reveal: '256 — 2⁸',
        dismiss: 'ver la página',
      },
      sound: {
        mute: 'Silenciar fanfarria',
        unmute: 'Activar fanfarria',
        on: 'sonido',
        off: 'silencio',
      },
    },
    en: {
      nav: {
        home: 'home',
        why: 'why-256',
        byte: 'the-byte',
        langLabel: 'ES',
        langTitle: 'Switch to Spanish',
        liveTag: 'LIVE',
        dayTag: 'DAY 256',
        homeAria: 'Go to top',
      },
      hero: {
        countEyebrow: 'countdown',
        celebratingTitle: 'Happy Programmer\'s Day',
        celebratingSub: 'Today the year reaches its 256th byte. 2⁸ = 256. A full byte of time.',
        countdownLabel: 'until day 256',
        daysLabel: 'days',
        hoursLabel: 'hours',
        minutesLabel: 'min',
        secondsLabel: 'sec',
        cta: 'scroll to compile',
        yearTag: 'year {year} · {today}/{total} days',
      },
      why: {
        eyebrow: 'why 256',
        title: 'Because a byte is written once a year',
        p1: 'September 13th is the 256th day of a common year: 2⁸, the number of values a byte can hold. One full byte, from 00000000 to 11111111. Leap years celebrate one day earlier, on September 12th.',
        p2: 'The proposal came from Valentin Balt in 2002, gathering signatures for Russia to officially recognize Programmer\'s Day. It succeeded in 2009, and the date has been celebrated worldwide ever since.',
        p3: 'Why does a number matter? Because behind every byte there is someone writing, debugging and compiling. Today is their day.',
        factsTitle: '2⁸ from memory',
        facts: [
          { bits: '00000000', value: '0' },
          { bits: '00010000', value: '16' },
          { bits: '10000000', value: '128' },
          { bits: '11111111', value: '255' },
        ],
        factsCaption: 'four bytes, four values: that simple and that huge',
      },
      byte: {
        eyebrow: 'the byte',
        title: 'Eight bits, one whole day',
        hint: 'sweep the bits with your cursor to light them up',
        bitsLabel: 'session byte',
        bitOn: '1 — on',
        bitOff: '0 — off',
        cta: 'come back on September 13th',
      },
      footer: {
        statement: 'Compiled with care by a programmer, for programmers.',
        sub: 'Programmer\'s Day · day 256 of the year · 2⁸ = 256',
        langTitle: 'Switch language',
      },
      celebration: {
        title: 'Happy Programmer\'s Day!',
        assemble: 'assembling the byte…',
        reveal: '256 — 2⁸',
        dismiss: 'view the page',
      },
      sound: {
        mute: 'Mute fanfare',
        unmute: 'Unmute fanfare',
        on: 'sound',
        off: 'muted',
      },
    },
  },
  currentLang: 'es',
  t(key) {
    const dict = this.translations[this.currentLang];
    const parts = key.split('.');
    let val = dict;
    for (const p of parts) {
      if (val[p] === undefined) return key;
      val = val[p];
    }
    return typeof val === 'string' ? val : JSON.stringify(val);
  },
  setLang(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem('programmer-day.lang', lang); } catch {}
    // Re-run init if needed
    if (window.programmerDay && window.programmerDay.updateLang) {
      window.programmerDay.updateLang(lang);
    }
  },
};

// ── i18n: aplica el idioma guardado o el del navegador ──
function initI18n() {
  let stored = null;
  try {
    stored = localStorage.getItem('programmer-day.lang');
  } catch {
    stored = null;
  }
  const browser = (navigator.language || 'es').toLowerCase();
  const lang = stored || (browser.startsWith('en') ? 'en' : 'es');
  i18n.setLang(lang);
}

// ── Lógica del día 256 (portada de day256.ts) ──
const DAY_NUMBER = 256;
const MS_PER_DAY = 86_400_000;

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function dayOfYear(date) {
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const start = Date.UTC(date.getFullYear(), 0, 1, 12);
  const current = Date.UTC(noon.getFullYear(), noon.getMonth(), noon.getDate(), 12);
  return Math.floor((current - start) / MS_PER_DAY) + 1;
}

function day256StartOfYear(year) {
  return new Date(year, 0, DAY_NUMBER);
}

function isDay256(date) {
  return dayOfYear(date) === DAY_NUMBER;
}

function nextDay256Start(now) {
  const thisYear = day256StartOfYear(now.getFullYear());
  const notYetPassed = now.getTime() < thisYear.getTime() + MS_PER_DAY;
  if (notYetPassed) return thisYear;
  return day256StartOfYear(now.getFullYear() + 1);
}

function getDayState(now) {
  const year = now.getFullYear();
  const today = dayOfYear(now);
  const celebrating = today === DAY_NUMBER;
  return {
    celebrating,
    today,
    total: daysInYear(year),
    year,
    target: celebrating ? day256StartOfYear(year) : nextDay256Start(now),
  };
}

// ── Three.js Scene (reemplaza a React Three Fiber + ByteScene) ──
let threeScene = null;
let camera = null;
let renderer = null;
const PHOSPHOR = '#55ff88';

function initThreeScene() {
  const canvas = document.getElementById('byte-canvas');
  if (!canvas) return;

  // Crear renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;

  // Cámara
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 12);

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
  renderer.scene.add(ambientLight);

  const pointLight = new THREE.PointLight(PHOSPHOR, 60);
  pointLight.position.set(0, 6, 10);
  renderer.scene.add(pointLight);

  // Construir la escena del byte 01010101
  buildByteScene();

  // Event listeners
  window.addEventListener('resize', onWindowResize);
}

function buildByteScene() {
  const scene = new THREE.Scene();
  renderer.scene = scene;

  // Patrón del byte: 0 1 0 1 0 1 0 1
  const pattern = ['0', '1', '0', '1', '0', '1', '0', '1'];
  const PHOSPHOR_DIM = '#1c5f38';
  const ROW_WIDTH = 7.4;
  const FRAME_MARGIN = 0.9;
  const BYTE_Y = 2.8;
  const MIN_CAMERA_Z = 9;

  // Texturas para los bits (canvas 2D -> CanvasTexture)
  const faceTextureCache = new Map();

  function getFaceTextures(digit) {
    const cached = faceTextureCache.get(digit);
    if (cached) return cached;

    const size = 256;
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = size;
    mapCanvas.height = size;
    const mapCtx = mapCanvas.getContext('2d');
    const emissiveCanvas = document.createElement('canvas');
    emissiveCanvas.width = size;
    emissiveCanvas.height = size;
    const eCtx = emissiveCanvas.getContext('2d');

    // Cuerpo del chip: degradado verde oscuro
    if (mapCtx) {
      const body = mapCtx.createLinearGradient(0, 0, 0, size);
      body.addColorStop(0, '#0f3524');
      body.addColorStop(1, '#071b12');
      mapCtx.fillStyle = body;
      mapCtx.fillRect(0, 0, size, size);

      // Marco
      mapCtx.strokeStyle = 'rgba(85, 255, 136, 0.4)';
      mapCtx.lineWidth = 6;
      mapCtx.strokeRect(10, 10, size - 20, size - 20);

      // Zócalo hundido
      mapCtx.fillStyle = '#04120b';
      mapCtx.fillRect(52, 52, size - 52 * 2, size - 52 * 2);
      mapCtx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      mapCtx.lineWidth = 5;
      mapCtx.beginPath();
      mapCtx.moveTo(52, size - 52 - 2.5);
      mapCtx.lineTo(52, 52);
      mapCtx.lineTo(size - 52, 52);
      mapCtx.stroke();
      mapCtx.strokeStyle = 'rgba(85, 255, 136, 0.28)';
      mapCtx.beginPath();
      mapCtx.moveTo(52 + 2.5, size - 52);
      mapCtx.lineTo(size - 52, size - 52);
      mapCtx.lineTo(size - 52, 52 + 2.5);
      mapCtx.stroke();
    }

    // Dígito incrustado
    if (mapCtx) {
      const font = 'bold 138px "JetBrains Mono Variable", monospace';
      mapCtx.textAlign = 'center';
      mapCtx.textBaseline = 'middle';
      mapCtx.font = font;
      mapCtx.shadowColor = PHOSPHOR;
      mapCtx.shadowBlur = 26;
      mapCtx.fillStyle = 'rgba(85, 255, 136, 0.85)';
      mapCtx.fillText(digit, size / 2, size / 2 + 6);
      mapCtx.shadowBlur = 0;
      mapCtx.fillStyle = '#d8ffe8';
      mapCtx.fillText(digit, size / 2, size / 2 + 6);
    }

    // Emissive: solo el bit emite luz
    if (eCtx) {
      eCtx.fillStyle = '#000000';
      eCtx.fillRect(0, 0, size, size);
      eCtx.textAlign = 'center';
      eCtx.textBaseline = 'middle';
      eCtx.font = 'bold 138px "JetBrains Mono Variable", monospace';
      eCtx.shadowColor = PHOSPHOR;
      eCtx.shadowBlur = 18;
      eCtx.fillStyle = PHOSPHOR;
      eCtx.fillText(digit, size / 2, size / 2 + 6);
      eCtx.shadowBlur = 0;
      eCtx.fillStyle = '#ffffff';
      eCtx.fillText(digit, size / 2, size / 2 + 6);
    }

    const mapTex = new THREE.CanvasTexture(mapCanvas);
    mapTex.colorSpace = THREE.SRGBColorSpace;
    const emissiveTex = new THREE.CanvasTexture(emissiveCanvas);
    emissiveTex.colorSpace = THREE.SRGBColorSpace;

    const entry = { map: mapTex, emissive: emissiveTex };
    faceTextureCache.set(digit, entry);
    return entry;
  }

  // Cubos del byte
  const PHOSPHOR_GLOW = '#55ff88';
  const patternData = ['0', '1', '0', '1', '0', '1', '0', '1'];

  for (let i = 0; i < 8; i++) {
    const digit = patternData[i];
    const position = [(i - 3.5) * 1.05, 0, 0];

    const textures = getFaceTextures(digit);
    const material = new THREE.MeshStandardMaterial({
      map: textures.map,
      emissive: textures.emissive,
      emissiveIntensity: digit === '1' ? 1.25 : 0.55,
      roughness: 0.55,
      metalness: 0.15,
    });

    const geometry = new THREE.BoxGeometry(0.82, 0.82, 0.82);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(position);
    cube.userData.lit = digit === '1';
    cube.userData.index = i;

    // Flotación y rotación suave
    const phase = i * 0.9;
    cube.tick = (delta) => {
      cube.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.2 + phase) * 0.1;
      cube.rotation.y = Math.sin(clock.getElapsedTime() * 0.35 + phase) * (cube.userData.lit ? 0.3 : 0.16);
    };

    scene.add(cube);
  }

  // Glow central
  const coreGeometry = new THREE.SphereGeometry(0.5, 24, 24);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: PHOSPHOR,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.set(0, 0, -1.6);
  scene.add(core);

  // Campo binario de partículas
  const particleCount = 48;
  const particlesGeometry = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    }),
    particleCount
  );
  particlesGeometry.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(particlesGeometry);

  // Posiciones de partículas deterministas
  const particlePositions = [];
  for (let i = 0; i < particleCount; i++) {
    particlePositions.push(
      ((i * 61.8) % 40) - 20,
      ((i * 37.7) % 24) - 12,
      -4 - ((i * 13.3) % 16)
    );
  }
  particlesGeometry.setAttribute(
    'instancePosition',
    new THREE.InstancedBufferAttribute(new Float32Array(particlePositions), 3)
  );

  // Animación del campo
  let clock = new THREE.Clock();
  let t = 0;
  function animate() {
    t = clock.getElapsedTime();

    // Deriva del campo
    const digits = [];
    for (let i = 0; i < particleCount; i++) {
      const y = ((i % 2 === 0 ? 0 : 12) + t * (0.25 + (i % 5) * 0.05) % 24) - 12;
      // ... simplified particle movement
    }

    // Rotación del byte completo
    const groupRotation = Math.sin(t * 0.25) * 0.18;
    // Aplicar rotación al grupo (handled in render)

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// ── Countdown Hero ──
function initCountdown() {
  const now = new Date();
  const dayState = getDayState(now);

  // Actualizar título dinámico
  updateTitle(dayState);

  // Actualizar cada segundo
  setInterval(() => {
    const now = new Date();
    const state = getDayState(now);
    updateTitle(state);
    updateCountdown(state);
  }, 1000);
}

function updateTitle(state) {
  document.title = state.celebrating
    ? `${DAY_NUMBER} — ${i18n.t('hero.celebratingTitle')}`
    : `${DAY_NUMBER} · ${i18n.t('hero.countdownLabel')}`;
}

function updateCountdown(state) {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const { d, h, m, s } = timeParts(state.target, new Date());

  // Actualizar dígitos
  const digitElements = heroSection.querySelectorAll('.digit');
  digitElements.forEach((el, i) => {
    el.textContent = state.celebrating ? '0' : (d + h + m + s)[i] || '';
  });

  // Mostrar/ocultar modo celebración
  const countGroups = heroSection.querySelectorAll('.count-group');
  if (state.celebrating) {
    heroSection.classList.add('celebrating');
    // Ocultar countdown, mostrar celebración
    countGroups.forEach(g => g.style.display = 'none');
  } else {
    heroSection.classList.remove('celebrating');
    countGroups.forEach(g => g.style.display = 'block');
  }
}

function timeParts(target, now) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86_400);
  const h = Math.floor((total % 86_400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s };
}

// ── Event Listeners ──
function initEventListeners() {
  // Toggle language
  const langBtn = document.querySelector('.nav-lang, .footer-lang');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      i18n.setLang(i18n.currentLang === 'es' ? 'en' : 'es');
    });
  }

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    // Aplicar estilos de reduced motion
    document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
  }
  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
    } else {
      document.documentElement.style.setProperty('scroll-behavior', 'smooth', 'important');
    }
  });

  // Celebration dismiss
  const dismissBtn = document.querySelector('.cele-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      const celebration = document.querySelector('.celebration');
      if (celebration) {
        celebration.style.display = 'none';
      }
    });
  }

  // Initialize Three.js on user interaction (required by some browsers)
  let initialized = false;
  const initOnInteraction = () => {
    if (!initialized) {
      initThreeScene();
      initialized = true;
    }
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('touchstart', initOnInteraction);
  };
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('touchstart', initOnInteraction);
}

// Global exposure for debugging/interaction
window.programmerDay = {
  updateLang: (lang) => i18n.setLang(lang),
  getDayState,
};