import { useState } from 'react';
import styles from './Section.module.css';

export default function Section({ title, defaultOpen = false, alwaysOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen || alwaysOpen);

  return (
    <div className={styles.section}>
      <button
        className={styles.header}
        onClick={() => !alwaysOpen && setOpen(!open)}
        disabled={alwaysOpen}
      >
        <span className={styles.title}>{title}</span>
        {!alwaysOpen && <span className={styles.toggle}>{open ? '\u2014' : '+'}</span>}
      </button>
      <div className={`${styles.body} ${open ? styles.open : ''}`}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
