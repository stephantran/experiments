import styles from './Slider.module.css';

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
  onAnimateToggle,
  animating = false,
  decimals = 1,
}) {
  const displayValue = Number(value).toFixed(decimals);
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.slider}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        {onAnimateToggle && (
          <button
            className={`${styles.animateBtn} ${animating ? styles.animating : ''}`}
            onClick={onAnimateToggle}
            title={animating ? 'Stop animating' : 'Animate'}
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
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, var(--text-primary) 0%, var(--text-primary) ${percent}%, var(--stroke) ${percent}%, var(--stroke) 100%)`,
          }}
        />
        <span className={styles.value}>{displayValue}</span>
      </div>
    </div>
  );
}
