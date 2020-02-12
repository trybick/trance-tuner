import { app, Menu, Tray } from 'electron';
import * as path from 'path';

let tray: Tray | null = null;

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../icon.ico'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('This is my application.');
});
