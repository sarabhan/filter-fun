export function estimateHeadPose(landmarks, width, height) {
  if (!window.cv) return null;

  // 2D image points from MediaPipe landmarks
  const imagePoints = cv.matFromArray(6, 2, cv.CV_64F, [
    landmarks[1].x * width, landmarks[1].y * height,     // Nose tip
    landmarks[152].x * width, landmarks[152].y * height, // Chin
    landmarks[33].x * width, landmarks[33].y * height,   // Left eye
    landmarks[263].x * width, landmarks[263].y * height, // Right eye
    landmarks[61].x * width, landmarks[61].y * height,   // Left mouth
    landmarks[291].x * width, landmarks[291].y * height, // Right mouth
  ]);

  // 3D model points (generic face model)
  const modelPoints = cv.matFromArray(6, 3, cv.CV_64F, [
    0, 0, 0,            // Nose
    0, -63.6, -12.5,    // Chin
    -43.3, 32.7, -26,   // Left eye
    43.3, 32.7, -26,    // Right eye
    -28.9, -28.9, -24.1, // Left mouth
    28.9, -28.9, -24.1,  // Right mouth
  ]);

  const focalLength = width;
  const center = [width / 2, height / 2];

  const cameraMatrix = cv.matFromArray(3, 3, cv.CV_64F, [
    focalLength, 0, center[0],
    0, focalLength, center[1],
    0, 0, 1,
  ]);

  const distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64F);
  const rvec = new cv.Mat();
  const tvec = new cv.Mat();

  cv.solvePnP(
    modelPoints,
    imagePoints,
    cameraMatrix,
    distCoeffs,
    rvec,
    tvec
  );

  const rotMat = new cv.Mat();
  cv.Rodrigues(rvec, rotMat);

  // Extract Euler angles
  const pitch = Math.atan2(
    -rotMat.data64F[7],
    rotMat.data64F[8]
  );
  const yaw = Math.asin(rotMat.data64F[6]);
  const roll = Math.atan2(
    -rotMat.data64F[3],
    rotMat.data64F[0]
  );

  return { yaw, pitch, roll };
}
