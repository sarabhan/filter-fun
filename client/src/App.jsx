import { useRef, useEffect } from "react";
import { useCamera } from "./camera/useCamera";
import { createFaceMesh } from "./landmarks/faceMesh";
// import { drawLandmarks } from "./render/drawLandmarks";
import { Camera } from "@mediapipe/camera_utils";
import { computeFaceTransform } from "./geometry/faceGeometry";
import { drawFaceBox } from "./render/drawLandmarks";
import { OneEuroFilter } from "./smoothing/oneEuroFilter";
import { drawGlasses } from "./filters/glassesFilter";


function unwrapAngle(prev, curr) {
  let delta = curr - prev;
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;
  return prev + delta;
}

function App() {
  const xFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));
  const yFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));
  const scaleFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));
  const angleFilter = useRef(new OneEuroFilter(60, 1.0, 0.01));

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useCamera(videoRef);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceMesh = createFaceMesh((results) => {
      if (results.multiFaceLandmarks?.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const transform = computeFaceTransform(
          landmarks,
          canvas.width,
          canvas.height
        );
        const now = performance.now();

        let { cx, cy, angle, scale } = transform;

        // Angle unwrap BEFORE filtering
        const prevAngle = angleFilter.current.prevValue ?? angle;
        angle = unwrapAngle(prevAngle, angle);

        // Apply One Euro filters
        cx = xFilter.current.filter(cx, now);
        cy = yFilter.current.filter(cy, now);
        scale = scaleFilter.current.filter(scale, now);
        angle = angleFilter.current.filter(angle, now);

        // Draw using smoothed values
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGlasses(ctx, { cx, cy, angle, scale });


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
      <canvas //default canvas size
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}

export default App;
