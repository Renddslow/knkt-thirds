import { LINE_HEIGHT, FONT, CONTENT_WIDTH } from './settings';

const renderText = (ctx, content, x, y, color) => {
  ctx.save();

  // Render text
  ctx.font = `600 40px ${FONT}`;
  ctx.fillStyle = color;
  const words = content.split(' ');
  let line = '';
  let lines = 0;

  y += ctx.measureText(content).emHeightAscent;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > CONTENT_WIDTH && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += LINE_HEIGHT;
      lines++;
    } else {
      line = testLine;
    }

    if (lines === 3) {
      return words.slice(n).join(' ');
    }

    ctx.fillText(line, x, y);
  }

  ctx.restore();
};

export default renderText;
