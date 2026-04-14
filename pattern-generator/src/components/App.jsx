import { useRef } from 'react';
import Canvas from './Canvas';
import Sidebar from './Sidebar';
import styles from './App.module.css';

export default function App() {
  const svgRef = useRef(null);

  return (
    <div className={styles.app}>
      <Canvas svgRef={svgRef} />
      <Sidebar svgRef={svgRef} />
    </div>
  );
}
