// UI wiring between DOM controls and the simulation.
// Intent: keep controls declarative and easy to swap out.
export class UiController {
  constructor(sim, renderer, config) {
    this.sim = sim;
    this.renderer = renderer;
    this.config = config;

    // Playback state.
    this.running = true;

    // DOM references.
    this.elements = this.#bindElements();
    this.#attachEvents();
  }

  #bindElements() {
    return {
      startBtn: document.getElementById('start-btn'),
      resetBtn: document.getElementById('reset-btn'),
      triadSelect: document.getElementById('triad-mode'),
      eventsInput: document.getElementById('events-per-frame'),
      diagnostics: document.getElementById('diagnostics'),
      canvas: document.getElementById('phasecube-canvas'),
    };
  }

  #attachEvents() {
    const { startBtn, resetBtn, triadSelect, eventsInput, canvas } = this.elements;

    startBtn.addEventListener('click', () => {
      this.running = !this.running;
      startBtn.textContent = this.running ? 'Pause' : 'Resume';
    });

    resetBtn.addEventListener('click', () => {
      this.sim.reset();
    });

    triadSelect.addEventListener('change', (e) => {
      this.config.triadMode = e.target.value;
      this.sim.reset();
    });

    eventsInput.addEventListener('input', (e) => {
      const value = Number(e.target.value);
      if (!Number.isNaN(value) && value > 0) {
        this.config.eventsPerFrame = value;
      }
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = this.config.gridWidth / rect.width;
      const scaleY = this.config.gridHeight / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);
      this.sim.injectAt(x, y, this.config.injectionStrength);
    });
  }

  renderDiagnostics() {
    const { diagnostics } = this.elements;
    const stats = this.sim.getDiagnostics();
    diagnostics.textContent = `Boundary: ${stats.boundaryLength} | Mean |acc|: ${stats.meanAccumulator} | Knots: ${stats.knotCount}`;
  }
}
