/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: main.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-15T22:14:55-05:00
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

const { User } = require('rekuire')('middleware_parse.js');

let user;

require('electron-context-menu')({
  prepend: params => [{
    // Only show it when right-clicking images
    visible: params.mediaType === 'image',
  }],
});

// ipc listeners
ipcMain.on('logout-request', (event, data) => {
  logger.log('debug', 'Logging User Out', {
    file: THISFILE,
    data: {
      data,
    },
  });
  user.logout().then(
    doneCallbacks => event.sender.send('logout-result',
      doneCallbacks),
    failCallbacks => event.sender.send('logout-result',
      failCallbacks),
  );
});

ipcMain.on('form-signup-submission', (event, data) => {
  logger.log('debug', 'Creating new user', {
    file: THISFILE,
    data: {
      data,
    },
  });
  user = new User(data);
  user.signUp().then(
    doneCallbacks => event.sender.send('signup-result',
      doneCallbacks),
    failCallbacks => event.sender.send('signup-result',
      failCallbacks),
  );
});

ipcMain.on('form-login-submission', (event, data) => {
  logger.log('debug', 'Logging user in', {
    file: THISFILE,
    data: {
      data,
    },
  });
  user = new User(data);
  user.login().then(
    doneCallbacks => event.sender.send('login-result',
      doneCallbacks),
    failCallbacks => event.sender.send('login-result',
      failCallbacks),
  );
});

ipcMain.on('get-profile-info', (event) => {
  logger.log('debug', 'Retrieving Info on user.', {
    file: THISFILE,
    data: {
      user,
    },
  });
  user.getUserInfo().then(
    doneCallbacks => event.sender.send(
      'profile-info-result', {
        profileExists: true,
        results: doneCallbacks,
      }));
});

ipcMain.on('update-profile-info', (event, data) => {
  logger.log('debug', 'Updated User Profile', {
    file: THISFILE,
    data: {
      data,
    },
  });
  user.updateUserInfo(data);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({
    strategy: 'react-hmr',
  });
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 800,
    minWidth: 800,
    minHeight: 800,
    icon: `${__dirname}/assets/icons/png/64x64.png`,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  // Open the DevTools.
  if (isDevMode) {
    logger.log('silly', 'Opening with Web Dev Mode.', {
      file: THISFILE,
    });
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows in an array if
    // your app supports multi windows, this is the time when you should delete the
    // corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished initialization and is
// ready to create browser windows. Some APIs can only be used after this event
// occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar to stay active until
  // the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the dock icon is
  // clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
