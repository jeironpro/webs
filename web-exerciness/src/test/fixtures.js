// Fixtures de ejercicios con la misma forma que el dataset real.
export const exerciseFixture = (overrides = {}) => ({
  id: '0001',
  name: '3/4 sit-up',
  body_part: 'waist',
  equipment: 'body weight',
  target: 'abs',
  muscle_group: 'hip flexors',
  secondary_muscles: ['hip flexors', 'lower back'],
  image: '/images/0001-2gPfomN.jpg',
  gif_url: '/videos/0001-2gPfomN.gif',
  instructions: { es: 'Túmbate sobre tu espalda con las rodillas flexionadas.' },
  instruction_steps: { es: ['Túmbate boca arriba.', 'Sube el torso hacia delante.'] },
  attribution: '© Gym visual — https://gymvisual.com/',
  ...overrides,
})

export const exercisesFixture = () => [
  exerciseFixture(),
  exerciseFixture({
    id: '0002',
    name: 'Bicep curl',
    body_part: 'upper arms',
    equipment: 'dumbbell',
    target: 'biceps',
    muscle_group: 'biceps',
  }),
  exerciseFixture({
    id: '0003',
    name: 'Bench press',
    body_part: 'chest',
    equipment: 'barbell',
    target: 'pectorals',
    muscle_group: 'chest',
  }),
]
