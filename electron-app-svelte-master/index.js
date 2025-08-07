const { app, BrowserWindow } = require("electron");
const path = require("path");

try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  });
} catch (_) { console.log('Error'); }


app.on("ready", () => {
  const mainWindow = new BrowserWindow();
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.webContents.openDevTools();
});
