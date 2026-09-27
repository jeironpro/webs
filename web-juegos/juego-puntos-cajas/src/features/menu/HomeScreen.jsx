import { useState } from "react";
import Button from "@/components/ui/Button.jsx";
import Icon from "@/components/ui/Icon.jsx";
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_LABELS,
} from "@/features/bot/difficulty.js";
import "./HomeScreen.css";

// Pantalla de inicio: elige el modo (contra el bot o dos jugadores) y, en modo
// bot, la dificultad; al pulsar Jugar se inicia la partida con esas opciones.
function HomeScreen({ onStart }) {
  const [mode, setMode] = useState("bot");
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);

  return (
    <section className="home" aria-label="Pantalla de inicio">
      <h1 className="home__title">Puntos y Cajas</h1>
      <p className="home__subtitle">Completa más cajas que tu rival</p>

      <div className="home__card">
        <div className="home__modes">
          <Button
            variant={mode === "bot" ? "primary" : "secondary"}
            onClick={() => setMode("bot")}
          >
            <Icon name="smart_toy" />
            vs Bot
          </Button>
          <Button
            variant={mode === "local" ? "primary" : "secondary"}
            onClick={() => setMode("local")}
          >
            <Icon name="group" />2 Jugadores
          </Button>
        </div>

        {mode === "bot" && (
          <div className="home__difficulty">
            <span className="home__label">Dificultad</span>
            <div className="home__difficulty-options">
              {Object.entries(DIFFICULTY_LABELS).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`home__difficulty-option${difficulty === id ? " home__difficulty-option--active" : ""}`}
                  aria-pressed={difficulty === id}
                  onClick={() => setDifficulty(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          className="home__play"
          onClick={() => onStart(mode, difficulty)}
        >
          Jugar
        </Button>
      </div>
    </section>
  );
}

export default HomeScreen;
