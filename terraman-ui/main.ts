import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

const server = () => {}
const http = require('http').createServer(server);
const io = require('socket.io')(http);

http.listen(3000);

let setPoints = [
  {
    index: 0,
    temperature: 28,
    humidity: 70
  },
  {
    index: 1,
    temperature: 24,
    humidity: null
  },
];

io.on('connection', (socket) => {
  socket.on('status', (data) => {
    currentStatus = {
      ...JSON.parse(data)
    };
  });

  socket.on('request setpoints', (data) => {
    if(setPoints[data]) {
      socket.emit('setpoints', setPoints[data]);
    }
  });
});

let logEntries = [];

let currentStatus = {
  sensor1: {
    temp: null,
    humidity: null,
    heating: false,
    misting: false
  }
};

let win: BrowserWindow = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const log = (text, data?) => {
  console.log(text, data);
  logEntries = [
    ...logEntries,
    {
      text,
      data
    }
  ];
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
    setPoints[0] = newSetPoint;
  });

  ipcMain.on('requestStatus', (event, _) => {
    event.reply('statusReceived', currentStatus);
  });

  ipcMain.on('requestExit', (event, _) => {
    app.exit();
  });

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
