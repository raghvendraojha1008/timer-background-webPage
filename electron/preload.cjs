const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,
  // Add any other APIs you need to expose to the renderer
  onNavigateToSettings: (callback) => {
    ipcRenderer.on('navigate-to-settings', callback);
  },
});
