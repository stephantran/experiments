/**
 * Phyllotaxis (Golden Angle) distribution.
 *
 * Count controls DENSITY within a fixed extent, not outward growth.
 * Spread controls the maximum radius of the spiral.
 * Bloom controls the angle multiplier (golden angle ≈ 137.5°).
 *
 * Formula:
 *   maxR = spread * sqrt(N_ref)   // N_ref = 500, a reference count
 *   r    = maxR * sqrt(n / count) // normalized to extent
 *
 * Equivalently: r = spread * sqrt(N_ref * n / count).
 * At n = count, r = maxR regardless of count — so more count = denser packing.
 */
const N_REF = 500;

export default function phyllotaxis({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const bloomRad = (bloom * Math.PI) / 180;
  const center = canvasSize / 2;

  for (let i = 0; i < count; i++) {
    const angle = i * bloomRad;
    const radius = spread * Math.sqrt((N_REF * i) / count);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const rotation = (angle * 180) / Math.PI;

    if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

    points.push({ x, y, rotation, scale: growth });
  }

  return points;
}
