import { app, Menu, Tray } from 'electron';
import * as path from 'path';
// require('electron-reloader')(module);

try {
  require('electron-reloader')(module);
} catch (_) {}

let tray: Tray | null = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../icon.ico'));

  const contextMenu = Menu.buildFromTemplate([


    { label: 'Item3asdfadf', type: 'radio', checked: true },
    { label: 'Iteadfadfaadfadfdfdfadfm4', type: 'radio' },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('This is my application.');
});
