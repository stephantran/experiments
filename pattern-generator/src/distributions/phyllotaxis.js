/**
 * Phyllotaxis (Golden Angle) distribution.
 *
 * Places elements in a sunflower-spiral pattern.
 *   angle = n * bloomAngle  (137.508° = golden angle → classic sunflower)
 *   radius = spread * sqrt(n)
 */
export default function phyllotaxis({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const bloomRad = (bloom * Math.PI) / 180;
  const center = canvasSize / 2;

  for (let i = 0; i < count; i++) {
    const angle = i * bloomRad;
    const radius = spread * Math.sqrt(i);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const scale = growth;
    const rotation = (angle * 180) / Math.PI;

    // Skip points outside canvas bounds (with margin)
    if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

    points.push({ x, y, rotation, scale });
  }

  return points;
}
