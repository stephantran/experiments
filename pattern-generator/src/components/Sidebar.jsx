import Group from './ui/Group';
import Presets from './sections/Presets';
import Transport from './sections/Transport';
import Pattern from './sections/Pattern';
import Decay from './sections/Decay';
import Rotation from './sections/Rotation';
import Distribution from './sections/Distribution';
import GridControls from './sections/GridControls';
import Colour from './sections/Colour';
import Shapes from './sections/Shapes';
import PresetManager from './sections/PresetManager';
import Parameters from './sections/Parameters';
import Export from './sections/Export';
import styles from './Sidebar.module.css';

export default function Sidebar({ svgRef }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>FORM</span>
      </div>
      <div className={styles.content}>
        <Group label="Playback" color="#E8500A">
          <Presets />
          <Transport />
        </Group>

        <Group label="Geometry" color="#1A1714">
          <Pattern />
          <Distribution />
          <Rotation />
          <Decay />
        </Group>

        <Group label="Appearance" color="#C96A00">
          <Shapes />
          <Colour />
        </Group>

        <Group label="Frame" color="#7A7470">
          <GridControls />
        </Group>

        <Group label="State" color="#3A3530">
          <PresetManager />
          <Parameters />
        </Group>
      </div>
      <Export svgRef={svgRef} />
    </aside>
  );
}
