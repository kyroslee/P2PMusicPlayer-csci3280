const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const httpSrv = require('./httpSrv.js')

let win;
app.on('ready', _ => {
    win = new BrowserWindow();
    win.on('close', _ => process.exit());
    win.loadURL(`file://${__dirname}/../render/index.html`);
    httpSrv.start();
});
