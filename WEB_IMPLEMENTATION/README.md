# PhaseCube Field — Web Implementation

This subdirectory hosts a minimal, browser-runnable implementation of the PhaseCube Field design described in the root `README.md`. The goal is to keep the code modular, well-commented, and easy to tweak for future experiments.

## Structure

- `index.html` — single-page host with controls and canvas.
- `style.css` — light styling to keep the UI readable without getting in the way of the field.
- `src/config.js` — central, labeled defaults so tuning is discoverable.
- `src/geometry.js` — grid topology helpers (toroidal by default).
- `src/state.js` — lattice buffers and reset logic.
- `src/rules.js` — local event rules, shedding behavior, and knot backreaction.
- `src/renderer.js` — canvas drawing with low-pass blending for ternary-like visuals.
- `src/simulation.js` — orchestrates state, rules, and rendering.
- `src/main.js` — wires DOM controls to the simulation.

## Running

Open `index.html` in a modern browser. No build step is required. Adjust parameters in the sidebar and hit **Start** to animate. **Reset** will apply any new dimension or event count settings.

## Notes for iteration

- The rule engine is deliberately simple; swap in new local rules inside `src/rules.js` without touching UI or rendering layers.
- Add new controls in `index.html` and pass values through `src/main.js` into `defaultConfig` copies.
- Rendering is intentionally basic; overlays (pinch/knot markers, boundary heatmaps) can be layered into `renderer.js`.

<!-- TODO docs: add GIFs or screenshots of interesting regimes once the rule set stabilizes. -->
