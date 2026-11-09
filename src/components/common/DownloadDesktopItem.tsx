import { Icon } from '@/components/icon'
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { getDesktopDownloads } from '@/lib/desktop'

/**
 * Itens do menu para baixar o app desktop (Windows, macOS ou Linux), com o
 * sistema do visitante primeiro. Some sozinho quando não se aplica.
 */
export function DownloadDesktopItem() {
  const downloads = getDesktopDownloads()
  if (downloads.length === 0) return null

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted">Baixar app para desktop</DropdownMenuLabel>
      {downloads.map((download) => (
        <DropdownMenuItem key={download.platform} asChild>
          <a href={download.url} target="_blank" rel="noreferrer">
            <Icon name="download" />
            {download.label}
            {download.current && <span className="ml-auto text-xs text-muted">Seu sistema</span>}
          </a>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
    </>
  )
}
