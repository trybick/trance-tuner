import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';
require('electron-reloader')(module);

let tray: Tray | null = null;
const playIcon = path.join(__dirname, '../icon.ico');
const pauseIcon = path.join(__dirname, '../icon9.png');
const currentTrayIcon = playIcon;
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

  tray = new Tray(currentTrayIcon);
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

function toggleTrayIcon() {
  if (currentTrayIcon === playIcon) {
    tray.setImage(pauseIcon);
  } else {
    console.log('ok');
    tray.setImage(playIcon);
  }
}

ipcMain.on('synchronous-message', (event, arg) => {
  if (arg === 'toggle-icon') {
    toggleTrayIcon();
  }
});

app.on('ready', () => {
  app.dock.hide();
  createTray();
  createWindow();
});
