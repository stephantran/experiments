/**
 * Radial (Sunburst) distribution.
 *
 * Count = total elements (density along rays + number of rays combined).
 * Spread = max ray length (extent from center).
 * Bloom = number of rays (bloom / 15 + 1).
 */
export default function radial({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const numRays = Math.max(1, Math.floor(bloom / 15) + 1);
  const elementsPerRay = Math.max(1, Math.ceil(count / numRays));
  // Max radius = spread scaled so spread=50 reaches ~canvas edge
  const maxR = spread * 4;

  for (let r = 0; r < numRays; r++) {
    const angle = (r / numRays) * 2 * Math.PI;
    for (let e = 1; e <= elementsPerRay; e++) {
      // Normalize distance so last element is at maxR regardless of count
      const radius = (e / elementsPerRay) * maxR;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI;

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
    }
  }

  return points;
}
