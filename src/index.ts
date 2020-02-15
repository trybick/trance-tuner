/* eslint-disable @typescript-eslint/no-unused-vars */
const player = document.getElementById('player') as HTMLAudioElement;
const output = document.getElementById('output') as HTMLOutputElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;

function togglePlay() {
  playBtn.classList.toggle('paused');
  player.paused ? player.play() : player.pause();
}

function setVolume(val: HTMLInputElement['value']) {
  player.volume = +val / 100;
  output.innerText = val;
}
