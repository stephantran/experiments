import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Slider from '../ui/Slider';
import Button from '../ui/Button';
import styles from './Rotation.module.css';

export default function Rotation() {
  const rotationMode = useAppStore((s) => s.rotationMode);
  const rotationAngle = useAppStore((s) => s.rotationAngle);
  const setRotationMode = useAppStore((s) => s.setRotationMode);
  const setRotationAngle = useAppStore((s) => s.setRotationAngle);

  return (
    <Section title="Rotation">
      <div className={styles.modeRow}>
        <span className={styles.label}>Mode</span>
        <div className={styles.toggleBtns}>
          <Button
            active={rotationMode === 'FOLLOW'}
            onClick={() => setRotationMode('FOLLOW')}
            className={styles.toggleBtn}
          >
            Follow
          </Button>
          <Button
            active={rotationMode === 'FIXED'}
            onClick={() => setRotationMode('FIXED')}
            className={styles.toggleBtn}
          >
            Fixed
          </Button>
        </div>
      </div>
      {rotationMode === 'FIXED' && (
        <Slider
          label="Angle"
          value={rotationAngle}
          min={0}
          max={360}
          step={1}
          onChange={setRotationAngle}
          decimals={0}
        />
      )}
    </Section>
  );
}
