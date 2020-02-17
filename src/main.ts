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
});

function _toggleTrayIcon() {
  // Temporary test location for dialog prompt
  prompt({
    title: 'Tray Tuner',
    label: 'Audio URL:',
    value: 'http://example.org',
    inputAttrs: {
      type: 'url',
    },
    resizable: true,
  })
    .then((res: any) => {
      if (res === null) {
        console.log('user cancelled');
      } else {
        console.log('result', res);
      }
    })
    .catch(console.error);

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

// **
// Load Settings
// **
function loadSettings() {
  const shouldHideDock = store.get('setting.hideDock');

  if (shouldHideDock) {
    app.dock.hide();
    hideInDock = true;
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('dock-setting-enabled');
    });
  }
}

// **
// Initiate main functions
// **
app.on('ready', () => {
  createTray();
  createWindow();
  loadSettings();
});
