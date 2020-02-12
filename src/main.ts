import { app, Menu, Tray } from 'electron';
import * as path from 'path';
require('electron-reloader')(module);

let tray: Tray | null = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../icon.ico'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'radio', type: 'radio', checked: true },
    {
      label: 'Click me ',
      click: async e => {
        console.log('e', e);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('This is my application.');
});
