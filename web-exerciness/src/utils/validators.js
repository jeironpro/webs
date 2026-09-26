// Validaciones de la capa de datos.

// Comprueba que un registro del dataset tiene la forma esperada.
export function isValidExercise(exercise) {
  return (
    typeof exercise?.id === 'string' &&
    typeof exercise?.name === 'string' &&
    typeof exercise?.body_part === 'string' &&
    typeof exercise?.equipment === 'string' &&
    typeof exercise?.target === 'string' &&
    typeof exercise?.image === 'string' &&
    typeof exercise?.gif_url === 'string' &&
    typeof exercise?.muscle_group === 'string' &&
    Array.isArray(exercise?.secondary_muscles) &&
    typeof exercise?.instructions?.es === 'string'
  )
}
