import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_SLIDER_MAXES = {
  count: 6000,
  growth: 15.0,
  spread: 100.0,
  bloom: 360.0,
  speed: 1.0,
};

const DEFAULT_PRESETS = {
  PS2: {
    distribution: 'RADIAL',
    growth: 5.5,
    spread: 15.0,
    bloom: 171.5,
    bgColor: '#E8500A',
    shapeColor: '#FFFFFF',
    selectedShape: 'CIRCLE',
    count: 500,
  },
  PS1: {
    distribution: 'PHYLLOTAXIS',
    growth: 5.5,
    spread: 34.5,
    bloom: 137.5,
    bgColor: '#FFFFFF',
    shapeColor: '#1A1714',
    selectedShape: 'CIRCLE',
    count: 500,
  },
  PC1: {
    distribution: 'PHYLLOTAXIS',
    growth: 5.0,
    spread: 34.3,
    bloom: 137.5,
    bgColor: '#FFFFFF',
    shapeColor: '#1A1714',
    selectedShape: 'ARC',
    count: 300,
  },
  PC2: {
    distribution: 'CONCENTRIC',
    growth: 5.0,
    spread: 20.0,
    bloom: 90.0,
    bgColor: '#FFFFFF',
    shapeColor: '#1A1714',
    selectedShape: 'CIRCLE',
    count: 500,
  },
  SP1: {
    distribution: 'SPIROGRAPH',
    growth: 4.0,
    spread: 37.0,
    bloom: 240.0,
    bgColor: '#1A1714',
    shapeColor: '#E8500A',
    selectedShape: 'CIRCLE_FILLED',
    count: 800,
  },
};

