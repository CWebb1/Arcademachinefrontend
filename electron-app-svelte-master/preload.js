const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    chooseExe: () => ipcRenderer.invoke('choose-exe'),
    openExePath: (path) => ipcRenderer.send('open-exe-path', path),
    getGamesFromFolder: () => ipcRenderer.invoke('get-games-from-folder'),
    onGamesUpdated: (callback) => ipcRenderer.on('games-updated', callback),
    removeGamesUpdatedListener: () => ipcRenderer.removeAllListeners('games-updated')
});
