import { app, BrowserWindow, ipcMain, Menu, Tray } from 'electron';
import prompt from 'electron-prompt';
import Store from 'electron-store';
import electronReloader from 'electron-reloader';
import * as path from 'path';
electronReloader(module);

const playIcon = path.join(__dirname, '../images/play.png');
const pauseIcon = path.join(__dirname, '../images/pause.png');
const store = new Store();
const randomSources = {
  ahFm: 'http://us2.ah.fm/192k/;stream/1',
  revolutionRadio: 'https://revolutionradio.ru:8443/live.mp3',
};

let tray: Tray | null = null;
let mainWindow: Electron.BrowserWindow;
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

  tray = new Tray(playIcon);
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
// Create Window
// **
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 580,
    width: 580,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// **
// Renderer Listener
// **
ipcMain.on('asynchronous-message', (event, arg) => {
  if (arg === 'set-tray-play') {
    tray.setImage(playIcon);
  }
  if (arg === 'set-tray-pause') {
    tray.setImage(pauseIcon);
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

// Keep app running after window closed
app.on('window-all-closed', (e: Event) => e.preventDefault());
