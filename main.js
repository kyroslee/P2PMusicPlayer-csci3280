const electron = require('electron');
const url = require('url');
const path = require('path');
const DB = require('./src/db.js');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let insertWindow;
let deleteWindow;
let searchWindow;

app.on('ready', function(){
    //create new window
    DB.create();
    console.log(DB.Display());
    mainWindow = new BrowserWindow({width: 1024, height:768});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //Quit handler
    mainWindow.on('closed', function(){
        DB.Disconnect();
        app.quit();
    });


    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createInsertWindow(){
    insertWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title:'Insert Music'
    });
    insertWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'insertWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    insertWindow.on('closed', function(){
        insertWindow = null;
    })
}

function createDeleteWindow(){
    deleteWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title:'Delete Music'
    });
    deleteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'deleteWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    deleteWindow.on('closed', function(){
        deleteWindow = null;
    })
}

function createSearchWindow(){
    searchWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title:'Search Music'
    });
    searchWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'searchWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    searchWindow.on('closed', function(){
        searchWindow = null;
    })
}

ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    insertWindow.close();
});

ipcMain.on('item:delete', function(e, item){
    mainWindow.webContents.send('item:delete', item);
    deleteWindow.close();
});

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Insert Song',
                click(){
                    createInsertWindow();
                }
            },
            {
                label: 'Delete Song',
                click(){
                    createDeleteWindow();
                }
            },
            {
                label: 'Search',
                click(){
                    createSearchWindow();
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]

    })
}
