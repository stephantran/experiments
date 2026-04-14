import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Swatch from '../ui/Swatch';
import Button from '../ui/Button';
import styles from './Colour.module.css';

const PALETTE = [
  '#1A1714', '#E8500A', '#D44000', '#C96A00', '#E8A87C',
  '#F2C9A8', '#F5E6D8', '#FFFFFF', '#C8C3BC', '#A09A94',
  '#7A7470', '#3A3530',
];

export default function Colour() {
  const bgColor = useAppStore((s) => s.bgColor);
  const shapeColor = useAppStore((s) => s.shapeColor);
  const shapeColor2 = useAppStore((s) => s.shapeColor2);
  const gradientEnabled = useAppStore((s) => s.gradientEnabled);
  const setBgColor = useAppStore((s) => s.setBgColor);
  const setShapeColor = useAppStore((s) => s.setShapeColor);
  const setShapeColor2 = useAppStore((s) => s.setShapeColor2);
  const setGradientEnabled = useAppStore((s) => s.setGradientEnabled);

  const [customBg, setCustomBg] = useState('#888888');
  const [customShape, setCustomShape] = useState('#888888');
  const [customShape2, setCustomShape2] = useState('#888888');

  return (
    <Section title="Colour">
      <div className={styles.group}>
        <span className={styles.label}>Background</span>
        <div className={styles.swatches}>
          {PALETTE.map((c) => (
            <Swatch key={`bg-${c}`} color={c} active={bgColor === c} onClick={setBgColor} />
          ))}
          <Swatch
            color={customBg}
            active={bgColor === customBg}
            isCustom
            onClick={(c) => { setCustomBg(c); setBgColor(c); }}
          />
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Shape Fill {gradientEnabled && '· Start'}</span>
        <div className={styles.swatches}>
          {PALETTE.map((c) => (
            <Swatch key={`shape-${c}`} color={c} active={shapeColor === c} onClick={setShapeColor} />
          ))}
          <Swatch
            color={customShape}
            active={shapeColor === customShape}
            isCustom
            onClick={(c) => { setCustomShape(c); setShapeColor(c); }}
          />
        </div>
      </div>

      <div className={styles.gradientRow}>
        <span className={styles.label}>Gradient</span>
        <div className={styles.toggleBtns}>
          <Button
            active={!gradientEnabled}
            onClick={() => setGradientEnabled(false)}
            className={styles.toggleBtn}
          >
            Off
          </Button>
          <Button
            active={gradientEnabled}
            onClick={() => setGradientEnabled(true)}
            className={styles.toggleBtn}
          >
            On
          </Button>
        </div>
      </div>

      {gradientEnabled && (
        <div className={styles.group}>
          <span className={styles.label}>Shape Fill · End</span>
          <div className={styles.swatches}>
            {PALETTE.map((c) => (
              <Swatch key={`shape2-${c}`} color={c} active={shapeColor2 === c} onClick={setShapeColor2} />
            ))}
            <Swatch
              color={customShape2}
              active={shapeColor2 === customShape2}
              isCustom
              onClick={(c) => { setCustomShape2(c); setShapeColor2(c); }}
            />
          </div>
        </div>
      )}
    </Section>
  );
}
