import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
require('electron-reloader')(module);

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;

function createTrayMenu() {
  tray = new Tray(path.join(__dirname, '../icon.ico'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'radio', type: 'radio', checked: true },
    {
      label: 'Quit',
      click: async () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('This is my application.');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  // app.dock.hide();
  createTrayMenu();
  createWindow();
});
