/**
 * Fibonacci Spiral distribution.
 * r = a * e^(b * theta)
 * Elements placed along a logarithmic spiral.
 */
export default function fibonacci({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const b = 0.03 + spread * 0.005; // tightness
  const totalRotation = (bloom / 180) * Math.PI * 4; // total extent
  const a = 2;

  for (let i = 0; i < count; i++) {
    const theta = (i / count) * totalRotation;
    const r = a * Math.exp(b * theta);
    const x = center + r * Math.cos(theta);
    const y = center + r * Math.sin(theta);
    const rotation = (theta * 180) / Math.PI;

    if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

    points.push({ x, y, rotation, scale: growth });
  }

  return points;
}
