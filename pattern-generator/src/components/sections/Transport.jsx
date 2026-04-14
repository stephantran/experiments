import useAppStore from '../../store/useAppStore';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import styles from './Transport.module.css';

export default function Transport() {
  const playing = useAppStore((s) => s.playing);
  const speed = useAppStore((s) => s.speed);
  const setPlaying = useAppStore((s) => s.setPlaying);
  const setSpeed = useAppStore((s) => s.setSpeed);

  return (
    <div className={styles.transport}>
      <div className={styles.row}>
        <Button
          onClick={() => setPlaying(!playing)}
          active={playing}
          className={styles.playBtn}
        >
          {playing ? '■ STOP' : '▶ PLAY'}
        </Button>
        <div className={styles.speedSlider}>
          <Slider
            label="Speed"
            value={speed}
            min={0.001}
            max={1.0}
            step={0.001}
            onChange={setSpeed}
            decimals={3}
          />
        </div>
      </div>
    </div>
  );
}
