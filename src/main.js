const { app, ipcMain, shell, BrowserWindow, Menu, Tray } = require('electron');
const path = require('node:path');

import { kbs } from './api/core';

import APP_ICO from './app.ico';
const APP_NAME = "Keyboard Sounds";

const AppIcon = path.join(__dirname, APP_ICO);

// Initialize variables to hold the tray and window objects.
let tray = null;
let mainWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Check if the window exists and isn't destroyed; if so,
  // focus or restore it.
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    return;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Hide the menu bar
  // mainWindow.setMenuBarVisibility(false);

  // Make links open in browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load IPC handlers
  kbs.registerKbsIpcHandler(ipcMain);
  kbs.registerStatusMonitor(ipcMain);

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Dereference the window object when the window is 
  // closed to free up memory.
  mainWindow.on('closed', () => {
    mainWindow = null; // Dereference the window object
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Verify that Keyboard Sounds back-end is installed and functioning.
  kbs.checkInstallation().then(() => {
    kbs.version().then(version => {
      console.log(`Found Keyboard Sounds backend installation with version: ${version}`);
    }).catch((err) => {
      console.error('Failed to get Keyboard Sounds backend version:', err);
    });
  }).catch((err) => {
    console.error('Failed to find Keyboard Sounds backend installation:', err);
  });

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Create a system tray icon and context menu for the application.
  tray = new Tray(AppIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', click: () => app.quit()},
  ]);
  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);

  // Allow the user to double-click the tray icon to open
  // or focus the application window.
  tray.on('double-click', createWindow);
});

// Display a notification when the application is closed
// but still running in the background.
app.on('window-all-closed', () => {
  tray.displayBalloon({
    title: APP_NAME,
    content: `${APP_NAME} is still running in the background.`,
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
