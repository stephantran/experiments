/**
 * Shape primitives rendered in a normalized 20x20 space centered at 0,0.
 * Each shape renderer accepts a color and stroke width (in normalized units).
 */

export const SHAPES = {
  CIRCLE: {
    label: 'Circle',
    icon: '○',
    render: (color, sw = 0.3) => (
      <circle cx="0" cy="0" r="1" fill="none" stroke={color} strokeWidth={sw} />
    ),
  },
  CIRCLE_FILLED: {
    label: 'Circle Filled',
    icon: '●',
    render: (color) => <circle cx="0" cy="0" r="1" fill={color} />,
  },
  SQUARE: {
    label: 'Square',
    icon: '□',
    render: (color, sw = 0.3) => (
      <rect
        x="-0.8"
        y="-0.8"
        width="1.6"
        height="1.6"
        fill="none"
        stroke={color}
        strokeWidth={sw}
      />
    ),
  },
  TRIANGLE: {
    label: 'Triangle',
    icon: '△',
    render: (color, sw = 0.3) => (
      <polygon
        points="0,-1 0.866,0.5 -0.866,0.5"
        fill="none"
        stroke={color}
        strokeWidth={sw}
      />
    ),
  },
  ARC: {
    label: 'Arc',
    icon: '◷',
    render: (color, sw = 0.5) => (
      <path
        d="M 0.966 0.259 A 1 1 0 1 0 0.259 0.966"
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
      />
    ),
  },
  CROSS: {
    label: 'Cross',
    icon: '+',
    render: (color, sw = 0.3) => (
      <g stroke={color} strokeWidth={sw} strokeLinecap="round">
        <line x1="-0.8" y1="0" x2="0.8" y2="0" />
        <line x1="0" y1="-0.8" x2="0" y2="0.8" />
      </g>
    ),
  },
  HEX: {
    label: 'Hex',
    icon: '⬡',
    render: (color, sw = 0.3) => {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        return `${Math.cos(angle).toFixed(3)},${Math.sin(angle).toFixed(3)}`;
      }).join(' ');
      return (
        <polygon points={pts} fill="none" stroke={color} strokeWidth={sw} />
      );
    },
  },
};

export const SHAPE_KEYS = Object.keys(SHAPES);
