import { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Swatch from '../ui/Swatch';
import styles from './Colour.module.css';

const PALETTE = [
  '#1A1714', '#E8500A', '#D44000', '#C96A00', '#E8A87C',
  '#F2C9A8', '#F5E6D8', '#FFFFFF', '#C8C3BC', '#A09A94',
  '#7A7470', '#3A3530',
];

export default function Colour() {
  const bgColor = useAppStore((s) => s.bgColor);
  const shapeColor = useAppStore((s) => s.shapeColor);
  const setBgColor = useAppStore((s) => s.setBgColor);
  const setShapeColor = useAppStore((s) => s.setShapeColor);

  const [customBg, setCustomBg] = useState('#888888');
  const [customShape, setCustomShape] = useState('#888888');

  return (
    <Section title="Colour">
      <div className={styles.group}>
        <span className={styles.label}>Background</span>
        <div className={styles.swatches}>
          {PALETTE.map((c) => (
            <Swatch
              key={`bg-${c}`}
              color={c}
              active={bgColor === c}
              onClick={setBgColor}
            />
          ))}
          <Swatch
            color={customBg}
            active={bgColor === customBg}
            isCustom
            onClick={(c) => {
              setCustomBg(c);
              setBgColor(c);
            }}
          />
        </div>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Shape Fill</span>
        <div className={styles.swatches}>
          {PALETTE.map((c) => (
            <Swatch
              key={`shape-${c}`}
              color={c}
              active={shapeColor === c}
              onClick={setShapeColor}
            />
          ))}
          <Swatch
            color={customShape}
            active={shapeColor === customShape}
            isCustom
            onClick={(c) => {
              setCustomShape(c);
              setShapeColor(c);
            }}
          />
        </div>
      </div>
    </Section>
  );
}
