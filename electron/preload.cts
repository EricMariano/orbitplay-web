import { contextBridge } from 'electron'

// Ponte mínima e segura: o site só enxerga o que for exposto aqui.
// Adicione novas capacidades (notificações, badge, etc.) via ipcRenderer.invoke.
contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  platform: process.platform,
})
