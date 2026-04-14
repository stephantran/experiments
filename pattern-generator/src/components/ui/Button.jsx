import styles from './Button.module.css';

export default function Button({
  children,
  onClick,
  active = false,
  variant = 'default',
  className = '',
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${active ? styles.active : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
