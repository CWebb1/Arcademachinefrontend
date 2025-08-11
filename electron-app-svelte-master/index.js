// This file is the main entry point for the Electron application.
// It initializes the Electron app, creates the main window, and sets up IPC communication.
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const winShortcuts = require('windows-shortcuts');

try {
  require('electron-reloader')(module, {
    debug: true,
    watchRenderer: true
  });
} catch (_) { console.log('Error'); }



let mainWindow;
let gamesWatcher = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  // Only remove the menu bar in production (when built)
  if (process.env.NODE_ENV !== 'development') {
    mainWindow.setMenu(null);
  }
  // Only open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Start watching the Games folder after window is ready
  startGamesWatcher();
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

function getGamesPath() {
  const desktopPath = path.join(os.homedir(), 'Desktop');
  return path.join(desktopPath, 'Games');
}

// Function to resolve Windows shortcuts (.lnk files)
function resolveShortcut(shortcutPath) {
  return new Promise((resolve, reject) => {
    winShortcuts.query(shortcutPath, (error, result) => {
      if (error) {
        console.error('Error resolving shortcut:', error);
        resolve(null); // Resolve with null in case of error
      } else {
        resolve(result.target);
      }
    });
  });
}

async function getGamesFromFolder() {
  try {
    const gamesPath = getGamesPath();
    
    // Check if Games folder exists
    if (!fs.existsSync(gamesPath)) {
      console.log('Games folder not found at:', gamesPath);
      return [];
    }
    
    // Read all files in the Games folder
    const files = fs.readdirSync(gamesPath);
    
    // Process game files (both .exe and .lnk)
    const gameFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.exe' || ext === '.lnk';
    });
    
    // Process each game file
    const gamePromises = gameFiles.map(async file => {
      const filePath = path.join(gamesPath, file);
      const ext = path.extname(file).toLowerCase();
      
      // Handle different file types
      let exePath, gameName;
      
      if (ext === '.exe') {
        // Direct EXE file
        exePath = filePath;
        gameName = path.basename(file, '.exe');
      } else if (ext === '.lnk') {
        // Shortcut file - need to resolve target
        const target = await resolveShortcut(filePath);
        
        // Only include shortcuts that point to EXE files
        if (!target || path.extname(target).toLowerCase() !== '.exe') {
          console.log(`Shortcut ${file} does not point to an EXE file`);
          return null;
        }
        
        exePath = target;
        gameName = path.basename(file, '.lnk');
      }
      
      // Look for custom images
      const pngPath = path.join(gamesPath, `${gameName}.png`);
      const jpgPath = path.join(gamesPath, `${gameName}.jpg`);
      const jpegPath = path.join(gamesPath, `${gameName}.jpeg`);
      
      // Check for custom image files
      let customImage = null;
      if (fs.existsSync(pngPath)) {
        customImage = pngPath;
      } else if (fs.existsSync(jpgPath)) {
        customImage = jpgPath;
      } else if (fs.existsSync(jpegPath)) {
        customImage = jpegPath;
      }
      
      return {
        exePath,
        customImage,
        gameName,
        isShortcut: ext === '.lnk'
      };
    });
    
    // Wait for all promises to resolve and filter out null values
    const results = await Promise.all(gamePromises);
    const games = results.filter(game => game !== null);
    
    console.log('Found games:', games);
    return games;
  } catch (error) {
    console.error('Error scanning games folder:', error);
    return [];
  }
}

function startGamesWatcher() {
  const gamesPath = getGamesPath();
  
  // Create Games folder if it doesn't exist
  if (!fs.existsSync(gamesPath)) {
    try {
      fs.mkdirSync(gamesPath, { recursive: true });
      console.log('Created Games folder at:', gamesPath);
    } catch (error) {
      console.error('Failed to create Games folder:', error);
      return;
    }
  }

  try {
    // Watch for changes in the Games folder
    gamesWatcher = fs.watch(gamesPath, (eventType, filename) => {
      console.log(`Games folder changed: ${eventType} - ${filename}`);
      
      // React to .exe, .lnk file changes or image file changes
      if (filename) {
        const ext = path.extname(filename).toLowerCase();
        if (ext === '.exe' || ext === '.lnk' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
          // Small delay to ensure file operations are complete
          setTimeout(async () => {
            const games = await getGamesFromFolder();
            // Notify renderer process about games change
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('games-updated', games);
            }
          }, 100);
        }
      }
    });
    
    console.log('Started watching Games folder:', gamesPath);
  } catch (error) {
    console.error('Failed to watch Games folder:', error);
  }
}

// Cleanup watcher on app quit
app.on('before-quit', () => {
  if (gamesWatcher) {
    gamesWatcher.close();
    console.log('Stopped watching Games folder');
  }
});

ipcMain.handle('get-games-from-folder', async () => {
  return await getGamesFromFolder();
});
