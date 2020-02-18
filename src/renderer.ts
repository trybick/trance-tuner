/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

// **
// Constants
// **
const player = document.getElementById('player') as HTMLAudioElement;
const output = document.getElementById('output') as HTMLOutputElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const dockSettingCheckbox = document.getElementById('dock-setting') as HTMLInputElement;
const audioSourceDisplay = document.getElementById('audio-source') as HTMLSpanElement;
const settingsContainer = document.getElementById('settings') as HTMLDivElement;
const settingsChevron = document.getElementById('chevron-settings') as HTMLImageElement;

const images = {
  chevronUp: 'images/chevron-up.png',
  chevronDown: 'images/chevron-down.png',
};

const ahFmSource = 'http://us2.ah.fm/192k/;stream/1';

// **
// Main Listeners
// **
ipc.on('toggle-play', () => {
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
// Document Listeners
// **
document.body.onkeydown = e => {
  if (e.code === 'Space' || e.code === 'Enter') {
    togglePlay();
  }
};

// **
// Functions
// **
function togglePlay() {
  playBtn.classList.toggle('paused');
  player.paused ? player.play() : player.pause();
  ipc.send('asynchronous-message', 'toggle-play-icon');
}

function setVolume(val: HTMLInputElement['value']) {
  player.volume = +val / 100;
  output.innerText = val;
}

function toggleDockSetting() {
  ipc.send('asynchronous-message', 'toggle-dock-setting');
}

function openAddAudio() {
  ipc.send('asynchronous-message', 'open-add-audio');
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

function chooseForMe() {
  player.src = ahFmSource;
  audioSourceDisplay.textContent = ahFmSource;
  ipc.send('asynchronous-message', 'save-default-source');
}
