// PhaseCube simulation core.
// Intent: event-driven lattice with pluggable triad modes and knot/anti-singularity behaviors.
import { clamp } from './utils.js';

export class PhaseCubeSimulation {
  constructor(config, rng = Math.random) {
    // TODO allow dependency injection for deterministic testing.
    this.config = config;
    this.rng = rng;
    this.width = config.gridWidth;
    this.height = config.gridHeight;
    this.size = this.width * this.height;

    // Primary published state (+1/-1 pulses).
    this.state = new Int8Array(this.size);
    // Triad variables.
    this.phase = new Int8Array(this.size); // used when triadMode === 'phase'
    this.accumulator = new Float32Array(this.size); // used when triadMode === 'carrier'
    // Pinch tracking for knot gating.
    this.pinchScore = new Uint16Array(this.size);
    // Knot registry.
    this.knots = [];

    // Neighborhood offsets precomputed for speed and clarity.
    this.neighborOffsets = this.#computeNeighborOffsets(config.neighborhoodRadius);

    this.reset();
  }

  reset() {
    // Seed published state randomly to avoid trivial symmetry.
    for (let i = 0; i < this.size; i += 1) {
      this.state[i] = this.rng() > 0.5 ? 1 : -1;
      this.phase[i] = this.rng() > 0.5 ? 1 : 0; // treat 1 as phase bit set
      this.accumulator[i] = (this.rng() - 0.5) * 2; // small bias
      this.pinchScore[i] = 0;
    }
    this.knots = [];
  }

  // Main step called once per render frame.
  step() {
    const { eventsPerFrame, useSnapshotReads } = this.config;

    // Snapshot captures the state at frame start, improving interpretability.
    const snapshot = useSnapshotReads ? this.state.slice() : this.state;

    for (let n = 0; n < eventsPerFrame; n += 1) {
      const idx = Math.floor(this.rng() * this.size);
      this.#updateCell(idx, snapshot);
    }

    // TODO add optional scheduled diagnostics per frame.
  }

  injectAt(x, y, strength) {
    // Allow observer inputs (e.g., user clicks) to bias local dynamics.
    const idx = this.#index(x, y);
    if (this.config.triadMode === 'carrier') {
      this.accumulator[idx] += strength;
    } else {
      // In phase mode, toggle the phase bit as a simple intervention.
      this.phase[idx] = this.phase[idx] === 1 ? 0 : 1;
    }
  }

  getDiagnostics() {
    // Compute human-friendly live metrics.
    let edgeCount = 0;
    let flipPotential = 0;
    for (let i = 0; i < this.size; i += 1) {
      const { edgeDensity } = this.#neighborStats(i, this.state);
      edgeCount += edgeDensity;
      flipPotential += Math.abs(this.accumulator[i]);
    }
    const boundaryLength = edgeCount / this.neighborOffsets.length;
    return {
      boundaryLength: boundaryLength.toFixed(1),
      meanAccumulator: (flipPotential / this.size).toFixed(3),
      knotCount: this.knots.length,
    };
  }

