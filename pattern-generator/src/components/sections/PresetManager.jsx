import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import Button from '../ui/Button';
import styles from './PresetManager.module.css';

export default function PresetManager() {
  const userPresets = useAppStore((s) => s.userPresets);
  const saveUserPreset = useAppStore((s) => s.saveUserPreset);
  const loadUserPreset = useAppStore((s) => s.loadUserPreset);
  const deleteUserPreset = useAppStore((s) => s.deleteUserPreset);
  const hydrateUserPresets = useAppStore((s) => s.hydrateUserPresets);

  const [name, setName] = useState('');

  useEffect(() => {
    hydrateUserPresets();
  }, []);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveUserPreset(trimmed);
    setName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <Section title="Preset Manager">
      <div className={styles.saveRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Preset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={24}
        />
        <Button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save
        </Button>
      </div>

      {userPresets.length === 0 && (
        <div className={styles.empty}>No saved presets yet.</div>
      )}

      {userPresets.length > 0 && (
        <ul className={styles.list}>
          {userPresets.map((preset) => (
            <li key={preset.id} className={styles.item}>
              <span className={styles.itemName}>{preset.name}</span>
              <div className={styles.itemActions}>
                <button
                  className={styles.loadBtn}
                  onClick={() => loadUserPreset(preset.id)}
                  title="Load this preset"
                >
                  LOAD
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    if (confirm(`Delete preset "${preset.name}"?`)) {
                      deleteUserPreset(preset.id);
                    }
                  }}
                  title="Delete this preset"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
