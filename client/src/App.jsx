import { useRef, useEffect } from "react";
import { useCamera } from "./camera/useCamera";
import { createFaceMesh } from "./landmarks/faceMesh";
import { drawLandmarks } from "./render/drawLandmarks";
import { Camera } from "@mediapipe/camera_utils";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useCamera(videoRef);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceMesh = createFaceMesh((results) => {
      if (
        results.multiFaceLandmarks &&
        results.multiFaceLandmarks.length > 0
      ) {
        const landmarks = results.multiFaceLandmarks[0];
        drawLandmarks(ctx, landmarks, canvas.width, canvas.height);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}

export default App;
