/**
 * The signature notch silhouette: flat top edge, top corners curving inward,
 * bottom corners flaring outward. Single path — not a rounded rectangle.
 */
export function notchPath(width: number, height: number, topRadius: number, bottomRadius: number) {
  const t = topRadius;
  const b = bottomRadius;

  return [
    `M 0 0`,
    `Q ${t} 0 ${t} ${t}`,
    `L ${t} ${height - b}`,
    `Q ${t} ${height} ${t + b} ${height}`,
    `L ${width - t - b} ${height}`,
    `Q ${width - t} ${height} ${width - t} ${height - b}`,
    `L ${width - t} ${t}`,
    `Q ${width - t} 0 ${width} 0`,
    `Z`,
  ].join(" ");
}

/** Corner radii per state, interpolated during the morph. */
export const NOTCH_RADII = {
  closed: { top: 10, bottom: 18 },
  open: { top: 22, bottom: 28 },
};

export function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}
