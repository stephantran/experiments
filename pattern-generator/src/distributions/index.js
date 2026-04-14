import phyllotaxis from './phyllotaxis.js';
import radial from './radial.js';
import grid from './grid.js';
import fibonacci from './fibonacci.js';
import random from './random.js';
import concentric from './concentric.js';
import spirograph from './spirograph.js';

const distributions = {
  PHYLLOTAXIS: phyllotaxis,
  RADIAL: radial,
  GRID: grid,
  FIBONACCI: fibonacci,
  RANDOM: random,
  CONCENTRIC: concentric,
  SPIROGRAPH: spirograph,
};

export const DISTRIBUTION_KEYS = Object.keys(distributions);

export default distributions;
