/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

// **
// Constants
// **
const player = document.getElementById('player') as HTMLAudioElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const dockSettingCheckbox = document.getElementById('dock-setting') as HTMLInputElement;
const audioSourceDisplay = document.getElementById('audio-source') as HTMLSpanElement;
const expandedDrawer = document.getElementById('expanded-drawer') as HTMLDivElement;
const settingsChevron = document.getElementById('chevron-settings') as HTMLImageElement;
const audioErrorIcon = document.getElementById('audio-error-icon') as HTMLImageElement;
const volumeFill = document.getElementById('vol-slider-fill') as HTMLDivElement;

const images = {
  chevronUp: 'images/chevron-up.png',
  chevronDown: 'images/chevron-down.png',
};

const randomSources = {
  ahFm: 'http://us2.ah.fm/192k/;stream/1',
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
};

// **
// Listeners
// **
document.body.onkeydown = e => {
  if (e.code === 'Space' || e.code === 'Enter') {
    togglePlay();
  }
};

ipc.on('tray-clicked', () => {
  togglePlay();
});

ipc.on('dock-setting-enabled', () => {
  dockSettingCheckbox.checked = true;
});

ipc.on('source-update', (e, arg) => {
  player.src = arg;
  audioSourceDisplay.textContent = arg;
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
  player.volume = +val / 100;
  volumeFill.style.width = `${+val}%`;
}

function toggleDockSetting() {
  ipc.send('asynchronous-message', 'toggle-dock-setting');
}

function toggleOpenDrawer() {
  const isHidden = window.getComputedStyle(expandedDrawer).display === 'none';
  if (isHidden) {
    expandedDrawer.style.display = 'block';
    settingsChevron.src = images.chevronUp;
  } else {
    expandedDrawer.style.display = 'none';
    settingsChevron.src = images.chevronDown;
  }
}

function editAudioSource() {
  _resetAudioState();
  ipc.send('asynchronous-message', 'open-edit-audio-dialog');
}

function setRandomSource() {
  _resetAudioState();

  const { ahFm, revolutionRadio } = randomSources;
  const randomSource = player.src === ahFm ? revolutionRadio : ahFm;
  player.src = randomSource;
  audioSourceDisplay.textContent = randomSource;

  // I don't love this
  if (randomSource.includes('revolution')) {
    ipc.send('asynchronous-message', 'save-default-revolution');
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
