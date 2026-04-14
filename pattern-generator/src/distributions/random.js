/**
 * Random (Seeded) distribution.
 * Pseudo-random placement using Bloom value as seed.
 */
import mulberry32 from '../utils/prng.js';

export default function random({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const seed = Math.floor(bloom * 1000);
  const rng = mulberry32(seed);
  const margin = spread * 2;

  for (let i = 0; i < count; i++) {
    const x = margin + rng() * (canvasSize - margin * 2);
    const y = margin + rng() * (canvasSize - margin * 2);
    const rotation = rng() * 360;
    const scaleVariation = 0.5 + rng() * 1.0;

    points.push({ x, y, rotation, scale: growth * scaleVariation });
  }

  return points;
}
