import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Button from '../ui/Button';
import styles from './Parameters.module.css';

export default function Parameters() {
  const serializeState = useAppStore((s) => s.serializeState);
  const applySerializedState = useAppStore((s) => s.applySerializedState);

  // Subscribe to state changes so the JSON textarea stays in sync
  const tick = useAppStore((s) =>
    `${s.distribution}|${s.growth}|${s.spread}|${s.bloom}|${s.count}|${s.decayAmount}|${s.decayCurve}|${s.decayInvert}|${s.bgColor}|${s.shapeColor}|${s.selectedShape}|${s.gridVisible}|${s.gridCols}|${s.gridRows}`
  );

  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) {
      setText(JSON.stringify(serializeState(), null, 2));
    }
  }, [tick, dirty, serializeState]);

  const handleChange = (e) => {
    setText(e.target.value);
    setDirty(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('COPIED');
      setTimeout(() => setStatus(''), 1500);
    } catch {
      setStatus('COPY FAILED');
      setTimeout(() => setStatus(''), 1500);
    }
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(text);
      const result = applySerializedState(parsed);
      if (result.ok) {
        setStatus('APPLIED');
        setDirty(false);
      } else {
        setStatus('INVALID');
      }
    } catch (err) {
      setStatus('INVALID JSON');
    }
    setTimeout(() => setStatus(''), 1500);
  };

  const handleReset = () => {
    setText(JSON.stringify(serializeState(), null, 2));
    setDirty(false);
    setStatus('RESET');
    setTimeout(() => setStatus(''), 1000);
  };

  return (
    <Section title="Parameters">
      <textarea
        className={styles.textarea}
        value={text}
        onChange={handleChange}
        spellCheck={false}
        rows={14}
      />
      <div className={styles.row}>
        <Button className={styles.btn} onClick={handleCopy}>Copy</Button>
        <Button className={styles.btn} onClick={handleImport}>Import</Button>
        <Button className={styles.btn} onClick={handleReset}>Reset</Button>
      </div>
      {status && <div className={styles.status}>{status}</div>}
    </Section>
  );
}
