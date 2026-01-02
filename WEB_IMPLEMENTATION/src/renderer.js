// renderer.js draws the current field to the canvas and exposes simple overlays.
// Intent: isolate presentation from simulation logic so alternate UIs can be attached later.

export class Renderer {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = state;
    this.#resize();
  }

  #resize() {
    // Adjust canvas dimensions based on state and render config.
    const { width, height } = this.state.geometry;
    const { cellSize } = this.state.config.render;
    this.canvas.width = width * cellSize;
    this.canvas.height = height * cellSize;
  }

  updateConfig(config) {
    // When dimensions change, resize the canvas accordingly.
    this.state.config = config;
    this.#resize();
  }

  renderFrame() {
    // Draw the current published field with a simple low-pass blend for readability.
    const { ctx } = this;
    const { width, height, size } = this.state.geometry;
    const { cellSize, fade } = this.state.config.render;
    const { spins, displayAverage } = this.state;

    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < size; i += 1) {
      // Blend the displayed average to produce a quasi-ternary visualization.
      displayAverage[i] = displayAverage[i] * (1 - fade) + spins[i] * fade;
      const intensity = Math.max(-1, Math.min(1, displayAverage[i]));
      const color = this.#colorForValue(intensity);
      const { x, y } = this.state.geometry.coords(i);
      this.#paintCell(data, x, y, cellSize, color);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  #colorForValue(value) {
    // Map value in [-1, 1] to a blue-white-orange palette.
    if (value > 0.2) return { r: 255, g: 182, b: 72 }; // warm for +1
    if (value < -0.2) return { r: 80, g: 160, b: 255 }; // cool for -1
    const neutral = Math.floor((value + 1) * 80); // gray-ish center
    return { r: 120 + neutral, g: 120 + neutral, b: 120 + neutral };
  }

  #paintCell(buffer, cellX, cellY, cellSize, color) {
    // Draw a filled square in the ImageData buffer.
    const width = this.canvas.width;
    for (let y = 0; y < cellSize; y += 1) {
      for (let x = 0; x < cellSize; x += 1) {
        const px = (cellY * cellSize + y) * width + (cellX * cellSize + x);
        const idx = px * 4;
        buffer[idx] = color.r;
        buffer[idx + 1] = color.g;
        buffer[idx + 2] = color.b;
        buffer[idx + 3] = 255;
      }
    }
  }
}

// TODO overlays: draw boundary length heatmaps or knot markers for debugging.
