import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

const serialport = require('serialport');
const Readline = require('@serialport/parser-readline');
let port;
let currentStatus;
let setPoint = 30;

let win: BrowserWindow = null;
let serialPorts = [];

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const startSerialComm = async () => {
  console.log('Create serial comm');
  try {
    serialPorts = await serialport.list();
    console.log('Ports', serialPorts);
    port = new serialport(serialPorts[0].path);
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
    parser.on('data', processData)
  } catch (err) {
    console.error('serialPortError', err);
  }
}

const processRequest = (request: string) => {
  switch (request) {
    case 'SETPOINT':
      port.write(`${setPoint}\n`, (err) => {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('message written')
      });
      break;
  }
}

const processStatus = (status: string) => {
  currentStatus = JSON.parse(status);
}

const processData = (data: string) => {
  console.log(data);
  if (data === 'HI TERRAMAN') {
    console.log('Replying with HI TERRAMAN');
    port.write('HI TERRAMAN\n', (err) => {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('message written')
    });
    return;
  }

  if (data.startsWith('REQ')) {
    processRequest(data.split('=')[1].trim());
    return;
  }

  if (data.startsWith('STATUS')) {
    processStatus(data.split('=')[1].trim());
    return;
  }
}

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
    frame: true,
    fullscreen: true
  });

  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  ipcMain.on('changeSetPoint', (event, newSetPoint) => {
    console.log('Received changeSetPoint', newSetPoint);
    setPoint = newSetPoint;
  });

  ipcMain.on('requestStatus', (event, _) => {
    console.log('Received requestStatus');
    event.reply('statusReceived', currentStatus);
  });

  startSerialComm();

  return win;
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
