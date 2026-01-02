// simulation.js ties together state, rules, rendering, and the animation loop.
// Intent: keep control flow modular so other hosts (e.g., headless tests) can reuse the same logic.

import { FieldState } from './state.js';
import { RuleEngine } from './rules.js';
import { Renderer } from './renderer.js';

export class Simulation {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.state = new FieldState(config);
    this.rules = new RuleEngine(this.state);
    this.renderer = new Renderer(canvas, this.state);
    this.running = false;
    this.#tick = this.#tick.bind(this);
  }

  updateConfig(config) {
    // Reset the sim with new configuration while keeping modules aligned.
    this.config = config;
    this.state.reset(config);
    this.rules.updateConfig(config);
    this.renderer.updateConfig(config);
  }

  start() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame(this.#tick);
  }

  pause() {
    this.running = false;
  }

  step() {
    // One manual step for debugging or slow motion inspection.
    this.rules.performEvents();
    this.renderer.renderFrame();
  }

  #tick() {
    if (!this.running) return;
    this.rules.performEvents();
    this.renderer.renderFrame();
    requestAnimationFrame(this.#tick);
  }
}

// TODO diagnostics: emit per-frame stats so UI can chart drift and boundary counts.
