/* Hallmark · component: exercise-card · genre: playful · macrostructure: 11-catalogue · theme: Hum · design-system: design.md · designed-as-app */
import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card.jsx'
import Badge from '@/components/ui/Badge.jsx'
import CompareButton from '@/components/common/CompareButton.jsx'
import { getBodyPartLabel, getEquipmentLabel } from '@/utils/helpers.js'

// Tarjeta de un ejercicio en el catálogo: miniatura, nombre y badges
// de grupo corporal y equipo. El botón de comparación flota en la esquina.
const ExerciseCard = ({ exercise }) => (
  <Card className="group relative overflow-hidden transition-transform duration-220 ease-spring hover:-translate-y-1">
    <Link to={`/ejercicio/${exercise.id}`} className="block no-underline">
      {/* Miniatura con zoom suave al hacer hover. */}
      <div className="overflow-hidden">
        <img
          src={exercise.image}
          alt={exercise.name}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-220 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-tight text-ink">
          {exercise.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge tone="primary">{getBodyPartLabel(exercise.body_part)}</Badge>
          <Badge>{getEquipmentLabel(exercise.equipment)}</Badge>
        </div>
      </div>
    </Link>
    <CompareButton exerciseId={exercise.id} compact className="absolute right-3 top-3" />
  </Card>
)

export default ExerciseCard
