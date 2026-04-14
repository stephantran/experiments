/**
 * Parse and normalize uploaded SVG files for use as pattern shapes.
 * Security: strips scripts, event handlers, and javascript: URLs.
 */

const DANGEROUS_TAGS = new Set(['script', 'foreignObject']);
const URL_ATTRS = ['href', 'xlink:href'];

export function parseUploadedSvg(text) {
  if (!text || !text.trim()) return { error: 'Empty input' };

  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const err = doc.querySelector('parsererror');
  if (err) return { error: err.textContent.split('\n')[0] };

  const svg = doc.documentElement;
  if (!svg || svg.localName !== 'svg') return { error: 'No <svg> root element' };

  // Sanitize
  sanitize(svg);

  // Get or compute viewBox
  let vb = parseViewBox(svg.getAttribute('viewBox'));
  if (!vb) {
    const w = parseFloat(svg.getAttribute('width')) || 100;
    const h = parseFloat(svg.getAttribute('height')) || 100;
    vb = { x: 0, y: 0, w, h };
  }

  // Normalize to center at 0,0 in a 2x2 space
  const maxDim = Math.max(vb.w, vb.h);
  const scale = 2 / maxDim;
  const offsetX = vb.x + vb.w / 2;
  const offsetY = vb.y + vb.h / 2;

  // Extract inner content as a string
  const serializer = new XMLSerializer();
  const innerParts = [];
  for (const child of svg.childNodes) {
    innerParts.push(serializer.serializeToString(child));
  }

  const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

  return {
    shape: {
      id,
      name: 'Custom',
      svgContent: innerParts.join(''),
      viewBox: vb,
      scale,
      offsetX,
      offsetY,
    },
    error: null,
  };
}

function sanitize(node) {
  const walker = node.ownerDocument.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
  const toRemove = [];
  let current = walker.currentNode;

  while (current) {
    if (DANGEROUS_TAGS.has(current.localName)) {
      toRemove.push(current);
    } else {
      for (const attr of Array.from(current.attributes)) {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();
        if (name.startsWith('on')) current.removeAttribute(attr.name);
        else if (URL_ATTRS.includes(name) && val.startsWith('javascript:'))
          current.removeAttribute(attr.name);
      }
    }
    current = walker.nextNode();
  }

  toRemove.forEach((n) => n.remove());
}

function parseViewBox(str) {
  if (!str) return null;
  const parts = str.trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return null;
  return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
}
