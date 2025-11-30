const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Windows Live Wallpaper Integration
 * This module provides functionality to set the Electron window as a live wallpaper
 */

class WindowsWallpaper {
  constructor(window) {
    this.window = window;
    this.isActive = false;
  }

  /**
   * Activate live wallpaper mode
   */
  async activate() {
    if (process.platform !== 'win32') {
      console.log('Live wallpaper only supported on Windows');
      return false;
    }

    try {
      // Get the native window handle
      const hwnd = this.window.getNativeWindowHandle();
      
      // PowerShell script to set window as wallpaper
      const script = `
        Add-Type @"
          using System;
          using System.Runtime.InteropServices;
          public class WallpaperHelper {
            [DllImport("user32.dll", SetLastError = true)]
            public static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);
            
            [DllImport("user32.dll", SetLastError = true)]
            public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
            
            [DllImport("user32.dll")]
            public static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
          }
"@
        # Find the Program Manager window (desktop)
        $progman = [WallpaperHelper]::FindWindow("Progman", $null)
        
        # Send message to spawn WorkerW
        [WallpaperHelper]::SendMessage($progman, 0x052C, 0, 0)
        
        # Your app window will be set as child of WorkerW
        # This makes it appear behind desktop icons
      `;

      // Configure window for wallpaper mode
      this.window.setAlwaysOnBottom(true);
      this.window.setSkipTaskbar(true);
      this.window.setIgnoreMouseEvents(true, { forward: true });
      this.window.setResizable(false);
      this.window.setMovable(false);
      
      // Maximize to full screen
      this.window.maximize();
      this.window.setFullScreen(false); // Not fullscreen, just maximized behind everything

      this.isActive = true;
      console.log('Live wallpaper activated');
      return true;

    } catch (error) {
      console.error('Failed to activate live wallpaper:', error);
      return false;
    }
  }

  /**
   * Deactivate live wallpaper mode
   */
  deactivate() {
    this.window.setAlwaysOnBottom(false);
    this.window.setSkipTaskbar(false);
    this.window.setIgnoreMouseEvents(false);
    this.window.setResizable(true);
    this.window.setMovable(true);
    
    this.isActive = false;
    console.log('Live wallpaper deactivated');
  }

  /**
   * Check if live wallpaper is active
   */
  isWallpaperActive() {
    return this.isActive;
  }

  /**
   * Set window to auto-start with Windows
   */
  async setAutoStart(enable = true) {
    if (process.platform !== 'win32') return false;

    try {
      const appPath = process.execPath.replace(/\\/g, '\\\\');
      const regKey = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run';
      const appName = 'LiveClockWallpaper';

      if (enable) {
        // Add to startup
        await execPromise(`reg add "${regKey}" /v "${appName}" /t REG_SZ /d "\\"${appPath}\\" --hidden" /f`);
        console.log('Auto-start enabled');
      } else {
        // Remove from startup
        await execPromise(`reg delete "${regKey}" /v "${appName}" /f`);
        console.log('Auto-start disabled');
      }

      return true;
    } catch (error) {
      console.error('Failed to set auto-start:', error);
      return false;
    }
  }
}

module.exports = WindowsWallpaper;
