import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';

let tray = null;
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' },
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
});

// let mainWindow: Electron.BrowserWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     height: 600,
//     width: 800,
//   });

//   mainWindow.loadFile(path.join(__dirname, '../index.html'));
//   mainWindow.webContents.openDevTools();

//   // Dereference the window object
//   mainWindow.on('closed', () => {
//     mainWindow = null;
//   });
// }

// app.on('ready', createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