  #updateCell(idx, snapshot) {
    const { triadMode } = this.config;
    if (triadMode === 'carrier') {
      this.#updateCarrier(idx, snapshot);
    } else {
      this.#updatePhase(idx, snapshot);
    }
  }

  #updateCarrier(idx, snapshot) {
    const {
      triadCarrierGain,
      triadCarrierLeak,
      triadCarrierDrive,
      ambiguityBand,
      ambiguityNoise,
      stressThreshold,
      sheddingFraction,
      stressEdgeWeight,
      stressAccumulatorWeight,
      pinchPersistence,
      enableKnotNucleation,
      pinchEdgeThreshold,
      pinchMixThreshold,
    } = this.config;

    const cellState = snapshot[idx];
    const stats = this.#neighborStats(idx, snapshot);
    const { sum, edgeDensity, mixRatio } = stats;

    // Apply knot backreaction as local bias.
    const backreaction = this.#knotBias(idx);

    // Convert neighborhood influence into accumulator drive.
    let drive = triadCarrierDrive * sum + backreaction;

    // When ambiguous, inject dither to avoid perfect lock.
    if (Math.abs(sum) <= ambiguityBand) {
      drive += (this.rng() - 0.5) * 2 * ambiguityNoise;
    }

    // Integrate with leakage and quantizer feedback.
    const accBefore = this.accumulator[idx];
    let acc = accBefore + drive - triadCarrierGain * cellState - Math.sign(accBefore) * triadCarrierLeak;
    this.accumulator[idx] = acc;

    // Publish 1-bit pulse.
    const nextState = acc >= 0 ? 1 : -1;
    this.state[idx] = nextState;

    // Stress-based shedding: redistribute part of accumulator when stressed.
    const stress = edgeDensity * stressEdgeWeight + Math.abs(acc) * stressAccumulatorWeight;
    if (stress > stressThreshold) {
      this.#redistribute(idx, acc * sheddingFraction, snapshot, stats);
      // Bleed the accumulator to avoid runaway.
      this.accumulator[idx] = acc * (1 - sheddingFraction);
    }

    // Pinch tracking → knot nucleation.
    this.#updatePinch(idx, edgeDensity, mixRatio, pinchEdgeThreshold, pinchMixThreshold, pinchPersistence);
    if (enableKnotNucleation) {
      this.#maybeNucleateKnot(idx);
    }
  }

  #updatePhase(idx, snapshot) {
    const {
      triadPhaseFlipBias,
      ambiguityBand,
      ambiguityNoise,
      stressThreshold,
      sheddingFraction,
      stressEdgeWeight,
      stressAccumulatorWeight,
      pinchPersistence,
      enableKnotNucleation,
      pinchEdgeThreshold,
      pinchMixThreshold,
    } = this.config;

    const cellState = snapshot[idx];
    const stats = this.#neighborStats(idx, snapshot);
    const { sum, edgeDensity, mixRatio } = stats;

    let nextState = cellState;

    if (Math.abs(sum) <= ambiguityBand) {
      // Use the phase bit to resolve ambiguity, optionally flipping to spread relief.
      const flip = this.rng() < triadPhaseFlipBias;
      if (flip) {
        this.phase[idx] = this.phase[idx] === 1 ? 0 : 1;
      }
      const phaseDrive = this.phase[idx] === 1 ? 1 : -1;
      const noise = (this.rng() - 0.5) * 2 * ambiguityNoise;
      nextState = Math.sign(sum + phaseDrive + noise) || cellState;
    } else {
      nextState = sum > 0 ? 1 : -1;
    }

    this.state[idx] = nextState;

    // Reuse accumulator array to track pseudo-stress for parity with carrier mode.
    const acc = this.accumulator[idx] + (nextState - cellState);
    this.accumulator[idx] = clamp(acc, -32, 32);

    const stress = edgeDensity * stressEdgeWeight + Math.abs(acc) * stressAccumulatorWeight;
    if (stress > stressThreshold) {
      // Phase mode shedding: emit paired disturbances by toggling neighbors.
      this.#phaseShedding(idx, snapshot);
      this.accumulator[idx] = acc * (1 - sheddingFraction);
    }

    this.#updatePinch(idx, edgeDensity, mixRatio, pinchEdgeThreshold, pinchMixThreshold, pinchPersistence);
    if (enableKnotNucleation) {
      this.#maybeNucleateKnot(idx);
    }
  }

  #neighborStats(idx, sourceState) {
    // Aggregate neighborhood influences and edge density.
    const { neighborOffsets, width, height } = this;
    const state = sourceState;
    const center = state[idx];
    let sum = 0;
    let edgeDensity = 0;
    let positives = 0;
    let negatives = 0;

    for (let i = 0; i < neighborOffsets.length; i += 1) {
      const offset = neighborOffsets[i];
      const neighborIdx = this.#wrapIndex(idx + offset);
      const neighborValue = state[neighborIdx];
      sum += neighborValue;
      if (neighborValue !== center) {
        edgeDensity += 1;
      }
      if (neighborValue > 0) positives += 1; else negatives += 1;
    }

    const totalNeighbors = neighborOffsets.length;
    const mixRatio = Math.min(positives, negatives) / totalNeighbors;

    return { sum, edgeDensity, mixRatio, width, height };
  }

  #redistribute(idx, amount, snapshot, stats) {
    // Push part of the accumulator into neighbors along gradients.
    // TODO experiment with directional bias that tracks historical flow.
    const { neighborOffsets } = this;
    const base = snapshot[idx];
    let weightSum = 0;
    const weights = new Float32Array(neighborOffsets.length);

    for (let i = 0; i < neighborOffsets.length; i += 1) {
      const offset = neighborOffsets[i];
      const neighborIdx = this.#wrapIndex(idx + offset);
      const neighborState = snapshot[neighborIdx];
      // Prefer sending toward disagreement to relieve stress.
      const weight = neighborState === base ? 0.5 : 1.0;
      weights[i] = weight;
      weightSum += weight;
    }

    if (weightSum === 0) return;
    const normalized = amount / weightSum;

    for (let i = 0; i < neighborOffsets.length; i += 1) {
      const offset = neighborOffsets[i];
      const neighborIdx = this.#wrapIndex(idx + offset);
      this.accumulator[neighborIdx] += normalized * weights[i];
    }
  }

  #phaseShedding(idx, snapshot) {
    // Flip a pair of neighbors to emit a local relief wave.
    // TODO allow configurable radial spread for phase shocks.
    const { neighborOffsets } = this;
    if (neighborOffsets.length < 2) return;
    const a = neighborOffsets[Math.floor(this.rng() * neighborOffsets.length)];
    let b = neighborOffsets[Math.floor(this.rng() * neighborOffsets.length)];
    if (b === a && neighborOffsets.length > 1) {
      b = neighborOffsets[(neighborOffsets.indexOf(a) + 1) % neighborOffsets.length];
    }
    const idxA = this.#wrapIndex(idx + a);
    const idxB = this.#wrapIndex(idx + b);
    this.state[idxA] = -this.state[idxA];
    this.state[idxB] = -this.state[idxB];
  }

  #updatePinch(idx, edgeDensity, mixRatio, edgeThreshold, mixThreshold, persistence) {
    if (edgeDensity >= edgeThreshold && mixRatio >= mixThreshold) {
      this.pinchScore[idx] = Math.min(this.pinchScore[idx] + 1, 65535);
    } else {
      this.pinchScore[idx] = this.pinchScore[idx] > 0 ? this.pinchScore[idx] - 1 : 0;
    }

    // TODO capture pinch lifetime statistics.
    if (this.pinchScore[idx] === 0 && this.knots.length > 0) {
      // optional: decay knots; kept simple for now.
    }
  }

  #maybeNucleateKnot(idx) {
    const { pinchPersistence, knotInfluenceRadius } = this.config;
    if (this.pinchScore[idx] < pinchPersistence) return;
    const pos = this.#coords(idx);
    const existing = this.knots.find((knot) => knot.x === pos.x && knot.y === pos.y);
    if (existing) return;
    // Create a minimal knot with internal charge/spin proxies.
    const knot = {
      x: pos.x,
      y: pos.y,
      charge: this.state[idx],
      spin: Math.sign(this.accumulator[idx]) || 1,
      mass: knotInfluenceRadius,
    };
    this.knots.push(knot);
    // TODO add knot lifecycle and decay.
  }

  #knotBias(idx) {
    // Compute backreaction bias from nearby knots.
    const { knotInfluenceRadius, triadCarrierDrive } = this.config;
    const { x, y } = this.#coords(idx);
    let bias = 0;
    for (const knot of this.knots) {
      const dx = this.#wrappedDelta(x, knot.x, this.width);
      const dy = this.#wrappedDelta(y, knot.y, this.height);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= knotInfluenceRadius) {
        const falloff = 1 - dist / (knotInfluenceRadius + 1e-5);
        bias += knot.charge * falloff * triadCarrierDrive * 0.5;
        bias += knot.spin * falloff * 0.1;
      }
    }
    return bias;
  }

  #computeNeighborOffsets(radius) {
    const offsets = [];
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        offsets.push(dy * this.width + dx);
      }
    }
    return offsets;
  }

  #wrapIndex(idx) {
    const { width, height } = this;
    // Convert index into coords, apply toroidal wrap, then back to index.
    const x = ((idx % width) + width) % width;
    const y = Math.floor(idx / width);
    const wrappedY = ((y % height) + height) % height;
    return wrappedY * width + x;
  }

  #coords(idx) {
    return { x: idx % this.width, y: Math.floor(idx / this.width) };
  }

  #index(x, y) {
    const wrappedX = ((x % this.width) + this.width) % this.width;
    const wrappedY = ((y % this.height) + this.height) % this.height;
    return wrappedY * this.width + wrappedX;
  }

  #wrappedDelta(a, b, size) {
    // Compute minimal toroidal distance component.
    const raw = a - b;
    const wrapped = ((raw + size / 2) % size) - size / 2;
    return wrapped;
  }
}
