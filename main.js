const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const isDev = require('electron-is-dev');
const lottie = require('lottie-web');


let mainWindow;
let flaskProcess = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 825,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.setMenuBarVisibility(false);

    // If in development, start the Flask server and load localhost,
    // otherwise load the index.html file
    if (isDev) {
        // Run the Flask app
        flaskProcess = spawn('python', [path.join(__dirname, 'main.py')]);

        // Output Flask stdout to console
        flaskProcess.stdout.on('data', (data) => {
            console.log(`Flask: ${data}`);
        });

        // Output Flask stderr (errors) to console
        flaskProcess.stderr.on('data', (data) => {
            console.error(`Flask Error: ${data}`);
        });

        // Load the Flask app
        mainWindow.loadURL('http://127.0.0.1:5000/');
    } else {
        // Load the built version of your app
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
        if (flaskProcess != null) {
            flaskProcess.kill();
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Quit the Flask server when the Electron app exits
app.on('will-quit', () => {
    if (flaskProcess) {
        flaskProcess.kill();
    }
});
