// FieldState manages published values and auxiliary arrays for the simulation.
// Intent: keep state layout explicit so data is easy to introspect and extend.

import { GridGeometry } from './geometry.js';

export class FieldState {
  constructor(config) {
    this.geometry = new GridGeometry(config.width, config.height, config.neighborhoodRadius);
    this.config = config;
    this.frame = 0;
    this.#initBuffers();
  }

  #initBuffers() {
    // Initialize all lattices; this can be re-run on reset.
    const { size } = this.geometry;
    this.spins = new Int8Array(size); // s[i] published field ±1
    this.accumulator = new Float32Array(size); // acc[i] for Triad B
    this.phase = new Uint8Array(size); // p[i] for Triad A (0/1)
    this.pinchScore = new Float32Array(size); // pinchScore[i]
    this.knots = new Float32Array(size); // stores remaining lifetime when knot exists
    this.knotCharge = new Int8Array(size); // ±1 charge-like sign for knots
    this.displayAverage = new Float32Array(size); // low-pass rendering aid
    this.#randomize();
  }

  #randomize() {
    // Seed with random ±1 states to avoid symmetric artifacts.
    const { size } = this.geometry;
    for (let i = 0; i < size; i += 1) {
      this.spins[i] = Math.random() > 0.5 ? 1 : -1;
      this.accumulator[i] = (Math.random() - 0.5) * 0.2; // small random integrator bias
      this.phase[i] = Math.random() > 0.5 ? 1 : 0;
      this.pinchScore[i] = 0;
      this.knots[i] = 0;
      this.knotCharge[i] = 0;
      this.displayAverage[i] = 0;
    }
  }

  reset(config) {
    // Reset state with potentially updated configuration.
    this.config = config;
    this.geometry = new GridGeometry(config.width, config.height, config.neighborhoodRadius);
    this.frame = 0;
    this.#initBuffers();
  }
}

// TODO performance: consider struct-of-arrays layout hints to improve cache use.
