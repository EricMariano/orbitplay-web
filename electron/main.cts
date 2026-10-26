import { app, BrowserWindow, dialog, shell } from 'electron'
import path from 'node:path'

// Em dev o app abre o Vite (`pnpm dev`, porta 5173). Empacotado, abre o site
// hospedado — mesma origem do site, então cookie httpOnly e `/api` funcionam
// sem mudar nada no front nem na API.
// TODO(prod-url): preencher com a URL de produção quando existir.
const PROD_URL = ''
const DEV_URL = 'http://localhost:5173'

const isDev = !app.isPackaged
const appUrl = isDev ? DEV_URL : PROD_URL

let mainWindow: BrowserWindow | null = null

function isInternal(url: string): boolean {
  try {
    return new URL(url).origin === new URL(appUrl).origin
  } catch {
    return false
  }
}

async function loadApp(win: BrowserWindow): Promise<void> {
  if (!appUrl) {
    await dialog.showMessageBox(win, {
      type: 'error',
      message: 'URL do OrbitPlay não configurada.',
      detail: 'Defina PROD_URL em electron/main.cts e gere o app de novo.',
    })
    app.quit()
    return
  }
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

  void app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
