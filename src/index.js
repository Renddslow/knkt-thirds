import createState from 'state-watcher';
import JSZip from 'jszip';

import './styles.css';

import renderVerseBox from './renderVerseBox';
import renderText from './renderText';
import renderContentBox from './renderContentBox';
import parse from './dotSermon';

import { BOX_PADDING_X, BOX_PADDING_Y, BOX_X_START, BOX_Y_START } from './settings';
import renderPoint from './renderPoint';
import save from './saveBlob';

const [state, watcher] = createState({
  blockImage: new Image(),
  verseColor: '#000',
  verseBackground: '#000',
  blockColor: '#000',
  blockImageReady: false,
  blockImageOffset: 0,
  current: null,
  currentIdx: 0,
  rawText: '',
  content: [],
  imgs: [],
});

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');

const openFilePicker = (id) => () => {
  document.getElementById(id).click();
};

const colorBackground = (name) => (e) => {
  const el = e.target.parentNode.querySelector('.color-preview');
  el.style.background = e.target.value.indexOf('#') !== -1 ? e.target.value : `#${e.target.value}`;
  state[name] = e.target.value;
};

// File Pickers
document.getElementById('block-image-btn').addEventListener('click', openFilePicker('block-image'));
document
  .getElementById('sermon-notes-btn')
  .addEventListener('click', openFilePicker('sermon-notes'));

// Color Pickers
document.getElementById('verse-color').addEventListener('keyup', colorBackground('verseColor'));
document
  .getElementById('verse-bg-color')
  .addEventListener('keyup', colorBackground('verseBackground'));
document.getElementById('note-color').addEventListener('keyup', colorBackground('blockColor'));

// File Handlers
document.getElementById('block-image').addEventListener('change', (e) => {
  state.blockImage.src = URL.createObjectURL(e.target.files[0]);
  state.blockImage.onload = () => {
    state.blockImageReady = true;
  };
});
document.getElementById('sermon-notes').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fr = new FileReader();
  fr.onload = () => {
    state.rawText = fr.result;
  };
  fr.readAsText(file);
});

// Input Listeners
document.getElementById('block-offset').addEventListener('change', (e) => {
  state.blockImageOffset = parseInt(e.target.value, 10);
});

// Button Listeners
document.getElementById('create').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('create').disabled = true;

  let slide = -1;

  while (state.currentIdx < state.content.length) {
    state.current = state.content[state.currentIdx];
    let remainingText = render(state);
    if (remainingText) {
      state.current.content = remainingText;
    } else {
      state.currentIdx++;
    }

    slide++;

    canvas.toBlob((t) => {
      const blobUrl = URL.createObjectURL(t);
      const img = document.createElement('img');
      img.src = blobUrl;
      document.getElementById('img-bin').appendChild(img);
      state.imgs.push({ blob: t, slide });
    });
  }
});

document.getElementById('zip').addEventListener('click', (e) => {
  e.preventDefault();

  const zip = new JSZip();
  const folder = zip.folder('slides');

  state.imgs.forEach((img) => {
    folder.file(`slide-${img.slide}`, img.blob);
  });

  zip.generateAsync({ type: 'blob' }).then((content) => save(content));
});

// State watchers
watcher.on(
  'change',
  ['blockImageOffset', 'blockImageReady', 'verseColor', 'verseBackground', 'blockColor'],
  (s) => {
    render(s);
  },
);

watcher.on('change', ['rawText'], (s) => {
  const content = parse(s.rawText);
  state.current = content[0];
  state.content = content;
});

watcher.on('change', ['content'], (s) => {
  document.getElementById('create').disabled = false;
  render(s);
});

function render(s) {
  ctx.clearRect(0, 0, 1920, 1080);
  if (s.blockImageReady) {
    renderContentBox(ctx, s.blockImage, s.blockImageOffset);
  }

  if (s.content.length && s.current) {
    if (s.current.type === 'point') {
      renderPoint(ctx, s.current.content, s.blockColor);
    } else {
      renderVerseBox(
        ctx,
        `${s.current.reference} ${s.current.version}`,
        s.verseColor,
        s.verseBackground,
      );
      return renderText(
        ctx,
        s.current.content,
        BOX_X_START + BOX_PADDING_X,
        BOX_Y_START + BOX_PADDING_Y,
        s.blockColor,
      );
    }
  }
}
