/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

// **
// Audio Section
// **
const player = document.getElementById('player') as HTMLAudioElement;
const output = document.getElementById('output') as HTMLOutputElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;

function togglePlay() {
  playBtn.classList.toggle('paused');
  player.paused ? player.play() : player.pause();
  ipc.send('asynchronous-message', 'toggle-play-icon');
}

function setVolume(val: HTMLInputElement['value']) {
  player.volume = +val / 100;
  output.innerText = val;
}

// Listen for play/pause tray clicks
ipc.on('toggle-play', () => {
  togglePlay();
});

// **
// Settings
// **
const dockSettingCheckbox = document.getElementById('dock-setting') as HTMLInputElement;

// Called when checkbox is clicked
function toggleDockSetting() {
  ipc.send('asynchronous-message', 'toggle-dock-setting');
}

// Triggered on startup if 'hide dock setting' is enabled
ipc.on('dock-setting-enabled', () => {
  dockSettingCheckbox.checked = true;
});
