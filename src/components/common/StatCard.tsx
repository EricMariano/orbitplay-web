type StatCardProps = {
  label: string
  value: string | number
}

/**
 * Small label/value tile. Used to build the summary row above a dashboard
 * grid (studio games, player opportunities, ...) — a single presentational
 * atom instead of a bespoke summary card per feature, so every dashboard
 * gets the same look for free (SRP + reuse).
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="min-w-[160px] flex-1 rounded-xl border border-border bg-surface/60 px-4 py-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
