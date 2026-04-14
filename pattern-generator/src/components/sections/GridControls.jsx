import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Slider from '../ui/Slider';
import styles from './GridControls.module.css';

export default function GridControls() {
  const gridVisible = useAppStore((s) => s.gridVisible);
  const gridCols = useAppStore((s) => s.gridCols);
  const gridRows = useAppStore((s) => s.gridRows);
  const setGridVisible = useAppStore((s) => s.setGridVisible);
  const setGridCols = useAppStore((s) => s.setGridCols);
  const setGridRows = useAppStore((s) => s.setGridRows);

  return (
    <Section title="Grid">
      <div className={styles.toggleRow}>
        <span className={styles.label}>Show Grid</span>
        <div className={styles.toggleBtns}>
          <button
            className={`${styles.toggleBtn} ${!gridVisible ? styles.active : ''}`}
            onClick={() => setGridVisible(false)}
          >
            OFF
          </button>
          <button
            className={`${styles.toggleBtn} ${gridVisible ? styles.active : ''}`}
            onClick={() => setGridVisible(true)}
          >
            ON
          </button>
        </div>
      </div>
      {gridVisible && (
        <>
          <Slider
            label="Columns"
            value={gridCols}
            min={2}
            max={24}
            step={1}
            onChange={setGridCols}
            decimals={0}
          />
          <Slider
            label="Rows"
            value={gridRows}
            min={2}
            max={24}
            step={1}
            onChange={setGridRows}
            decimals={0}
          />
        </>
      )}
    </Section>
  );
}
