// Configuration defaults for the PhaseCube web implementation.
// Intent: keep every parameter labeled and easy to tweak for experimentation.
// TODO expand presets for different experimental modes (plasma-like, knot-heavy, calm drift).
export const defaultConfig = {
  // Grid geometry
  gridWidth: 120, // number of columns in the toroidal lattice
  gridHeight: 120, // number of rows in the toroidal lattice

  // Neighborhood and event cadence
  neighborhoodRadius: 2, // radius r => (2r+1)^2 - 1 neighbors
  eventsPerFrame: 600, // number of random local events between renders
  useSnapshotReads: false, // read from a per-frame snapshot for interpretability

  // Triad modes
  triadMode: 'carrier', // 'carrier' (Triad B) or 'phase' (Triad A)
  triadPhaseFlipBias: 0.1, // probability of flipping phase in ambiguous zones
  triadCarrierGain: 0.6, // quantizer feedback q in sigma-delta form
  triadCarrierLeak: 0.002, // leakage term to keep integrators bounded
  triadCarrierDrive: 0.08, // scaling for neighbor influence into accumulator

  // Ambiguity and noise handling
  ambiguityBand: 4, // neighborhood sum magnitude under which ambiguity is assumed
  ambiguityNoise: 0.05, // noise injected during ambiguity to avoid deadlock

  // Stress + anti-singularity shedding
  stressEdgeWeight: 1.0, // weight for edge density in stress score
  stressAccumulatorWeight: 0.15, // weight for |acc| in stress score (Triad B)
  stressThreshold: 14, // when exceeded, trigger shedding/redistribution
  sheddingFraction: 0.35, // fraction of accumulator shed into neighbors

  // Pinch / knot detection
  pinchEdgeThreshold: 8, // edge density threshold to consider a pinch
  pinchMixThreshold: 0.25, // minimum mix ratio (both signs present) to count
  pinchPersistence: 6, // number of consecutive detections required
  knotInfluenceRadius: 3, // neighborhood size for knot backreaction
  enableKnotNucleation: true, // allow pinch points to create knots

  // Rendering
  renderScale: 4, // pixel scale for canvas upscaling
  zeroColor: [40, 40, 40], // RGB for neutral visualization
  posColor: [80, 180, 255], // RGB for +1 pulses
  negColor: [255, 80, 140], // RGB for -1 pulses
  knotColor: [255, 230, 120], // RGB for knots overlay

  // Observer / UI interaction
  injectionStrength: 1.5, // bias added to accumulator/phase via clicks
};

// Utility helper for easy cloning so the UI can mutate copies safely.
export function cloneConfig(overrides = {}) {
  // TODO add preset lookup by name when more scenarios are added.
  return { ...defaultConfig, ...overrides };
}
