export function drawFaceBox(ctx, transform) {
  const { cx, cy, angle, scale } = transform;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save(); //save current landmarks
  ctx.translate(cx, cy); //move to center of face
  ctx.rotate(angle); //rotate according to face angle
  
  //scale according to face size
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
