const { app, BrowserWindow } = require('electron');
const path = require('path');

// ВАЖНО: Игнорировать ошибки сертификатов (только для разработки!)
app.commandLine.appendSwitch('ignore-certificate-errors');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Загружаем index.html из папки сборки Angular
  win.loadFile(path.join(__dirname, 'dist/proteya_notes/browser/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});