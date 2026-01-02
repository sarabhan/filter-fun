let glassesImage = new Image();
glassesImage.src = "/src/assets/glasses.png";

export function drawGlasses(ctx, transform) {
  const { cx, cy, angle, scale } = transform;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Heuristic sizing based on inter-ocular distance
  const width = scale * 1.75;
  const height = scale * 1.5;

  ctx.drawImage(
    glassesImage,
    -width / 2,
    -height / 2 , 
    width,
    height
  );

  ctx.restore();
}
