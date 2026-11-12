/*
 * Punto de entrada principal de la aplicacion
 * Inicializa el gestor de dados y configura los eventos de interaccion
 */

import { DiceManager } from './modules/dice.js';
import { sumValues } from './services/diceService.js';

/* Elementos del DOM */
const diceGrid = document.getElementById('dice-grid');
const diceCountDisplay = document.getElementById('dice-count');
const diceCountSlider = document.getElementById('dice-count-slider');
const rollAnnouncer = document.getElementById('roll-announce');

/* Inicializar gestor de dados */
const diceManager = new DiceManager(diceGrid);
diceManager.render();

/**
 * Configura los eventos de los controles (slider de cantidad)
 */
function setupControls() {
    if (diceCountSlider && diceCountDisplay) {
        diceCountSlider.addEventListener('input', function () {
            const count = parseInt(this.value, 10);
            diceCountDisplay.textContent = count;
            diceManager.setCount(count);
        });
    }
}

/**
 * Configura los eventos de lanzamiento (click, touch y teclado)
 */
function setupRollEvents() {
    /**
     * Verifica si el objetivo del evento pertenece a los controles
     * @param {EventTarget} target
     * @returns {boolean}
     */
    function isControlTarget(target) {
        return target.closest('.controls') !== null;
    }

    /* Evento de click para escritorio */
    document.addEventListener('click', function (event) {
        if (isControlTarget(event.target)) {
            return;
        }
        handleRoll();
    });

    /* Evento tactil para dispositivos moviles */
    document.addEventListener(
        'touchstart',
        function (event) {
            if (isControlTarget(event.target)) {
                return;
            }
            handleRoll();
        },
        { passive: true }
    );

    /* Evento de teclado para accesibilidad */
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            if (isControlTarget(event.target)) {
                return;
            }
            event.preventDefault();
            handleRoll();
        }
    });
}

/**
 * Maneja la accion de lanzar los dados
 */
async function handleRoll() {
    if (diceManager.isRolling) {
        return;
    }
    if (diceCountSlider) {
        diceCountSlider.disabled = true;
    }
    try {
        announceResult(await diceManager.rollAll());
    } finally {
        if (diceCountSlider) {
            diceCountSlider.disabled = false;
        }
    }
}

/**
 * Anuncia el resultado a traves de un aria-live para lectores de pantalla
 * @param {number[]} values - Valores de los dados
 */
function announceResult(values) {
    if (!rollAnnouncer) {
        return;
    }
    const total = sumValues(values);
    rollAnnouncer.textContent = '';
    /* Usar requestAnimationFrame para asegurar que el cambio se anuncie */
    requestAnimationFrame(function () {
        rollAnnouncer.textContent =
            'Resultado: ' + values.join(', ') + '. Total: ' + total;
    });
}

/* Inicializar */
setupControls();
setupRollEvents();
