export function computeFaceTransform(landmarks, width, height) {
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  // Convert to pixel coordinates
  const x1 = leftEye.x * width;
  const y1 = leftEye.y * height;
  const x2 = rightEye.x * width;
  const y2 = rightEye.y * height;

  // Center point
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  // Rotation angle
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Scale (distance between eyes)
  const scale = Math.hypot(x2 - x1, y2 - y1);

  return { cx, cy, angle, scale };
}
