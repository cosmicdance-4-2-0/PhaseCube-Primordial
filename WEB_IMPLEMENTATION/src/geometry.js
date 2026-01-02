// GridGeometry encapsulates lattice dimensions and neighbor lookup helpers.
// Intent: keep topology concerns modular so other topologies can swap in later.

export class GridGeometry {
  constructor(width, height, radius) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.size = width * height;
    this.neighborOffsets = this.#buildNeighborOffsets();
  }

  index(x, y) {
    // Convert x, y to linear index with toroidal wrapping.
    const wrappedX = (x + this.width) % this.width;
    const wrappedY = (y + this.height) % this.height;
    return wrappedY * this.width + wrappedX;
  }

  coords(i) {
    // Recover coordinates from index; useful for debugging and rendering overlays.
    const y = Math.floor(i / this.width);
    const x = i - y * this.width;
    return { x, y };
  }

  #buildNeighborOffsets() {
    // Precompute neighbor offsets for radius r so we can reuse in every event.
    const offsets = [];
    for (let dy = -this.radius; dy <= this.radius; dy += 1) {
      for (let dx = -this.radius; dx <= this.radius; dx += 1) {
        if (dx === 0 && dy === 0) continue; // skip self
        offsets.push({ dx, dy });
      }
    }
    return offsets;
  }

  neighbors(index) {
    // Yield neighbor indices for a given cell. We avoid allocations by returning a new array each call for clarity; TODO performance: reuse buffer.
    const { x, y } = this.coords(index);
    return this.neighborOffsets.map(({ dx, dy }) => this.index(x + dx, y + dy));
  }
}

// TODO topology: allow selecting non-toroidal boundary conditions (reflective, clamp).
