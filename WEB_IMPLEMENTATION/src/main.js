// main.js boots the simulation, wires UI controls, and ensures configuration is user-tweakable.
// Intent: keep DOM concerns separate from simulation logic and expose a thin control surface.

import { defaultConfig } from './config.js';
import { Simulation } from './simulation.js';

// Shallow + nested copy because defaultConfig is frozen.
const cloneConfig = (config) => ({
  ...config,
  render: { ...config.render },
});

const ui = {
  canvas: document.getElementById('phasecube-canvas'),
  startButton: document.getElementById('start'),
  pauseButton: document.getElementById('pause'),
  stepButton: document.getElementById('step'),
  resetButton: document.getElementById('reset'),
  triadSelect: document.getElementById('triad-mode'),
  widthInput: document.getElementById('width'),
  heightInput: document.getElementById('height'),
  eventsInput: document.getElementById('events'),
  status: document.getElementById('status'),
};

let config = cloneConfig(defaultConfig);
let simulation = new Simulation(ui.canvas, config);

const syncInputs = () => {
  // Mirror current config into the form controls.
  ui.triadSelect.value = config.triadMode;
  ui.widthInput.value = config.width;
  ui.heightInput.value = config.height;
  ui.eventsInput.value = config.eventsPerFrame;
};

const readConfigFromInputs = () => {
  // Build a new config object from UI inputs, leaving defaults for other values.
  const next = cloneConfig(defaultConfig);
  next.triadMode = ui.triadSelect.value;
  next.width = parseInt(ui.widthInput.value, 10);
  next.height = parseInt(ui.heightInput.value, 10);
  next.eventsPerFrame = parseInt(ui.eventsInput.value, 10);
  return next;
};

const applyConfig = () => {
  config = readConfigFromInputs();
  simulation.updateConfig(config);
  updateStatus('Config applied.');
};

const updateStatus = (message) => {
  // Provide a simple status trail for users.
  ui.status.textContent = `${message} | Frame: ${simulation.state.frame}`;
};

const wireControls = () => {
  ui.startButton.addEventListener('click', () => {
    simulation.start();
    updateStatus('Running');
  });

  ui.pauseButton.addEventListener('click', () => {
    simulation.pause();
    updateStatus('Paused');
  });

  ui.stepButton.addEventListener('click', () => {
    simulation.pause();
    simulation.step();
    updateStatus('Stepped');
  });

  ui.resetButton.addEventListener('click', () => {
    simulation.pause();
    applyConfig();
    simulation.renderer.renderFrame();
    updateStatus('Reset');
  });

  // Live config changes.
  [ui.triadSelect, ui.widthInput, ui.heightInput, ui.eventsInput].forEach((input) => {
    input.addEventListener('change', () => {
      applyConfig();
    });
  });
};

const boot = () => {
  syncInputs();
  wireControls();
  simulation.renderer.renderFrame();
  updateStatus('Ready');
};

document.addEventListener('DOMContentLoaded', boot);

// TODO UX: add presets and keyboard shortcuts for quick exploration.
