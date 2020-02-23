import {
  aboutWindow,
  audioSourceDialog,
  mainImages,
  store,
  randomSources,
} from './helpers/constants';
import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import prompt from 'electron-prompt';
import openAboutWindow from 'about-window';
import * as path from 'path';
import electronReloader from 'electron-reloader';
electronReloader(module);

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;
let hideInDock = false;
let shouldQuit = false;

// **
// Main Window
// **
function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 580,
    width: 580,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('close', (e: Event) => {
    mainWindow.hide();
    !shouldQuit && e.preventDefault();
  });
}

// **
// Tray
// **
function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About',
      click: () => openAboutWindow(aboutWindow),
    },
    {
      label: 'Show Player',
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

  tray = new Tray(mainImages.playIcon);
  tray.setToolTip('Tray Tuner');
  tray.setIgnoreDoubleClickEvents(true);

  tray.on('click', () => {
    mainWindow.webContents.send('tray-clicked');
  });

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}

// **
// Listeners
// **
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === 'set-tray-play') {
    tray.setImage(mainImages.playIcon);
  }
  if (arg === 'set-tray-pause') {
    tray.setImage(mainImages.pauseIcon);
  }
  if (arg === 'toggle-dock-setting') {
    _toggleDockSetting();
  }
  if (arg === 'open-add-audio') {
    _openAddAudio();
  }
  if (arg === 'save-default-ahFm') {
    store.set('audio.source', randomSources.ahFm);
  }
  if (arg === 'save-default-revolution') {
    store.set('audio.source', randomSources.revolutionRadio);
  }
});

// **
// Listener Helpers
// **
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
  prompt(audioSourceDialog)
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
// App
// **
app.on('ready', () => {
  createTray();
  createMainWindow();
  loadSettings();
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  shouldQuit = true;
});
