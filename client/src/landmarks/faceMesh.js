import { FaceMesh } from "@mediapipe/face_mesh";

export function createFaceMesh(onResults) {
  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://unpkg.com/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,

    // 🚨 THIS IS THE FIX
    enableFaceGeometry: false,
    selfieMode: true,
  });

  faceMesh.onResults(onResults);

  return faceMesh;
}
