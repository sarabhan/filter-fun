export function drawFaceBox(ctx, transform) {
  const { cx, cy, angle, scale } = transform;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const boxWidth = scale * 1.5;
  const boxHeight = scale;

  ctx.strokeStyle = "lime";
  ctx.lineWidth = 3;
  ctx.strokeRect(
    -boxWidth / 2,
    -boxHeight / 2,
    boxWidth,
    boxHeight
  );

  ctx.restore();
}
