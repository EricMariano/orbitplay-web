import { app, BrowserWindow, dialog, session, shell } from 'electron'
import path from 'node:path'
import { LOCAL_SERVER_HOST, startLocalServer } from './local-server.cjs'

// Em dev o app abre o Vite (`pnpm dev`). Empacotado, serve o `dist/` num
// servidor local na mesma porta do dev e repassa `/api` para a API, que fica
// fora do app (ORBITPLAY_API_URL, padrão `http://localhost:3000`) — cookie
// httpOnly e `/api` relativo funcionam sem mudar front nem API.
const PORT = 5173
const API_URL = process.env.ORBITPLAY_API_URL ?? 'http://localhost:3000'
// Empacotado, a janela abre no mesmo endereço em que o servidor local escuta.
// Com `localhost` o Chromium tenta `::1` primeiro, e outro processo escutando em
// `[::1]:5173` receberia a janela e o cookie de sessão. Em dev fica `localhost`,
// onde o Vite escuta (no macOS, só em `::1`).
const appUrl = `http://${app.isPackaged ? LOCAL_SERVER_HOST : 'localhost'}:${PORT}`

let mainWindow: BrowserWindow | null = null

function isInternal(url: string): boolean {
  try {
    return new URL(url).origin === new URL(appUrl).origin
  } catch {
    return false
  }
}

// Sem handler, o Electron aprova qualquer permissão pedida por qualquer página.
// O app só precisa destas: gravação da sessão (`media` e `display-capture`),
// tela cheia dos vídeos e cópia para a área de transferência.
const ALLOWED_PERMISSIONS = new Set<string>([
  'media',
  'display-capture',
  'fullscreen',
  'clipboard-sanitized-write',
])

function restrictPermissions(): void {
  const ses = session.defaultSession
  ses.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    callback(ALLOWED_PERMISSIONS.has(permission) && isInternal(details.requestingUrl))
  })
  ses.setPermissionCheckHandler(
    (_webContents, permission, requestingOrigin) =>
      ALLOWED_PERMISSIONS.has(permission) && isInternal(requestingOrigin),
  )
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
    restrictPermissions()
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
