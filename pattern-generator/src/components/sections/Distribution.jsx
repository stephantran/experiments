import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Button from '../ui/Button';
import { DISTRIBUTION_KEYS } from '../../distributions/index';
import styles from './Distribution.module.css';

export default function Distribution() {
  const distribution = useAppStore((s) => s.distribution);
  const setDistribution = useAppStore((s) => s.setDistribution);

  return (
    <Section title="Distribution">
      <div className={styles.grid}>
        {DISTRIBUTION_KEYS.map((key) => (
          <Button
            key={key}
            active={distribution === key}
            onClick={() => setDistribution(key)}
            className={styles.distBtn}
          >
            {key}
          </Button>
        ))}
      </div>
    </Section>
  );
}
