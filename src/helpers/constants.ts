import * as path from 'path';
import Store from 'electron-store';

export const store = new Store();
export const isMac = process.platform === 'darwin';
export const windowHeightWithDrawerClosed = 425;

export const randomSources = {
  ahFm: 'http://fr.ah.fm:8000/192k/;stream/1',
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
  moveDaHouse: 'https://uk7.internet-radio.com/proxy/movedahouse?mp=/stream',
};

export const icons = {
  mac: {
    musicRecord: path.join(__dirname + '/images/music-record.ico'),
    play: path.join(__dirname, '../../images/mac/play.png'),
    pause: path.join(__dirname, '../../images/mac/pause.png'),
  },
  nonMac: {
    musicRecord: path.join(__dirname + '/images/music-record-258.png'),
    play: path.join(__dirname, '../../images/nonMac/play.png'),
    pause: path.join(__dirname, '../../images/nonMac/pause.png'),
  },
  all: {
    aboutLogo: path.join(__dirname, '../../images/about-logo.png'),
  },
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
  icon_path: icons.all.aboutLogo,
  package_json_dir: path.join(__dirname, '../../'),
  win_options: {
    title: 'Tray Tuner - About',
    resizable: false,
  },
  product_name: 'Tray Tuner',
  description: 'Audio Streaming Application',
  bug_report_url: 'https://github.com/trybick/tray-tuner/issues',
  bug_link_text: 'Feedback',
  copyright: 'Icons from icons8.com',
  homepage: 'https://github.com/trybick/tray-tuner',
  license: 'MIT',
};
