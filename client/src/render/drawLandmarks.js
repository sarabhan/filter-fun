export function drawLandmarks(ctx, landmarks, width, height) {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "red";

  for (const point of landmarks) {
    const x = point.x * width;
    const y = point.y * height;

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
