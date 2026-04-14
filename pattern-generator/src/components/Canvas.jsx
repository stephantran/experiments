import { useMemo, useEffect, useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import distributions from '../distributions/index';
import { SHAPES } from '../shapes.jsx';
import { applyDecay } from '../utils/decay';
import styles from './Canvas.module.css';

const MAX_ELEMENTS = 6000;

export default function Canvas({ svgRef }) {
  const bgColor = useAppStore((s) => s.bgColor);
  const shapeColor = useAppStore((s) => s.shapeColor);
  const distribution = useAppStore((s) => s.distribution);
  const growth = useAppStore((s) => s.growth);
  const spread = useAppStore((s) => s.spread);
  const bloom = useAppStore((s) => s.bloom);
  const count = useAppStore((s) => s.count);
  const decayAmount = useAppStore((s) => s.decayAmount);
  const decayCurve = useAppStore((s) => s.decayCurve);
  const decayInvert = useAppStore((s) => s.decayInvert);
  const rotationMode = useAppStore((s) => s.rotationMode);
  const rotationAngle = useAppStore((s) => s.rotationAngle);
  const selectedShape = useAppStore((s) => s.selectedShape);
  const playing = useAppStore((s) => s.playing);
  const speed = useAppStore((s) => s.speed);
  const baseBloom = useAppStore((s) => s.baseBloom);
  const canvas = useAppStore((s) => s.canvas);
  const setCanvasZoom = useAppStore((s) => s.setCanvasZoom);
  const setCanvasPan = useAppStore((s) => s.setCanvasPan);
  const resetCanvas = useAppStore((s) => s.resetCanvas);

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    let frame;
    let t = 0;
    const setBloomDirect = (v) => useAppStore.setState({ bloom: v });

    const loop = () => {
      t += speed * 0.1;
      const newBloom = baseBloom + Math.sin(t) * (baseBloom * 0.15);
      setBloomDirect(Math.max(0, Math.min(360, newBloom)));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, baseBloom]);

  const points = useMemo(() => {
    const distFn = distributions[distribution];
    if (!distFn) return [];
    const safeCount = Math.min(MAX_ELEMENTS, Math.max(10, Math.round(count)));
    return distFn({ count: safeCount, growth, spread, bloom, canvasSize: 800 });
  }, [distribution, growth, spread, bloom, count]);

  const savedShapes = useAppStore((s) => s.savedShapes);
  const builtInShape = SHAPES[selectedShape];
  const customShape = !builtInShape
    ? savedShapes.find((s) => s.id === selectedShape)
    : null;

  const renderShapeContent = (color) => {
    if (builtInShape) return builtInShape.render(color);
    if (customShape) {
      return (
        <g
          transform={`scale(${customShape.scale}) translate(${-customShape.offsetX}, ${-customShape.offsetY})`}
          dangerouslySetInnerHTML={{ __html: customShape.svgContent }}
        />
      );
    }
    return SHAPES.CIRCLE.render(color);
  };

  const gridVisible = useAppStore((s) => s.gridVisible);
  const gridCols = useAppStore((s) => s.gridCols);
  const gridRows = useAppStore((s) => s.gridRows);

  const gridLines = useMemo(() => {
    if (!gridVisible) return null;
    const lines = [];
    for (let c = 1; c < gridCols; c++) {
      const x = (c / gridCols) * 800;
      lines.push(
        <line key={`col-${c}`} x1={x} y1={0} x2={x} y2={800} stroke="#D0CBC2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
      );
    }
    for (let r = 1; r < gridRows; r++) {
      const y = (r / gridRows) * 800;
      lines.push(
        <line key={`row-${r}`} x1={0} y1={y} x2={800} y2={y} stroke="#D0CBC2" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
      );
    }
    lines.push(
      <line key="cx" x1={400} y1={0} x2={400} y2={800} stroke="#B0ABA6" strokeWidth="0.8" opacity="0.5" />,
      <line key="cy" x1={0} y1={400} x2={800} y2={400} stroke="#B0ABA6" strokeWidth="0.8" opacity="0.5" />
    );
    return lines;
  }, [gridVisible, gridCols, gridRows]);

  // Zoom/pan
  const viewBoxSize = 800 / canvas.zoom;
  const vbX = (800 - viewBoxSize) / 2 - canvas.panX;
  const vbY = (800 - viewBoxSize) / 2 - canvas.panY;
  const viewBox = `${vbX} ${vbY} ${viewBoxSize} ${viewBoxSize}`;

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(4, canvas.zoom * delta));
    setCanvasZoom(newZoom);
  }, [canvas.zoom, setCanvasZoom]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPanX = canvas.panX;
    const startPanY = canvas.panY;
    const scaleFactor = viewBoxSize / (svgRef.current?.clientWidth || 800);

    const handleMouseMove = (me) => {
      const dx = (me.clientX - startX) * scaleFactor;
      const dy = (me.clientY - startY) * scaleFactor;
      setCanvasPan(startPanX + dx, startPanY + dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [canvas.panX, canvas.panY, viewBoxSize, setCanvasPan, svgRef]);

  const handleDoubleClick = useCallback(() => {
    resetCanvas();
  }, [resetCanvas]);

  const zoomPercent = Math.round(canvas.zoom * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <svg
          ref={svgRef}
          className={styles.svg}
          viewBox={viewBox}
          xmlns="http://www.w3.org/2000/svg"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <rect id="bg" x={vbX} y={vbY} width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
          <g id="pattern-group">
            {(() => {
              // Compute max distance from center once per render so decay normalization
              // is based on actual radial extent, not sequence order.
              const cx = 400;
              const cy = 400;
              let maxD = 1;
              for (const p of points) {
                const d = Math.hypot(p.x - cx, p.y - cy);
                if (d > maxD) maxD = d;
              }
              return points.map((pt, i) => {
                const d = Math.hypot(pt.x - cx, pt.y - cy);
                const t = d / maxD;
                const decayMul = applyDecay(t, decayCurve, decayAmount, decayInvert);
                const finalScale = pt.scale * decayMul;
                if (finalScale <= 0.001) return null;
                const rot = rotationMode === 'FIXED' ? rotationAngle : pt.rotation;
                return (
                  <g
                    key={i}
                    transform={`translate(${pt.x}, ${pt.y}) rotate(${rot}) scale(${finalScale})`}
                  >
                    {renderShapeContent(shapeColor)}
                  </g>
                );
              });
            })()}
          </g>
          {gridVisible && (
            <g data-grid="true">
              {gridLines}
            </g>
          )}
        </svg>
        <div className={styles.zoomLabel}>{zoomPercent}%</div>
      </div>
    </div>
  );
}
