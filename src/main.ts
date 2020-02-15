import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
require('electron-reloader')(module);

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;

function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: async () => {
        mainWindow.show();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit TrayTuner',
      click: async () => {
        app.quit();
      },
    },
  ]);

  tray = new Tray(path.join(__dirname, '../icon.ico'));
  tray.setToolTip('Tray Tuner');
  tray.setIgnoreDoubleClickEvents(true);

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });

  tray.on('click', () => {
    mainWindow.webContents.send('toggle-play');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  app.dock.hide();
  createTray();
  createWindow();
});
