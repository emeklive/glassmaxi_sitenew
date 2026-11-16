/**
 * Valores animados do visualizador. Ficam fora do React para que o amortecimento
 * rode a cada quadro sem re-renderizar componentes.
 */
export const rig = {
  exploded: 0,
  heat: 0,
  time: 0,
  frames: 0,
};

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));
