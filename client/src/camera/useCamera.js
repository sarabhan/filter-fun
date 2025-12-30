import { useEffect } from "react";

export function useCamera(videoRef) {
  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Camera error:", err);
      });
  }, [videoRef]);
}
