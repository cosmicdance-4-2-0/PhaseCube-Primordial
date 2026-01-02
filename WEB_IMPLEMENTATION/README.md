# PhaseCube Field — Web Implementation

This folder hosts a minimal, browser-runnable version of the PhaseCube design described in the root `README.md`. The implementation favors modularity and clarity over raw performance so future agents (or humans) can swap components without disturbing the architecture.

## Running

Open `index.html` in a modern browser with JavaScript modules enabled. No build step is required.

## Files

- `index.html` — page layout and control surface.
- `src/config.js` — tunable parameters with labeled defaults.
- `src/simulation.js` — event-driven lattice core implementing Triad A/B, shedding, and pinch/knot logic.
- `src/renderer.js` — canvas-based renderer (can be swapped for WebGL or SVG).
- `src/ui.js` — minimal UI bindings and observer hooks.
- `src/main.js` — wiring between simulation, renderer, and UI.

## Notes

- Click the field to inject bias at a cell.
- Switch Triad mode to compare the sigma-delta carrier against the parity mediator.
- Inspect comments for TODO markers outlining expansion points (e.g., presets, knot lifecycle, advanced diagnostics).
