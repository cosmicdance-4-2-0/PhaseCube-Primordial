// rules.js captures local event logic and diagnostics derived from the design document.
// Intent: keep the rule family isolated so experiments can swap in new behaviors without touching UI or rendering.

import { defaultConfig } from './config.js';

// Quick helper for random choice with probability p.
const chance = (p) => Math.random() < p;

export class RuleEngine {
  constructor(state) {
    this.state = state;
    this.config = state.config;
  }

  updateConfig(config) {
    // Update config reference to honor live user edits.
    this.config = config;
    this.state.config = config;
  }

  performEvents() {
    // Perform N random local events per frame.
    const { eventsPerFrame } = this.config;
    for (let n = 0; n < eventsPerFrame; n += 1) {
      const index = Math.floor(Math.random() * this.state.geometry.size);
      this.#localEvent(index);
    }
    this.state.frame += 1;
  }

  #localEvent(index) {
    // Execute one local update at a random cell, following Triad and shedding rules.
    const { config, state } = this;
    const { spins, accumulator, phase, pinchScore, knots, knotCharge } = state;
    const neighbors = state.geometry.neighbors(index);

    // Collect neighborhood stats for influence and stress.
    let sum = 0;
    let disagreeCount = 0;
    const selfSign = spins[index];

    for (const j of neighbors) {
      const neighborSign = spins[j];
      sum += neighborSign;
      if (neighborSign !== selfSign) disagreeCount += 1;
    }

    const ambiguous = Math.abs(sum) <= config.stressSumTolerance;
    const stressed = disagreeCount >= config.stressEdgeThreshold || ambiguous;

    // Apply the chosen Triad mediation.
    if (config.triadMode === 'carrier') {
      const drive = sum * config.carrierGain;
      accumulator[index] += drive;
      const published = accumulator[index] >= 0 ? 1 : -1;
      spins[index] = published;
    } else {
      // Triad A: resolve by local phase when ambiguous.
      if (ambiguous && chance(config.phaseFlipChance)) {
        phase[index] = phase[index] ^ 1; // flip between 0 and 1
      }
      spins[index] = ambiguous ? (phase[index] === 0 ? -1 : 1) : Math.sign(sum || selfSign);
    }

    // Handle shedding to avoid lock-in or collapse.
    if (stressed) {
      this.#shedStress(index, neighbors);
      pinchScore[index] += config.pinchIncrement;
    } else if (pinchScore[index] > 0) {
      pinchScore[index] = Math.max(0, pinchScore[index] - config.pinchDecay);
    }

    // Knot nucleation and lifetime decay.
    if (pinchScore[index] >= config.pinchThreshold && knots[index] <= 0) {
      knots[index] = config.knotLifetime;
      knotCharge[index] = Math.random() > 0.5 ? 1 : -1;
      pinchScore[index] = 0;
    }
    if (knots[index] > 0) {
      knots[index] -= 1;
    } else {
      knotCharge[index] = 0;
    }

    // Knot backreaction: local biasing along a radius.
    if (knots[index] > 0) {
      this.#applyKnotInfluence(index);
    }
  }

  #shedStress(index, neighbors) {
    // Redistribute accumulator or phase locally to avoid singularities.
    const { config, state } = this;
    const { spins, accumulator, phase } = state;

    if (config.triadMode === 'carrier') {
      // Dump a fraction of accumulator into neighbors along gradient direction.
      const dump = accumulator[index] * config.carrierDumpFraction;
      accumulator[index] -= dump;
      const share = dump / neighbors.length;
      for (const j of neighbors) {
        accumulator[j] += share;
      }
    } else {
      // Propagate a phase shock: probabilistically flip neighbors.
      for (const j of neighbors) {
        if (chance(config.phaseFlipChance * 0.5)) {
          phase[j] = phase[j] ^ 1;
          // TODO diffusion: bias flip chance based on neighbor disagreement.
        }
      }
    }

    // Dipole shedding: emit paired opposite disturbances to keep neutrality.
    const selfSign = spins[index];
    const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    spins[index] = selfSign * -1;
    spins[neighbor] = spins[neighbor] * -1;
  }

  #applyKnotInfluence(index) {
    // Bias nearby spins based on knot charge to mimic backreaction.
    const { config, state } = this;
    const { spins, knotCharge, geometry } = state;
    const charge = knotCharge[index];

    if (charge === 0) return;

    const { x, y } = geometry.coords(index);
    for (let dy = -config.knotRadius; dy <= config.knotRadius; dy += 1) {
      for (let dx = -config.knotRadius; dx <= config.knotRadius; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const j = geometry.index(x + dx, y + dy);
        spins[j] = Math.sign(spins[j] + charge * config.knotChargeBias) || charge;
      }
    }
  }
}

// TODO diagnostics: surface more stats (boundary length, junction count) for overlays.
// TODO persistence: allow saving and restoring field state snapshots for reproducibility.
