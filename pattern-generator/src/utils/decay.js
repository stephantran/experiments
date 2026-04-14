/**
 * Decay curves — return a multiplier in [0, 1] for a given normalized position t ∈ [0, 1].
 * At t=0: multiplier = 1 (full size)
 * At t=1: multiplier → minimum (size * (1 - amount))
 *
 * `amount` ∈ [0, 1] controls how much the particle shrinks at the tail of the curve.
 *   amount=0 → no decay (always 1.0)
 *   amount=1 → full decay to 0 at t=1
 */

export const DECAY_CURVES = {
  NONE: { label: 'None', fn: () => 1 },
  LINEAR: { label: 'Linear', fn: (t) => 1 - t },
  QUADRATIC: { label: 'Quadratic', fn: (t) => (1 - t) * (1 - t) },
  EXPONENTIAL: { label: 'Exponential', fn: (t) => Math.exp(-3 * t) },
  LOGARITHMIC: { label: 'Logarithmic', fn: (t) => 1 - Math.log1p(t * (Math.E - 1)) / 1 },
  SINE: { label: 'Sine', fn: (t) => Math.cos(t * Math.PI * 0.5) },
  INVERSE_SQ: { label: 'Inverse²', fn: (t) => 1 / (1 + 4 * t * t) },
  PULSE: { label: 'Pulse', fn: (t) => Math.abs(Math.cos(t * Math.PI * 3)) },
};

export const DECAY_CURVE_KEYS = Object.keys(DECAY_CURVES);

/**
 * Compute the size multiplier for a particle at normalized position t.
 */
export function applyDecay(t, curveName, amount, invert = false) {
  const curve = DECAY_CURVES[curveName] || DECAY_CURVES.NONE;
  const effectiveT = invert ? 1 - t : t;
  const raw = curve.fn(effectiveT);
  // Blend between no-decay (1.0) and full curve based on amount.
  // amount=0 → multiplier=1 (no decay)
  // amount=1 → multiplier=raw
  return 1 - amount * (1 - raw);
}
