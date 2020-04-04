import { BOX_HEIGHT, BOX_WIDTH, BOX_X_START, BOX_Y_START, FONT } from './settings';

const renderPoint = (ctx, content, color) => {
  ctx.save();

  ctx.font = `600 60px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content, BOX_X_START + BOX_WIDTH / 2, BOX_Y_START + BOX_HEIGHT / 2);

  ctx.restore();
};

export default renderPoint;
