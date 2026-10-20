import { useState } from 'react'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { useCreateReportExport, useReportExport } from '../api/use-report-export'

export function ReportExportMenu({ testId }: { testId: string }) {
  const createExport = useCreateReportExport(testId)
  const [exportId, setExportId] = useState<string | null>(null)
  const reportExport = useReportExport(testId, exportId)
  const current = reportExport.data

  function request(format: 'csv' | 'pdf') {
    createExport.mutate({ format }, { onSuccess: (created) => setExportId(created.id) })
  }

  if (current?.status === 'ready' && current.downloadUrl) {
    return (
      <Button asChild variant="outline" size="sm">
        <a href={current.downloadUrl} target="_blank" rel="noreferrer">
          <Icon name="download" /> Baixar {current.format.toUpperCase()}
        </a>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={createExport.isPending || current?.status === 'processing'}
        onClick={() => request('csv')}
      >
        <Icon name="file-sheet" /> CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={createExport.isPending || current?.status === 'processing'}
        onClick={() => request('pdf')}
      >
        <Icon name="file-pdf" /> PDF
      </Button>
      {current?.status === 'processing' ? (
        <span className="text-xs text-muted">Preparando exportação…</span>
      ) : null}
      {current?.status === 'failed' ? (
        <span className="text-xs text-destructive">
          {current.failureReason ?? 'Não foi possível exportar.'}
        </span>
      ) : null}
    </div>
  )
}
