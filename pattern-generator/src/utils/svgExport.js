/**
 * Export the canvas SVG as a downloadable .svg file.
 */
export function exportSvg(svgElement) {
  if (!svgElement) return;

  const clone = svgElement.cloneNode(true);

  // Remove grid overlay if present
  const grid = clone.querySelector('[data-grid]');
  if (grid) grid.remove();

  // Remove React-injected attributes
  clone.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('data-reactroot') || attr.name.startsWith('data-reactid')) {
        el.removeAttribute(attr.name);
      }
    }
  });

  // Ensure proper namespace
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  clone.setAttribute('width', '800');
  clone.setAttribute('height', '800');

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const timestamp = Date.now();
  const a = document.createElement('a');
  a.href = url;
  a.download = `form-pattern-${timestamp}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
