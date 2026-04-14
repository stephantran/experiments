/**
 * Spirograph (Hypotrochoid) distribution.
 *
 * Classic spirograph math — traces the path of a point attached to a small
 * circle rolling inside a larger fixed circle.
 *
 *   x = (R - r) cos(t) + d cos(((R - r) / r) * t)
 *   y = (R - r) sin(t) - d sin(((R - r) / r) * t)
 *
 * Parameter mapping:
 *   Growth → per-shape scale (standard)
 *   Spread → inner/outer circle ratio (controls lobe count & geometry)
 *   Bloom  → pen offset `d` (distance from inner circle center)
 */
export default function spirograph({ count, growth, spread, bloom, canvasSize = 800 }) {
  const points = [];
  const center = canvasSize / 2;
  const R = canvasSize * 0.4; // outer radius — fit within canvas
  // Map spread (0.5–100) to inner radius so ratio R:r produces interesting lobes.
  // r < R required. Small spread → tight tiny spirograph, large spread → broad rose.
  const r = Math.max(2, Math.min(R - 2, (spread / 100) * R * 0.75 + 5));
  // Map bloom (0–360) to pen offset (0 → point at inner center → plain circle;
  // larger values → looped hypotrochoid with dramatic petals).
  const d = (bloom / 360) * r * 1.5;

  // Number of revolutions for the curve to close = r / gcd(R, r)
  // Approximate with enough turns that the pattern looks complete.
  const revolutions = Math.min(20, Math.max(4, Math.round(r / gcdApprox(R, r))));
  const tMax = revolutions * 2 * Math.PI;

  const diff = R - r;
  const ratio = diff / r;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * tMax;
    const x = center + diff * Math.cos(t) + d * Math.cos(ratio * t);
    const y = center + diff * Math.sin(t) - d * Math.sin(ratio * t);

    // Tangent angle along the curve — good rotation so shapes follow the path
    const dx = -diff * Math.sin(t) - d * ratio * Math.sin(ratio * t);
    const dy = diff * Math.cos(t) - d * ratio * Math.cos(ratio * t);
    const rotation = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (x < -50 || x > canvasSize + 50 || y < -50 || y > canvasSize + 50) continue;

    points.push({ x, y, rotation, scale: growth });
  }

  return points;
}

// Approximate gcd using Euclidean algorithm on rounded integers.
function gcdApprox(a, b) {
  let x = Math.round(a * 10);
  let y = Math.round(b * 10);
  while (y > 0) {
    [x, y] = [y, x % y];
  }
  return Math.max(1, x / 10);
}
