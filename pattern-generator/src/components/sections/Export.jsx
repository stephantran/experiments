import Button from '../ui/Button';
import { exportSvg } from '../../utils/svgExport';
import { exportPng } from '../../utils/pngExport';
import styles from './Export.module.css';

export default function Export({ svgRef }) {
  return (
    <div className={styles.export}>
      <Button
        className={styles.exportBtn}
        onClick={() => exportSvg(svgRef?.current)}
      >
        Export SVG
      </Button>
      <Button
        className={styles.exportBtn}
        onClick={() => exportPng(svgRef?.current)}
      >
        Export PNG
      </Button>
    </div>
  );
}
