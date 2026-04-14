import { useRef } from 'react';
import styles from './Swatch.module.css';

export default function Swatch({ color, active = false, onClick, isCustom = false }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (isCustom) {
      inputRef.current?.click();
    } else {
      onClick(color);
    }
  };

  return (
    <button
      className={`${styles.swatch} ${active ? styles.active : ''}`}
      style={{ backgroundColor: color }}
      onClick={handleClick}
      title={color}
    >
      {isCustom && (
        <input
          ref={inputRef}
          type="color"
          className={styles.colorInput}
          value={color}
          onChange={(e) => onClick(e.target.value)}
        />
      )}
    </button>
  );
}
