import { FONT, BOX_X_START, BOX_Y_START, FLAG_HEIGHT_LG, FLAG_INSET } from './settings';

const renderVerseBox = (ctx, verse, color, bg) => {
  ctx.save();

  ctx.font = `400 40px ${FONT}`;
  const textMeasurements = ctx.measureText(verse);

  // Render box
  ctx.fillStyle = bg;
  ctx.fillRect(
    BOX_X_START + FLAG_INSET,
    BOX_Y_START - FLAG_HEIGHT_LG,
    textMeasurements.width + 80,
    FLAG_HEIGHT_LG,
  );

  // Render text
  ctx.fillStyle = color;
  ctx.fillText(verse, BOX_X_START + FLAG_INSET + 40, BOX_Y_START - FLAG_HEIGHT_LG / 2 + 14);

  ctx.restore();
};

export default renderVerseBox;
