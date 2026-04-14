/**
 * Grid (Cartesian) distribution.
 * Elements placed on a regular grid. Bloom adds jitter.
 */
import mulberry32 from '../utils/prng.js';

export default function grid({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const spacing = Math.max(growth * spread * 0.5, 4);
  const cols = Math.floor(canvasSize / spacing);
  const rows = Math.floor(canvasSize / spacing);
  const jitterAmount = (bloom / 360) * spacing * 0.5;
  const rng = mulberry32(42);

  for (let c = 0; c < cols && points.length < count; c++) {
    for (let r = 0; r < rows && points.length < count; r++) {
      const x = (c + 0.5) * spacing + (jitterAmount > 0 ? (rng() - 0.5) * 2 * jitterAmount : 0);
      const y = (r + 0.5) * spacing + (jitterAmount > 0 ? (rng() - 0.5) * 2 * jitterAmount : 0);
      const rotation = bloom * rng();

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
    }
  }

  return points;
}
