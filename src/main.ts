import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import prompt from 'electron-prompt';
import Store from 'electron-store';
import electronReloader from 'electron-reloader';
import * as path from 'path';
electronReloader(module);

const playIcon = path.join(__dirname, '../icon.ico');
const pauseIcon = path.join(__dirname, '../icon9.png');
const store = new Store();

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;
let currentTrayIcon = playIcon;
let hideInDock = false;

// **
// Create Tray
// **
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

  tray.on('click', () => {
    mainWindow.webContents.send('toggle-play');
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

// **
// Create Window
// **
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

// **
// Renderer Listener
// **
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === 'toggle-play-icon') {
    _toggleTrayIcon();
  }
  if (arg === 'toggle-dock-setting') {
    _toggleDockSetting();
  }
  if (arg === 'open-add-audio') {
    _openAddAudio();
  }
});

function _toggleTrayIcon() {
  if (currentTrayIcon === playIcon) {
    tray.setImage(pauseIcon);
    currentTrayIcon = pauseIcon;
  } else {
    tray.setImage(playIcon);
    currentTrayIcon = playIcon;
  }
}

function _toggleDockSetting() {
  if (hideInDock === false) {
    app.dock.hide();
    hideInDock = true;
    mainWindow.show();
    store.set('setting.hideDock', true);
  } else {
    app.dock.show();
    hideInDock = false;
    store.set('setting.hideDock', false);
  }
}

function _openAddAudio() {
  prompt({
    title: 'Tray Tuner',
    label: 'Audio stream URL:',
    value: 'http://example.org',
    inputAttrs: {
      type: 'url',
    },
  })
    .then((url: string) => {
      if (url === null) {
        return;
      }
      if (!url.startsWith('http')) {
        url = 'http://'.concat(url);
      }
      store.set('audio.source', url);
      mainWindow.webContents.send('source-update', url);
    })
    .catch(console.error);
}

// **
// Load Settings
// **
function loadSettings() {
  const shouldHideDock = store.get('setting.hideDock');
  const audioSource = store.get('audio.source');

  mainWindow.webContents.on('did-finish-load', () => {
    if (shouldHideDock) {
      app.dock.hide();
      hideInDock = true;
      mainWindow.webContents.send('dock-setting-enabled');
    }
    if (audioSource) {
      mainWindow.webContents.send('source-update', audioSource);
    }
  });
}

// **
// Initiate main
// **
app.on('ready', () => {
  createTray();
  createWindow();
  loadSettings();
});
