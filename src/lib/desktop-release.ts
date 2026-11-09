// Onde ficam os instaladores do app desktop. O workflow `desktop-release`
// (.github/workflows/desktop-release.yml) gera os três a cada merge na `main`
// que mexe no app e substitui os arquivos da Release fixa `desktop-latest`, então
// estes links sempre apontam para o build mais recente — ninguém precisa gerar o
// instalador na própria máquina. Também é importado pelo vite.config.ts.
export const DESKTOP_RELEASE_URL =
  'https://github.com/EricMariano/orbitplay-web/releases/download/desktop-latest'

/** Nomes fixos dos instaladores (os mesmos do `artifactName` no package.json). */
export const DESKTOP_INSTALLER_FILES = {
  win: 'OrbitPlay-Setup.exe',
  mac: 'OrbitPlay.dmg',
  linux: 'OrbitPlay.AppImage',
} as const
