const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');
const WindowsWallpaper = require('./wallpaper-windows.cjs');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let tray;
let wallpaper;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    frame: false,
    transparent: false,
    skipTaskbar: true,
    resizable: false,
    type: 'desktop', // This makes it behave like wallpaper
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Initialize wallpaper functionality
  wallpaper = new WindowsWallpaper(mainWindow);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Activate wallpaper mode after window is ready
  mainWindow.webContents.on('did-finish-load', () => {
    if (process.platform === 'win32') {
      setTimeout(() => {
        wallpaper.activate();
      }, 1000);
    }
  });
}

function createTray() {
  // Create tray icon
  const iconPath = path.join(__dirname, 'resources', 'tray-icon.png');
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Clock',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: 'Disable Wallpaper',
      click: () => {
        if (wallpaper && wallpaper.isWallpaperActive()) {
          wallpaper.deactivate();
          mainWindow.show();
        }
      }
    },
    {
      label: 'Enable Wallpaper',
      click: () => {
        if (wallpaper && !wallpaper.isWallpaperActive()) {
          wallpaper.activate();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('navigate-to-settings');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Live Clock Wallpaper');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Deactivate wallpaper before quitting
  if (wallpaper) {
    wallpaper.deactivate();
  }
});
