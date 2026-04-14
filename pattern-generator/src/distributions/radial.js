/**
 * Radial (Sunburst) distribution.
 * Elements distributed along rays from center.
 */
export default function radial({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const numRays = Math.max(1, Math.floor(bloom / 15) + 1);
  const elementsPerRay = Math.max(1, Math.floor(count / numRays));

  for (let r = 0; r < numRays; r++) {
    const angle = (r / numRays) * 2 * Math.PI;
    for (let e = 1; e <= elementsPerRay; e++) {
      const radius = e * spread * 0.8;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI;

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
    }
  }

  return points;
}
