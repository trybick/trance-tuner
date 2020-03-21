/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

// **
// Constants
// **
const player = document.getElementById('player') as HTMLAudioElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const dockSettingCheckbox = document.getElementById('dock-setting') as HTMLInputElement;
const audioSourceDisplay = document.getElementById('source-display') as HTMLSpanElement;
const expandedDrawer = document.getElementById('expanded-drawer') as HTMLDivElement;
const settingsChevron = document.getElementById('chevron-settings') as HTMLImageElement;
const audioErrorIcon = document.getElementById('audio-error-icon') as HTMLImageElement;
const volumeFill = document.getElementById('vol-slider-fill') as HTMLDivElement;

const images = {
  chevronUp: 'images/chevron-up.png',
  chevronDown: 'images/chevron-down.png',
};

const randomSources = {
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
  moveDaHouse: 'https://uk7.internet-radio.com/proxy/movedahouse?mp=/stream',
  ahFm: 'http://us2.ah.fm/192k/;stream/1',
};

const randomSourcesArray = Object.values(randomSources);

// **
// Listeners
// **
ipc.on('tray-clicked', () => {
  togglePlay();
});

ipc.on('load-dock-setting-enabled', () => {
  dockSettingCheckbox.checked = true;
});

ipc.on('kbd-toggle-play', () => {
  togglePlay();
});

ipc.on('kbd-random-source', () => {
  setRandomSource();
});

ipc.on('load-source-update', (e, savedSource) => {
  player.src = savedSource;
  audioSourceDisplay.textContent = _createCleanDisplaySource(savedSource);
});

// **
// Functions
// **
function togglePlay() {
  try {
    if (player.error) {
      _handlePlayError();
    } else if (player.paused) {
      audioErrorIcon.style.display = 'none';
      player.load(); // to avoid playing stale data
      player.play();
      playBtn.classList.add('paused');

      ipc.send('asynchronous-message', 'set-tray-pause');
    } else {
      audioErrorIcon.style.display = 'none';
      player.pause();
      playBtn.classList.remove('paused');

      ipc.send('asynchronous-message', 'set-tray-play');
    }
  } catch {
    _handlePlayError();
  }
}

function setVolume(val: HTMLInputElement['value']) {
  const volume = Number(val);
  let filledVolume = volume;

  if (volume > 95) filledVolume -= 5;

  player.volume = volume / 100;
  volumeFill.style.width = `${filledVolume}%`;
}

function toggleDockSetting() {
  ipc.send('asynchronous-message', 'toggle-dock-setting');
}

function toggleOpenDrawer() {
  const isHidden = window.getComputedStyle(expandedDrawer).display === 'none';

  if (isHidden) {
    expandedDrawer.style.display = 'block';
    settingsChevron.src = images.chevronUp;

    ipc.send('asynchronous-message', 'increase-window-size');
  } else {
    expandedDrawer.style.display = 'none';
    settingsChevron.src = images.chevronDown;

    ipc.send('asynchronous-message', 'decrease-window-size');
  }
}

function editAudioSource() {
  _resetAudioState();
  ipc.send('asynchronous-message', 'open-edit-audio-dialog');
}

function setRandomSource() {
  const wasPlaying = !player.paused;
  _resetAudioState();

  // To avoid repeats, pick first item and move it to last
  let newRandom = randomSourcesArray[0];
  randomSourcesArray.push(randomSourcesArray.shift());

  // Check if this source is currently set
  if (newRandom === player.src) {
    newRandom = randomSourcesArray[0];
    randomSourcesArray.push(randomSourcesArray.shift());
  }

  player.src = newRandom;
  audioSourceDisplay.textContent = _createCleanDisplaySource(newRandom);
  wasPlaying && togglePlay();

  // I don't love this
  if (newRandom.includes('revolution')) {
    ipc.send('asynchronous-message', 'save-default-revolution');
  } else if (newRandom.includes('movedahouse')) {
    ipc.send('asynchronous-message', 'save-default-movedahouse');
  } else {
    ipc.send('asynchronous-message', 'save-default-ahFm');
  }
}

function _resetAudioState() {
  if (!player.paused) {
    player.pause();
    playBtn.classList.add('paused');
  }
  audioErrorIcon.style.display = 'none';
  playBtn.classList.remove('paused');
  ipc.send('asynchronous-message', 'set-tray-play');
}

function _handlePlayError() {
  playBtn.classList.remove('paused');
  ipc.send('asynchronous-message', 'set-tray-play');
  audioErrorIcon.style.display = 'block';
}

// Remove https:// from URL for display
function _createCleanDisplaySource(url: string) {
  return url.replace(/(^\w+:|^)\/\//, '');
}
