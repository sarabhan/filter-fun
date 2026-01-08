import { useRef, useEffect } from "react";
import { useCamera } from "./camera/useCamera";
import { createFaceMesh } from "./landmarks/faceMesh";
import { Camera } from "@mediapipe/camera_utils";
import { computeFaceTransform } from "./geometry/faceGeometry";
import { OneEuroFilter } from "./smoothing/oneEuroFilter";
import { drawGlasses } from "./filters/glassesFilter";

function App() {
  // Smoothing filters
  const xFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));
  const yFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));
  const scaleFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  useCamera(videoRef);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceMesh = createFaceMesh((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const landmarks = results.multiFaceLandmarks[0];

      // 2D face geometry (center + scale)
      const { cx, cy, scale } = computeFaceTransform(
        landmarks,
        canvas.width,
        canvas.height
      );

      const now = performance.now();

      // Smooth position & scale
      const smoothCx = xFilter.current.filter(cx, now);
      const smoothCy = yFilter.current.filter(cy, now);
      const smoothScale = scaleFilter.current.filter(scale, now);

      // Render glasses (no rotation)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Mirror canvas to match video
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      drawGlasses(ctx, {
        cx: canvas.width - smoothCx,
        cy: smoothCy,
        scale: smoothScale,
        roll: 0, // ignore rotation
      });

      ctx.restore();
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => camera.stop();
  }, []);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={640}
        height={480}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "scaleX(-1)", // mirror video
        }}
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
