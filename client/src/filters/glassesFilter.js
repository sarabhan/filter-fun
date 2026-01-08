let glassesImage = new Image();
glassesImage.src = "/src/assets/glasses.png";

export function drawGlasses(ctx, transform) {
  const { cx, cy, scale } = transform; // no rotation anymore

  ctx.save();

  // Move to face center
  ctx.translate(cx, cy);

  // Calculate size based on scale
  const width = scale * 1.75;
  const height = scale * 1.5;

  // Draw glasses centered
  ctx.drawImage(
    glassesImage,
    -width / 2,
    -height / 2,
    width,
    height
  );

  ctx.restore();
}
