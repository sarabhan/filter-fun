export function computeFaceTransform(landmarks, width, height) {
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  // Convert to pixel coordinates

  //normalize landmarks according to video size to avoid misalignment 
  const x1 = leftEye.x * width;
  const y1 = leftEye.y * height;
  const x2 = rightEye.x * width;
  const y2 = rightEye.y * height;

  // Center point
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  // face Rotation angle by calc slope angle of inclined eye key points
  // we didnt use plain atan-1 because it gives us angle between -90 to +90 only
  // additionally, it will cause problems with division by 0
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Scale (distance between eyes)
  const scale = Math.hypot(x2 - x1, y2 - y1);

  return { cx, cy, angle, scale };
}
