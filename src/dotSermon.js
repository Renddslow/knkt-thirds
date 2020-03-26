const parse = (text) => {
  const lines = text
    .split('\n')
    .reduce((acc, line) => (line.trim() ? [...acc, line.trim()] : acc), []);

  if (lines[0][0] !== '[') {
    return null;
  }

  const slides = [];

  let currentSlide = {};

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '[verse]' || lines[i] === '[point]') {
      if (currentSlide.type) {
        slides.push(currentSlide);
      }

      currentSlide = {
        type: lines[i].replace(/\W/g, ''),
      };
      continue;
    }

    const words = lines[i].split(' ');
    if (words.length > 2 && words[1] === '=') {
      const key = words[0];
      currentSlide[key] = words.slice(2).join(' ');
      continue;
    }

    currentSlide.content = currentSlide.content ? `${currentSlide.content} ${lines[i]}` : lines[i];
  }

  slides.push(currentSlide);

  return slides;
};

export default parse;
