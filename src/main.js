const { app, ipcMain, shell, BrowserWindow, Menu, Tray, screen, dialog } = require('electron');
const path = require('node:path');

import { kbs } from './api/core';

import APP_ICO from './app_icon.png';
const APP_NAME = "Keyboard Sounds";

const AppIcon = path.join(__dirname, APP_ICO);

// Initialize variables to hold the tray and window objects.
let tray = null;
let mainWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const toggleWindow = () => {
  // Check if the window exists and isn't destroyed; if so,
  // focus or restore it.
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
      return;
    }

    if (!mainWindow.isVisible()) {
      mainWindow.show();
      return;
    }

    mainWindow.focus();
    return;
  }

  // Get the primary display's work area size
  const appWidth = 500;
  const appHeight = 800;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  // Calculate the x and y position for the window
  // Position the window on the bottom right of the screen
  const x = width - appWidth - 10;
  const y = height - appHeight - 10;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: x,
    y: y,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    hiddenInMissionControl: true,
    show: false,
    width: 500,
    height: 800,
    skipTaskbar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // Close the window when it loses focus.
  mainWindow.on('blur', () => {
    if (!kbs.openFileDialogIsOpen) {
      mainWindow.hide();
    }
  });

  // Make links open in browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on("before-input-event", (event, input) => { 
    if(input.code=='F4' && input.alt) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Set the main window for use with the IPC handlers
  kbs.setMainWindow(mainWindow);

  // Load IPC handlers
  kbs.registerKbsIpcHandler(ipcMain);
  kbs.registerStatusMonitor(ipcMain);
  kbs.registerAppRulesMonitor(ipcMain);
  kbs.registerProfilesMonitor(ipcMain);


  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open developer tools
  // mainWindow.webContents.openDevTools();

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
      dialog.showErrorBox('Keyboard Sounds: Error', 'Failed to retrieve Keyboard Sounds backend version.');
      process.exit(1);
    });
  }).catch((err) => {
    console.error('Failed to find Keyboard Sounds backend installation:', err);
    dialog.showErrorBox('Keyboard Sounds: Error', 'Keyboard Sounds backend is not installed or not functioning properly. Please install the Keyboard Sounds backend from https://keyboardsounds.net/ and try again.');
    process.exit(1);
  });

  toggleWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      toggleWindow();
    }
  });

  // Create a system tray icon and context menu for the application.
  tray = new Tray(AppIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', type: 'normal', click: () => {
      kbs.exec('stop').finally(() => {
        process.exit(0);
      });
    }},
  ]);
  tray.setToolTip(APP_NAME);
  tray.setContextMenu(contextMenu);

  // Allow the user to double-click the tray icon to open
  // or focus the application window.
  tray.on('click', toggleWindow);
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
