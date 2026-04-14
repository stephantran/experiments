import styles from './Group.module.css';

/**
 * Visual grouping container for related sections.
 * Subtle tonal band + muted label — no heavy borders.
 *
 * `tone` picks the subtle background treatment:
 *   'light'   — bg color (off-white)
 *   'mid'     — panel color (slightly darker)
 *   'texture' — bg + very subtle dot texture
 */
export default function Group({ label, tone = 'light', children }) {
  return (
    <div className={`${styles.group} ${styles[tone]}`}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
