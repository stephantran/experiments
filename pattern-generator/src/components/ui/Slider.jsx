import { useState, useEffect } from 'react';
import styles from './Slider.module.css';

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
  decimals = 1,
  configurable = false,
  onMaxChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [maxInput, setMaxInput] = useState(String(max));

  useEffect(() => {
    setMaxInput(String(max));
  }, [max]);

  const commitMax = () => {
    const n = parseFloat(maxInput);
    if (Number.isFinite(n) && n > 0 && onMaxChange) {
      onMaxChange(n);
    } else {
      setMaxInput(String(max));
    }
  };

  const displayValue = Number(value).toFixed(decimals);
  const percent = ((value - min) / Math.max(max - min, 0.0001)) * 100;

  return (
    <div className={styles.slider}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        {configurable && (
          <button
            className={`${styles.caret} ${expanded ? styles.caretOpen : ''}`}
            onClick={() => setExpanded(!expanded)}
            title="Configure max value"
            type="button"
          >
            &#9654;
          </button>
        )}
        <input
          type="range"
          className={styles.range}
          min={min}
          max={max}
          step={step}
          value={Math.min(value, max)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--text-primary) 0%, var(--text-primary) ${percent}%, var(--stroke) ${percent}%, var(--stroke) 100%)`,
          }}
        />
        <span className={styles.value}>{displayValue}</span>
      </div>
      {configurable && expanded && (
        <div className={styles.configRow}>
          <span className={styles.configLabel}>Max</span>
          <input
            type="number"
            className={styles.configInput}
            value={maxInput}
            step={step}
            min={Math.max(min, step)}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={commitMax}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitMax();
                e.target.blur();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
