const electron = require('electron');
const {app, BrowserWindow} = electron;
const httpSrv = require('./httpSrv.js')


if(!process.argv[2]) {
    console.error('Error: no config file provided');
    process.exit(1);
}

const config = require(`${process.cwd()}/${process.argv[2]}`);
httpSrv.start(config.mediaPath);

let win;
app.on('ready', _ => {
    let screenSize = electron.screen.getPrimaryDisplay().size;
    win = new BrowserWindow({
        width: screenSize.width,
        height: screenSize.height
    });
    win.on('close', _ => process.exit());
    win.loadURL(`file://${__dirname}/../render/index.html`);
});
