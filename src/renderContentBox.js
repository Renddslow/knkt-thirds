import { BOX_HEIGHT, BOX_WIDTH, BOX_X_START, BOX_Y_START } from './settings';

const renderContentBox = (ctx, img, oy = 0) => {
  const svg = document.getElementById('content-box-scale');
  const matrix = svg.createSVGMatrix();
  ctx.save();
  ctx.clearRect(BOX_X_START, BOX_Y_START, BOX_WIDTH, BOX_HEIGHT);

  const scale = BOX_WIDTH / img.naturalWidth;

  const pattern = ctx.createPattern(img, 'no-repeat');
  if (scale !== 1) {
    pattern.setTransform(matrix.scale(scale).translate(96, oy));
  }
  ctx.fillStyle = pattern;
  ctx.fillRect(BOX_X_START, BOX_Y_START, BOX_WIDTH, BOX_HEIGHT);
  ctx.restore();
};

export default renderContentBox;
