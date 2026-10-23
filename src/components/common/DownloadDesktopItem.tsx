import { Icon } from '@/components/icon'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { getDesktopDownload } from '@/lib/desktop'

/** Item de menu "Baixar app para <sistema>". Some sozinho quando não se aplica. */
export function DownloadDesktopItem() {
  const download = getDesktopDownload()
  if (!download) return null

  return (
    <DropdownMenuItem asChild>
      <a href={download.url} target="_blank" rel="noreferrer">
        <Icon name="download" />
        Baixar app para {download.label}
      </a>
    </DropdownMenuItem>
  )
}
