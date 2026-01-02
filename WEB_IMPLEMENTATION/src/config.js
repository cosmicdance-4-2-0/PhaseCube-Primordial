// Configuration defaults for the PhaseCube Field web implementation.
// Intent: Keep parameters discoverable and editable so that users can tweak behavior without hunting through code.

export const defaultConfig = Object.freeze({
  width: 120, // default grid width based on design document POC defaults
  height: 120, // default grid height
  neighborhoodRadius: 2, // radius r = 2 → 5x5 neighborhood excluding center
  eventsPerFrame: 600, // number of local events per render frame
  triadMode: 'carrier', // 'carrier' (Triad B) or 'phase' (Triad A)
  asyncInPlace: true, // whether to read latest values instead of a snapshot
  carrierGain: 0.08, // influence strength when pushing accumulator
  carrierDumpFraction: 0.35, // fraction of accumulator to shed on stress
  phaseFlipChance: 0.35, // probability to flip phase when stressed
  stressEdgeThreshold: 10, // disagreement threshold to trigger shedding
  stressSumTolerance: 4, // tolerance window around zero sum considered ambiguous
  pinchIncrement: 1.0, // how much pinchScore grows per stressed event
  pinchDecay: 0.1, // passive decay rate per frame
  pinchThreshold: 12, // level needed to nucleate a knot-like boundary
  knotLifetime: 900, // frames before a knot naturally decays
  knotChargeBias: 0.15, // small local bias knots apply to nearby cells
  knotRadius: 2, // influence radius for knots
  render: {
    cellSize: 4, // pixel size per cell on canvas
    showGrid: false, // whether to draw grid lines (kept false for performance)
    fade: 0.1, // blending factor for display smoothing
  },
});

// TODO scalability: expose config persistence (e.g., query params) so users can share setups.
