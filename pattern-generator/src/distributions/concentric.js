/**
 * Concentric distribution.
 *
 * Count = total elements distributed across rings.
 * Spread = outer extent (max radius).
 * Bloom = number of rings.
 */
export default function concentric({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const numRings = Math.max(1, Math.floor(bloom / 30) + 1);
  const maxR = spread * 4;
  const ringGap = maxR / numRings;

  // Estimate total circumference across all rings to distribute count proportionally
  let totalCirc = 0;
  for (let ring = 1; ring <= numRings; ring++) {
    totalCirc += 2 * Math.PI * (ring * ringGap);
  }

  for (let ring = 1; ring <= numRings; ring++) {
    const radius = ring * ringGap;
    const circumference = 2 * Math.PI * radius;
    const elementsOnRing = Math.max(1, Math.round((circumference / totalCirc) * count));

    for (let e = 0; e < elementsOnRing; e++) {
      const angle = (e / elementsOnRing) * 2 * Math.PI;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI;

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
    }
  }

  return points;
}
