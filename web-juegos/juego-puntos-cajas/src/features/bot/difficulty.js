// Dificultades del bot: cada una define la profundidad de búsqueda del minimax.
// La dificultad fácil usa una selección greedy con algo de aleatoriedad.
export const DIFFICULTY_DEPTHS = {
  easy: 1,
  medium: 3,
  hard: 5,
};

// Etiquetas visibles de cada dificultad
export const DIFFICULTY_LABELS = {
  easy: "Fácil",
  medium: "Medio",
  hard: "Difícil",
};

export const DEFAULT_DIFFICULTY = "medium";
