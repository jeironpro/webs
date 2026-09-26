/* Hallmark · component: exercise-video · genre: playful · theme: Hum · design-system: design.md · designed-as-app */
import { useState } from 'react'
import Icon from '@/components/ui/Icon.jsx'

// Media de un ejercicio: miniatura estática que alterna con el GIF animado
// al pulsar Reproducir/Pausar. Muestra la atribución obligatoria © Gym visual.
const ExerciseVideo = ({ exercise }) => {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[280px] overflow-hidden rounded-card border border-rule bg-paper-2 shadow-soft">
        {playing ? (
          <img
            src={exercise.gif_url}
            alt={`Animación de ${exercise.name}`}
            className="aspect-square w-full object-contain"
          />
        ) : (
          <img
            src={exercise.image}
            alt={exercise.name}
            className="aspect-square w-full object-contain"
          />
        )}
      </div>
      <button
        type="button"
        className="btn btn--soft inline-flex items-center gap-2"
        onClick={() => setPlaying((value) => !value)}
      >
        <Icon name={playing ? 'pause' : 'play_arrow'} size={18} />
        {playing ? 'Pausar' : 'Reproducir'}
      </button>
      {exercise.attribution && (
        <figcaption className="font-body text-xs text-ink-2">{exercise.attribution}</figcaption>
      )}
    </figure>
  )
}

export default ExerciseVideo