const useAppStore = create(persist((set, get) => ({
  // Canvas
  canvas: { width: 600, height: 600, zoom: 1, panX: 0, panY: 0 },

  // Slider max caps (user-configurable)
  sliderMaxes: { ...DEFAULT_SLIDER_MAXES },

  // Pattern
  distribution: 'PHYLLOTAXIS',
  growth: 2.3,
  spread: 14.0,
  bloom: 171.5,
  count: 4850,

  // Decay
  decayAmount: 1.0,
  decayCurve: 'PULSE',
  decayInvert: false,

  // Rotation
  rotationMode: 'FOLLOW', // 'FOLLOW' | 'FIXED'
  rotationAngle: 0,

  // Grid
  gridVisible: false,
  gridCols: 12,
  gridRows: 12,

  // Color
  bgColor: '#E8500A',
  shapeColor: '#FFFFFF',

  // Shape
  selectedShape: 'HEX',
  savedShapes: [],

  // Animation
  playing: false,
  speed: 0.01,
  animatingParam: null,
  baseBloom: 171.5,

  // Presets
  activePreset: 'PS2',
  presets: DEFAULT_PRESETS,
  userPresets: [], // [{ id, name, state }]

  // Interpolation
  _animFrame: null,

  // Actions — Slider maxes
  setSliderMax: (key, value) =>
    set((s) => ({ sliderMaxes: { ...s.sliderMaxes, [key]: value } })),

  // Actions — Pattern
  setGrowth: (v) => set({ growth: v }),
  setSpread: (v) => set({ spread: v }),
  setBloom: (v) => set({ bloom: v, baseBloom: v }),
  setCount: (v) => set({ count: v }),
  setDistribution: (d) => set({ distribution: d }),

  // Actions — Color
  setBgColor: (c) => set({ bgColor: c }),
  setShapeColor: (c) => set({ shapeColor: c }),

  // Actions — Shape
  setShape: (s) => set({ selectedShape: s }),

  // Actions — Animation
  setPlaying: (p) => set({ playing: p }),
  setSpeed: (s) => set({ speed: s }),
  setAnimatingParam: (p) => set({ animatingParam: p }),

  // Actions — Decay
  setDecayAmount: (v) => set({ decayAmount: v }),
  setDecayCurve: (v) => set({ decayCurve: v }),
  setDecayInvert: (v) => set({ decayInvert: v }),

  // Actions — Rotation
  setRotationMode: (v) => set({ rotationMode: v }),
  setRotationAngle: (v) => set({ rotationAngle: v }),

  // Actions — Grid
  setGridVisible: (v) => set({ gridVisible: v }),
  setGridCols: (v) => set({ gridCols: v }),
  setGridRows: (v) => set({ gridRows: v }),

  // Actions — Canvas
  setCanvasZoom: (zoom) => set((s) => ({ canvas: { ...s.canvas, zoom } })),
  setCanvasPan: (panX, panY) => set((s) => ({ canvas: { ...s.canvas, panX, panY } })),
  resetCanvas: () => set((s) => ({ canvas: { ...s.canvas, zoom: 1, panX: 0, panY: 0 } })),

  // Actions — Presets
  loadPreset: (name) => {
    const state = get();
    const preset = state.presets[name];
    if (!preset) return;

    // Cancel any existing interpolation
    if (state._animFrame) cancelAnimationFrame(state._animFrame);

    // Switch non-numeric immediately
    set({
      distribution: preset.distribution,
      selectedShape: preset.selectedShape,
      activePreset: name,
    });

    // Interpolate numeric values
    const start = {
      growth: state.growth,
      spread: state.spread,
      bloom: state.bloom,
      count: state.count,
      bgColorR: parseInt(state.bgColor.slice(1, 3), 16),
      bgColorG: parseInt(state.bgColor.slice(3, 5), 16),
      bgColorB: parseInt(state.bgColor.slice(5, 7), 16),
      shapeColorR: parseInt(state.shapeColor.slice(1, 3), 16),
      shapeColorG: parseInt(state.shapeColor.slice(3, 5), 16),
      shapeColorB: parseInt(state.shapeColor.slice(5, 7), 16),
    };
    const end = {
      growth: preset.growth,
      spread: preset.spread,
      bloom: preset.bloom,
      count: preset.count ?? 500,
      bgColorR: parseInt(preset.bgColor.slice(1, 3), 16),
      bgColorG: parseInt(preset.bgColor.slice(3, 5), 16),
      bgColorB: parseInt(preset.bgColor.slice(5, 7), 16),
      shapeColorR: parseInt(preset.shapeColor.slice(1, 3), 16),
      shapeColorG: parseInt(preset.shapeColor.slice(3, 5), 16),
      shapeColorB: parseInt(preset.shapeColor.slice(5, 7), 16),
    };

    const duration = 400;
    const startTime = performance.now();

    const lerp = (a, b, t) => a + (b - a) * t;
    const toHex = (r, g, b) =>
      '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      set({
        growth: lerp(start.growth, end.growth, ease),
        spread: lerp(start.spread, end.spread, ease),
        bloom: lerp(start.bloom, end.bloom, ease),
        count: Math.round(lerp(start.count, end.count, ease)),
        baseBloom: lerp(start.bloom, end.bloom, ease),
        bgColor: toHex(
          lerp(start.bgColorR, end.bgColorR, ease),
          lerp(start.bgColorG, end.bgColorG, ease),
          lerp(start.bgColorB, end.bgColorB, ease)
        ),
        shapeColor: toHex(
          lerp(start.shapeColorR, end.shapeColorR, ease),
          lerp(start.shapeColorG, end.shapeColorG, ease),
          lerp(start.shapeColorB, end.shapeColorB, ease)
        ),
      });

      if (t < 1) {
        const frame = requestAnimationFrame(animate);
        set({ _animFrame: frame });
      } else {
        set({ _animFrame: null });
      }
    };

    const frame = requestAnimationFrame(animate);
    set({ _animFrame: frame });
  },

  savePreset: (name) => {
    const state = get();
    set({
      presets: {
        ...state.presets,
        [name]: {
          distribution: state.distribution,
          growth: state.growth,
          spread: state.spread,
          bloom: state.bloom,
          bgColor: state.bgColor,
          shapeColor: state.shapeColor,
          selectedShape: state.selectedShape,
          count: state.count,
        },
      },
    });
  },

  // Actions — Saved shapes
  addSavedShape: (shape) =>
    set((s) => {
      const shapes = [...s.savedShapes, shape];
      localStorage.setItem('form-saved-shapes', JSON.stringify(shapes));
      return { savedShapes: shapes };
    }),
  removeSavedShape: (id) =>
    set((s) => {
      const shapes = s.savedShapes.filter((sh) => sh.id !== id);
      localStorage.setItem('form-saved-shapes', JSON.stringify(shapes));
      return { savedShapes: shapes };
    }),
  hydrateSavedShapes: () => {
    try {
      const raw = localStorage.getItem('form-saved-shapes');
      if (raw) set({ savedShapes: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  },

  // Actions — Serialize / Deserialize state for JSON IO
  serializeState: () => {
    const s = get();
    return {
      distribution: s.distribution,
      growth: s.growth,
      spread: s.spread,
      bloom: s.bloom,
      count: s.count,
      decayAmount: s.decayAmount,
      decayCurve: s.decayCurve,
      decayInvert: s.decayInvert,
      rotationMode: s.rotationMode,
      rotationAngle: s.rotationAngle,
      bgColor: s.bgColor,
      shapeColor: s.shapeColor,
      selectedShape: s.selectedShape,
      gridVisible: s.gridVisible,
      gridCols: s.gridCols,
      gridRows: s.gridRows,
    };
  },

  applySerializedState: (obj) => {
    if (!obj || typeof obj !== 'object') return { ok: false, error: 'Invalid input' };
    const allowedKeys = [
      'distribution', 'growth', 'spread', 'bloom', 'count',
      'decayAmount', 'decayCurve', 'decayInvert',
      'rotationMode', 'rotationAngle',
      'bgColor', 'shapeColor', 'selectedShape',
      'gridVisible', 'gridCols', 'gridRows',
    ];
    const patch = {};
    for (const k of allowedKeys) {
      if (k in obj) patch[k] = obj[k];
    }
    if ('bloom' in patch) patch.baseBloom = patch.bloom;
    patch.activePreset = null;
    set(patch);
    return { ok: true };
  },

  // Actions — User presets (persisted to localStorage)
  saveUserPreset: (name) => {
    const state = get();
    const snapshot = get().serializeState();
    const id = 'up-' + Date.now();
    const entry = { id, name: name || 'Untitled', state: snapshot };
    const next = [...state.userPresets, entry];
    localStorage.setItem('form-user-presets', JSON.stringify(next));
    set({ userPresets: next });
    return entry;
  },

  loadUserPreset: (id) => {
    const state = get();
    const preset = state.userPresets.find((p) => p.id === id);
    if (!preset) return;
    get().applySerializedState(preset.state);
  },

  deleteUserPreset: (id) => {
    const state = get();
    const next = state.userPresets.filter((p) => p.id !== id);
    localStorage.setItem('form-user-presets', JSON.stringify(next));
    set({ userPresets: next });
  },

  hydrateUserPresets: () => {
    try {
      const raw = localStorage.getItem('form-user-presets');
      if (raw) set({ userPresets: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  },
}), {
  name: 'form-ui-state',
  version: 1,
  partialize: (s) => ({
    distribution: s.distribution,
    growth: s.growth,
    spread: s.spread,
    bloom: s.bloom,
    count: s.count,
    baseBloom: s.baseBloom,
    decayAmount: s.decayAmount,
    decayCurve: s.decayCurve,
    decayInvert: s.decayInvert,
    rotationMode: s.rotationMode,
    rotationAngle: s.rotationAngle,
    bgColor: s.bgColor,
    shapeColor: s.shapeColor,
    selectedShape: s.selectedShape,
    gridVisible: s.gridVisible,
    gridCols: s.gridCols,
    gridRows: s.gridRows,
    speed: s.speed,
    sliderMaxes: s.sliderMaxes,
    activePreset: s.activePreset,
  }),
}));

export default useAppStore;
