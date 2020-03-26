import createState from 'state-watcher';

import './styles.css';

import renderVerseBox from './renderVerseBox';
import renderText from './renderText';
import renderContentBox from './renderContentBox';
import parse from './dotSermon';

import { BOX_PADDING_X, BOX_PADDING_Y, BOX_WIDTH, BOX_X_START, BOX_Y_START } from './settings';

const [state, watcher] = createState({
  blockImage: new Image(),
  verseColor: '#000',
  verseBackground: '#000',
  blockColor: '#000',
  blockImageReady: false,
  blockImageOffset: 0,
  currentBlockText: '',
  currentVerseText: '',
  rawText: '',
  content: [],
});

const canvas = document.getElementById('cvs');
const ctx = canvas.getContext('2d');

const fullText =
  "In the spring, at the time when kings go off to war, David sent Joab out with the king's men and the whole Israelite army. They destroyed the Ammonites and besieged Rabbah. But David remained in Jerusalem. One evening David got up from his bed and walked around on the roof of the palace. From the roof he saw a woman bathing. The woman was very beautiful, One evening David got up from his bed and walked around on the roof of the palace. From the roof he saw a woman bathing. The woman was very beautiful,";

renderVerseBox(ctx, '2 Samuel 11:1-3 NIV');

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

// State watchers
watcher.on('change', ['blockImageOffset', 'blockImageReady'], (s) => {
  renderContentBox(ctx, s.blockImage, s.blockImageOffset);
  if (s.content.length) {
    renderText(ctx, s.content[0].content, BOX_X_START + BOX_PADDING_X, BOX_Y_START + BOX_PADDING_Y);
  }
});

watcher.on('change', ['rawText'], (s) => {
  state.content = parse(s.rawText);
});

watcher.on('change', ['content'], (s) => {
  document.getElementById('create').disabled = false;
  renderText(ctx, s.content[0].content, BOX_X_START + BOX_PADDING_X, BOX_Y_START + BOX_PADDING_Y);
});
