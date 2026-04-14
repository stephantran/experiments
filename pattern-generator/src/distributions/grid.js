/**
 * Grid (Cartesian) distribution.
 *
 * Count = total elements (determines grid density within the canvas).
 * Spread = coverage area (what fraction of canvas the grid occupies).
 * Bloom = random per-cell jitter + rotation.
 */
import mulberry32 from '../utils/prng.js';

export default function grid({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const rng = mulberry32(42);

  // Derive grid dims from count: approximately sqrt(count) x sqrt(count)
  const cols = Math.max(1, Math.round(Math.sqrt(count)));
  const rows = Math.max(1, Math.round(count / cols));

  // Coverage area — spread=100 → full canvas, spread=10 → 10% canvas
  const coverage = Math.max(0.1, spread / 100) * canvasSize;
  const offset = (canvasSize - coverage) / 2;
  const spacing = coverage / Math.max(cols, rows);
  const jitterAmount = (bloom / 360) * spacing * 0.5;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x =
        offset +
        (c + 0.5) * spacing +
        (jitterAmount > 0 ? (rng() - 0.5) * 2 * jitterAmount : 0);
      const y =
        offset +
        (r + 0.5) * spacing +
        (jitterAmount > 0 ? (rng() - 0.5) * 2 * jitterAmount : 0);
      const rotation = bloom * rng();

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
    }
  }

  return points;
}
