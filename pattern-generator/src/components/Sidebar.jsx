import Presets from './sections/Presets';
import Transport from './sections/Transport';
import Pattern from './sections/Pattern';
import Decay from './sections/Decay';
import Distribution from './sections/Distribution';
import GridControls from './sections/GridControls';
import Colour from './sections/Colour';
import Shapes from './sections/Shapes';
import Export from './sections/Export';
import styles from './Sidebar.module.css';

export default function Sidebar({ svgRef }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>FORM</span>
      </div>
      <div className={styles.content}>
        <Presets />
        <Transport />
        <Pattern />
        <Decay />
        <Distribution />
        <GridControls />
        <Colour />
        <Shapes />
      </div>
      <Export svgRef={svgRef} />
    </aside>
  );
}
