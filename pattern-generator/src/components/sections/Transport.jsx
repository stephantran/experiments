import useAppStore from '../../store/useAppStore';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import styles from './Transport.module.css';

export default function Transport() {
  const playing = useAppStore((s) => s.playing);
  const speed = useAppStore((s) => s.speed);
  const sliderMaxes = useAppStore((s) => s.sliderMaxes);
  const setPlaying = useAppStore((s) => s.setPlaying);
  const setSpeed = useAppStore((s) => s.setSpeed);
  const setSliderMax = useAppStore((s) => s.setSliderMax);

  return (
    <div className={styles.transport}>
      <div className={styles.playRow}>
        <Button
          onClick={() => setPlaying(!playing)}
          active={playing}
          className={styles.playBtn}
        >
          {playing ? '\u25A0 STOP' : '\u25B6 PLAY'}
        </Button>
      </div>
      <Slider
        label="Speed"
        value={speed}
        min={0.001}
        max={sliderMaxes.speed}
        step={0.001}
        onChange={setSpeed}
        decimals={3}
        configurable
        onMaxChange={(v) => setSliderMax('speed', v)}
      />
    </div>
  );
}
