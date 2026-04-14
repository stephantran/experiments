import useAppStore from '../../store/useAppStore';
import Button from '../ui/Button';
import styles from './Presets.module.css';

const PRESET_ORDER = ['PC2', 'PC1', 'PS1', 'PS2', 'SP1'];

export default function Presets() {
  const activePreset = useAppStore((s) => s.activePreset);
  const loadPreset = useAppStore((s) => s.loadPreset);
  const savePreset = useAppStore((s) => s.savePreset);

  const handleContextMenu = (e, name) => {
    e.preventDefault();
    savePreset(name);
  };

  return (
    <div className={styles.presets}>
      <div className={styles.label}>Presets</div>
      <div className={styles.row}>
        {PRESET_ORDER.map((name) => (
          <Button
            key={name}
            active={activePreset === name}
            onClick={() => loadPreset(name)}
            onContextMenu={(e) => handleContextMenu(e, name)}
            className={styles.presetBtn}
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
