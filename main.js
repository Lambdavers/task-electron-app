const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require("path");

function createWindow () {
    isQuiting = false

    const mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: "./favicon.ico",
    })

    mainWindow.setMenu(null)

    mainWindow.loadURL('https://task.lambdavers.fr/')

    mainWindow.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            event.returnValue = false;
        }
    });

    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });

    let tray = new Tray(path.join(__dirname, 'favicon.ico'));

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Afficher l\'app', click: function () {
                mainWindow.show();
            }
        },{
            type: "separator"
        },{
            label: 'Quitter', click: function () {
                isQuiting = true;
                app.quit();
            }
        },
    ]));

    tray.on('click', function(e){
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    });

}
app.allowRendererProcessReuse = true
app.setAppUserModelId("Tâches Lambdavers")

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})