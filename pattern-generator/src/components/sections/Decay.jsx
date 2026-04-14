import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Slider from '../ui/Slider';
import Button from '../ui/Button';
import { DECAY_CURVES, DECAY_CURVE_KEYS } from '../../utils/decay';
import styles from './Decay.module.css';

export default function Decay() {
  const decayAmount = useAppStore((s) => s.decayAmount);
  const decayCurve = useAppStore((s) => s.decayCurve);
  const decayInvert = useAppStore((s) => s.decayInvert);
  const opacityDecayAmount = useAppStore((s) => s.opacityDecayAmount);
  const setDecayAmount = useAppStore((s) => s.setDecayAmount);
  const setDecayCurve = useAppStore((s) => s.setDecayCurve);
  const setDecayInvert = useAppStore((s) => s.setDecayInvert);
  const setOpacityDecayAmount = useAppStore((s) => s.setOpacityDecayAmount);

  return (
    <Section title="Decay">
      <Slider
        label="Size"
        value={decayAmount * 100}
        min={0}
        max={100}
        step={1}
        onChange={(v) => setDecayAmount(v / 100)}
        decimals={0}
      />
      <Slider
        label="Opacity"
        value={opacityDecayAmount * 100}
        min={0}
        max={100}
        step={1}
        onChange={(v) => setOpacityDecayAmount(v / 100)}
        decimals={0}
      />

      <div className={styles.curveLabel}>Curve</div>
      <div className={styles.curveGrid}>
        {DECAY_CURVE_KEYS.map((key) => {
          const curve = DECAY_CURVES[key];
          return (
            <button
              key={key}
              className={`${styles.curveBtn} ${decayCurve === key ? styles.active : ''}`}
              onClick={() => setDecayCurve(key)}
              title={curve.label}
            >
              <svg viewBox="0 0 40 16" className={styles.curvePreview}>
                <polyline
                  points={Array.from({ length: 20 }, (_, i) => {
                    const t = i / 19;
                    const y = 14 - curve.fn(t) * 12;
                    return `${2 + t * 36},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              <span className={styles.curveName}>{curve.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.invertRow}>
        <span className={styles.label}>Invert</span>
        <div className={styles.toggleBtns}>
          <Button
            active={!decayInvert}
            onClick={() => setDecayInvert(false)}
            className={styles.toggleBtn}
          >
            OFF
          </Button>
          <Button
            active={decayInvert}
            onClick={() => setDecayInvert(true)}
            className={styles.toggleBtn}
          >
            ON
          </Button>
        </div>
      </div>
    </Section>
  );
}
