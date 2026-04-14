import { useRef, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import Section from '../ui/Section';
import { SHAPES, SHAPE_KEYS } from '../../shapes.jsx';
import { parseUploadedSvg } from '../../utils/svgParser';
import styles from './Shapes.module.css';

export default function Shapes() {
  const selectedShape = useAppStore((s) => s.selectedShape);
  const setShape = useAppStore((s) => s.setShape);
  const savedShapes = useAppStore((s) => s.savedShapes);
  const addSavedShape = useAppStore((s) => s.addSavedShape);
  const removeSavedShape = useAppStore((s) => s.removeSavedShape);
  const hydrateSavedShapes = useAppStore((s) => s.hydrateSavedShapes);
  const fileInputRef = useRef(null);

  useEffect(() => {
    hydrateSavedShapes();
  }, []);

  const handleFile = (file) => {
    if (!file || !file.name.endsWith('.svg')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = parseUploadedSvg(e.target.result);
      if (result.error) {
        console.warn('SVG parse error:', result.error);
        return;
      }
      addSavedShape(result.shape);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Section title="Shapes">
      <div className={styles.grid}>
        {SHAPE_KEYS.map((key) => {
          const shape = SHAPES[key];
          return (
            <button
              key={key}
              className={`${styles.shapeBtn} ${selectedShape === key ? styles.active : ''}`}
              onClick={() => setShape(key)}
              title={shape.label}
            >
              <svg viewBox="-2 -2 4 4" className={styles.preview}>
                {shape.render('var(--text-primary)')}
              </svg>
              <span className={styles.label}>{shape.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.uploadSection}>
        <span className={styles.uploadLabel}>Upload SVG</span>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <span>drag & drop .svg or click to browse</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            className={styles.fileInput}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>

      {savedShapes.length > 0 && (
        <div className={styles.savedSection}>
          <span className={styles.uploadLabel}>Saved Shapes</span>
          <div className={styles.savedGrid}>
            {savedShapes.map((shape) => (
              <button
                key={shape.id}
                className={`${styles.savedBtn} ${selectedShape === shape.id ? styles.active : ''}`}
                onClick={() => setShape(shape.id)}
                title={shape.name}
              >
                <svg
                  viewBox={`${shape.viewBox.x} ${shape.viewBox.y} ${shape.viewBox.w} ${shape.viewBox.h}`}
                  className={styles.savedPreview}
                  dangerouslySetInnerHTML={{ __html: shape.svgContent }}
                />
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSavedShape(shape.id);
                  }}
                >
                  &times;
                </button>
              </button>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
