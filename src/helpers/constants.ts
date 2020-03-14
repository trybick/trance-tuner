import * as path from 'path';
import Store from 'electron-store';

export const store = new Store();

export const windowHeightWithDrawerClosed = 425;

export const randomSources = {
  ahFm: 'http://us2.ah.fm/192k/;stream/1',
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
  moveDaHouse: 'https://uk7.internet-radio.com/proxy/movedahouse?mp=/stream',
};

export const mainImages = {
  playIcon: path.join(__dirname, '../../images/play.png'),
  pauseIcon: path.join(__dirname, '../../images/pause.png'),
  aboutIcon: path.join(__dirname, '../../images/about-icon.png'),
};

export const audioSourceDialog = {
  title: 'Tray Tuner',
  label: 'Audio URL:',
  value: 'http://example.org',
  inputAttrs: {
    type: 'url',
  },
  customStylesheet: path.join(__dirname, '../../dist/index.css'),
};

export const aboutWindow = {
  icon_path: mainImages.aboutIcon,
  package_json_dir: path.join(__dirname, '../../'),
  win_options: {
    title: 'Tray Tuner - About',
    resizable: false,
  },
  product_name: 'Tray Tuner',
  description: 'Audio Streaming Utility',
  bug_report_url: 'https://github.com/trybick/tray-tuner/issues',
  bug_link_text: 'Feedback',
  copyright: 'Copyright (c) 2020 Tim Rybicki',
  homepage: 'https://github.com/trybick/tray-tuner',
  license: 'MIT',
};
