// Entry point for the PhaseCube web implementation.
// Intent: wire together simulation, renderer, and UI while keeping each swappable.
import { cloneConfig } from './config.js';
import { PhaseCubeSimulation } from './simulation.js';
import { CanvasRenderer } from './renderer.js';
import { UiController } from './ui.js';

const config = cloneConfig();

function boot() {
  const canvas = document.getElementById('phasecube-canvas');
  const sim = new PhaseCubeSimulation(config);
  const renderer = new CanvasRenderer(canvas, config);
  const ui = new UiController(sim, renderer, config);

  let lastTime = performance.now();

  function frame(now) {
    const delta = now - lastTime;
    lastTime = now;

    if (ui.running) {
      sim.step();
    }

    renderer.render(sim);
    ui.renderDiagnostics();

    // TODO surface delta for adaptive event counts or slow-motion mode.
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

document.addEventListener('DOMContentLoaded', boot);
