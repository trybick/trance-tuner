import * as path from 'path';
import Store from 'electron-store';

export const playIcon = path.join(__dirname, '../../images/play.png');
export const pauseIcon = path.join(__dirname, '../../images/pause.png');
export const aboutIcon = path.join(__dirname, '../../images/about-icon.png');
export const store = new Store();
export const randomSources = {
  ahFm: 'http://us2.ah.fm/192k/;stream/1',
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
};

export const aboutWindowTemplate = {
  icon_path: aboutIcon,
  package_json_dir: path.join(__dirname, '../../'),
  win_options: { title: 'Tray Tuner - About' },
  product_name: 'Tray Tuner',
  description: 'Description',
  bug_report_url: 'https://github.com/trybick/tray-tuner/issues',
  bug_link_text: 'Feedback',
  copyright: 'Copyright (c) 2020 Tim Rybicki',
  homepage: 'https://github.com/trybick/tray-tuner',
  license: 'MIT',
};
