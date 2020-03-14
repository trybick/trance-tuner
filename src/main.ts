import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } from 'electron';
import prompt from 'electron-prompt';
import openAboutWindow from 'about-window';
import * as path from 'path';
import {
  aboutWindow,
  audioSourceDialog,
  mainImages,
  store,
  randomSources,
  windowHeightWithDrawerClosed,
} from './helpers/constants';

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;
let hideInDock = false;
let shouldQuit = false;

// **
// Main Window
// **
function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: windowHeightWithDrawerClosed,
    width: 310,
    icon: __dirname + '/images/music-record.ico',
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
  switch (arg) {
    case 'set-tray-play':
      tray.setImage(mainImages.playIcon);
      break;
    case 'set-tray-pause':
      tray.setImage(mainImages.pauseIcon);
      break;
    case 'toggle-dock-setting':
      _toggleDockSetting();
      break;
    case 'open-edit-audio-dialog':
      _openEditAudioDialog();
      break;
    // This method of saving default sources = not ideal :)
    case 'save-default-ahFm':
      store.set('audio.source', randomSources.ahFm);
      break;
    case 'save-default-revolution':
      store.set('audio.source', randomSources.revolutionRadio);
      break;
    case 'save-default-movedahouse':
      store.set('audio.source', randomSources.moveDaHouse);
      break;
    case 'decrease-window-size':
      mainWindow.setSize(310, windowHeightWithDrawerClosed);
      break;
    case 'increase-window-size':
      mainWindow.setSize(310, 500);
      break;
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

function _openEditAudioDialog() {
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
// Keyboard Shortcuts
//

function registerKeyboardShortcuts() {
  globalShortcut.register('CommandOrControl+Ctrl+Shift+Z', () => {
    mainWindow.webContents.send('kbd-toggle-play');
  });

  globalShortcut.register('CommandOrControl+Ctrl+Shift+R', () => {
    mainWindow.webContents.send('kbd-random-source');
  });

  globalShortcut.register('CommandOrControl+Ctrl+Shift+W', () => {
    mainWindow.show();
  });
}

// **
// App
// **
app.on('ready', () => {
  createTray();
  createMainWindow();
  loadSettings();
  registerKeyboardShortcuts();
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  shouldQuit = true;
  globalShortcut.unregisterAll();
});
