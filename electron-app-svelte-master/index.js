const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  });
} catch (_) { console.log('Error'); }



app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.webContents.openDevTools();
});

const { execFile } = require('child_process');

ipcMain.handle('choose-exe', async () => {
  const result = await dialog.showOpenDialog({
    filters: [
      { name: 'Executable Files', extensions: ['exe'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.on('open-exe-path', (event, exePath) => {
  if (exePath) {
    execFile(exePath, (err) => {
      if (err) {
        console.error('Failed to open exe:', err);
      }
    });
  }
});
