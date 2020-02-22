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
const settingsContainer = document.getElementById('settings') as HTMLDivElement;
const settingsChevron = document.getElementById('chevron-settings') as HTMLImageElement;
const audioErrorIcon = document.getElementById('audio-error-icon') as HTMLImageElement;

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

ipc.on('source-update', (event, arg) => {
  player.src = arg;
  audioSourceDisplay.textContent = arg;
});

// **
// Functions
// **
function togglePlay() {
  if (player.error) {
    playBtn.classList.remove('paused');
    ipc.send('asynchronous-message', 'set-tray-play');
    audioErrorIcon.style.display = 'block';
  } else if (player.paused) {
    _clearAudioError();
    player.play();
    playBtn.classList.add('paused');
    ipc.send('asynchronous-message', 'set-tray-pause');
  } else {
    _clearAudioError();
    player.pause();
    playBtn.classList.remove('paused');
    ipc.send('asynchronous-message', 'set-tray-play');
  }
}

function setVolume(val: HTMLInputElement['value']) {
  player.volume = +val / 100;
}

function toggleDockSetting() {
  ipc.send('asynchronous-message', 'toggle-dock-setting');
}

function toggleOpenSettings() {
  if (window.getComputedStyle(settingsContainer).display === 'none') {
    settingsContainer.style.display = 'block';
    settingsChevron.src = images.chevronUp;
  } else {
    settingsContainer.style.display = 'none';
    settingsChevron.src = images.chevronDown;
  }
}

function openAddAudio() {
  _resetAudioState();
  ipc.send('asynchronous-message', 'open-add-audio');
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
  _clearAudioError();
  playBtn.classList.remove('paused');
  ipc.send('asynchronous-message', 'set-tray-play');
}

function _clearAudioError() {
  audioErrorIcon.style.display = 'none';
}
