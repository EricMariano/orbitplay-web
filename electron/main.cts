import { app, BrowserWindow, dialog, shell } from 'electron'
import path from 'node:path'
import { startLocalServer } from './local-server.cjs'

// Em dev o app abre o Vite (`pnpm dev`). Empacotado, serve o `dist/` num
// servidor local na mesma porta/origem do dev e repassa `/api` para a API, que
// fica fora do app (ORBITPLAY_API_URL, padrão `http://localhost:3000`) —
// cookie httpOnly e `/api` relativo funcionam sem mudar front nem API.
const PORT = 5173
const API_URL = process.env.ORBITPLAY_API_URL ?? 'http://localhost:3000'
const appUrl = `http://localhost:${PORT}`

let mainWindow: BrowserWindow | null = null

function isInternal(url: string): boolean {
  try {
    return new URL(url).origin === new URL(appUrl).origin
  } catch {
    return false
  }
}

async function loadApp(win: BrowserWindow): Promise<void> {
  try {
    await win.loadURL(appUrl)
  } catch {
    // Dev server ainda subindo, ou sem internet: tenta de novo em instantes.
    setTimeout(() => void loadApp(win), 2000)
  }
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: '#0b0b0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
  mainWindow = win

  win.once('ready-to-show', () => win.show())
  win.on('closed', () => {
    mainWindow = null
  })

  // Links externos (target=_blank, window.open) abrem no navegador padrão.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })
  // Navegação para fora do app também vai para o navegador.
  win.webContents.on('will-navigate', (event, url) => {
    if (!isInternal(url)) {
      event.preventDefault()
      if (/^https?:\/\//.test(url)) void shell.openExternal(url)
    }
  })

  void loadApp(win)
}

// Só uma instância: abrir de novo apenas traz a janela existente para frente.
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })

  void app.whenReady().then(async () => {
    if (app.isPackaged) {
      try {
        await startLocalServer({
          root: path.join(app.getAppPath(), 'dist'),
          apiUrl: API_URL,
          port: PORT,
        })
      } catch {
        dialog.showErrorBox(
          'OrbitPlay',
          `Não foi possível abrir a porta ${PORT}. Feche o que estiver usando e tente de novo.`,
        )
        app.quit()
        return
      }
    }
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
