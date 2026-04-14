/**
 * Export the canvas SVG as a downloadable .png file at 2x resolution.
 */
export function exportPng(svgElement, scale = 2) {
  if (!svgElement) return;

  const clone = svgElement.cloneNode(true);

  // Remove grid overlay if present
  const grid = clone.querySelector('[data-grid]');
  if (grid) grid.remove();

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '800');
  clone.setAttribute('height', '800');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800 * scale;
    canvas.height = 800 * scale;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const timestamp = Date.now();
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-pattern-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };
  img.src = svgDataUrl;
}
