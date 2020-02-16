import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import * as path from 'path';
require('electron-reloader')(module);

let tray: Tray | null = null;
const playIcon = path.join(__dirname, '../icon.ico');
const pauseIcon = path.join(__dirname, '../icon9.png');
let currentTrayIcon = playIcon;
let mainWindow: Electron.BrowserWindow;

let hideInDock = false;

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

  // Left-click toggles music
  tray.on('click', () => {
    mainWindow.webContents.send('toggle-play');
  });

  // Right-click opens menu
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
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
    currentTrayIcon = pauseIcon;
  } else {
    tray.setImage(playIcon);
    currentTrayIcon = playIcon;
  }
}

function toggleDockSetting() {
  if (hideInDock === false) {
    app.dock.hide();
    hideInDock = true;
    // set a setting
  } else {
    app.dock.show();
    hideInDock = false;
    mainWindow.show();
  }
}

// Listen for toggle-icon command
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === 'toggle-icon') {
    toggleTrayIcon();
  }
  if (arg === 'toggle-dock-setting') {
    toggleDockSetting();
  }
});

app.on('ready', () => {
  createTray();
  createWindow();
});
