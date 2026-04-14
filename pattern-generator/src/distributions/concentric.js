/**
 * Concentric distribution.
 * Elements placed on concentric rings.
 */
export default function concentric({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const numRings = Math.max(1, Math.floor(bloom / 30) + 1);
  const ringGap = Math.max(spread * 1.5, 8);
  let placed = 0;

  for (let ring = 1; ring <= numRings && placed < count; ring++) {
    const radius = ring * ringGap;
    const circumference = 2 * Math.PI * radius;
    const spacing = Math.max(growth * 3, 6);
    const elementsOnRing = Math.max(1, Math.floor(circumference / spacing));

    for (let e = 0; e < elementsOnRing && placed < count; e++) {
      const angle = (e / elementsOnRing) * 2 * Math.PI;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const rotation = (angle * 180) / Math.PI;

      if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

      points.push({ x, y, rotation, scale: growth });
      placed++;
    }
  }

  return points;
}
