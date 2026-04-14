import styles from './Group.module.css';

/**
 * Visual grouping container for related sections.
 * Draws a 2px colored left edge + small uppercase label to delineate the group.
 */
export default function Group({ label, color = 'var(--text-primary)', children }) {
  return (
    <div className={styles.group} style={{ '--group-color': color }}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
