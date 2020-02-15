/* eslint-disable @typescript-eslint/no-unused-vars */
const electron = require('electron');
const ipc = electron.ipcRenderer;

const player = document.getElementById('player') as HTMLAudioElement;
const output = document.getElementById('output') as HTMLOutputElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;

function togglePlay() {
  playBtn.classList.toggle('paused');
  player.paused ? player.play() : player.pause();

  // Change tray icon
  ipc.sendSync('synchronous-message', 'toggle-icon');
}

function setVolume(val: HTMLInputElement['value']) {
  player.volume = +val / 100;
  output.innerText = val;
}

ipc.on('toggle-play', () => {
  togglePlay();
});
