// Shared utilities for the web implementation.
// TODO consider moving RNG utilities here for deterministic runs.
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerpColor(a, b, t) {
  // Linearly interpolate two RGB tuples.
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function createImageBuffer(width, height) {
  // Convenience for creating an ImageData-like buffer structure.
  const data = new Uint8ClampedArray(width * height * 4);
  return { width, height, data };
}
