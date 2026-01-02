// Canvas renderer for PhaseCube.
// Intent: keep visualization swappable (e.g., canvas, WebGL) without touching simulation.
import { lerpColor } from './utils.js';

export class CanvasRenderer {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;

    // Scale canvas for crisp pixels.
    canvas.width = config.gridWidth * config.renderScale;
    canvas.height = config.gridHeight * config.renderScale;
    this.offscreen = document.createElement('canvas');
    this.offscreen.width = config.gridWidth;
    this.offscreen.height = config.gridHeight;
    this.offCtx = this.offscreen.getContext('2d');
    this.offImage = this.offCtx.createImageData(config.gridWidth, config.gridHeight);
  }

  render(sim) {
    const { state, accumulator, knots } = sim;
    const { zeroColor, posColor, negColor } = this.config;
    const data = this.offImage.data;

    // Map published pulses (+1/-1) to colors; neutral shows as zeroColor.
    for (let i = 0; i < state.length; i += 1) {
      const s = state[i];
      let color = zeroColor;
      if (s > 0) color = posColor; else color = negColor;

      // Slight shading by accumulator magnitude to hint at stored stress.
      const acc = Math.min(Math.abs(accumulator[i]) / 8, 1);
      color = lerpColor(color, zeroColor, acc * 0.2);

      const idx = i * 4;
      data[idx] = color[0];
      data[idx + 1] = color[1];
      data[idx + 2] = color[2];
      data[idx + 3] = 255;
    }

    // Draw knots as bright overlay pixels.
    const { knotColor } = this.config;
    for (const knot of knots) {
      const idx = (knot.y * this.config.gridWidth + knot.x) * 4;
      data[idx] = knotColor[0];
      data[idx + 1] = knotColor[1];
      data[idx + 2] = knotColor[2];
      data[idx + 3] = 255;
    }

    // Put image to offscreen canvas first, then scale to visible canvas.
    this.offCtx.putImageData(this.offImage, 0, 0);
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.offscreen,
      0,
      0,
      this.offscreen.width,
      this.offscreen.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.restore();
  }
}
