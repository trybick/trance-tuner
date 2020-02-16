/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

const player = document.getElementById('player') as HTMLAudioElement;
const output = document.getElementById('output') as HTMLOutputElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const dockSettingCheckbox = document.getElementById('dock-setting') as HTMLInputElement;

ipc.on('toggle-play', () => {
  togglePlay();
});

ipc.on('dock-setting-enabled', () => {
  dockSettingCheckbox.checked = true;
});

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
