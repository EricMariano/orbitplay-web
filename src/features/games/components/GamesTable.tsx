import type { Game } from '@/api-types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type GamesTableProps = {
  games: Game[]
}

/**
 * Presentational: renders a list of games. Takes plain props instead of
 * fetching its own data, so it can be reused (a dialog, a search result
 * list, ...) or unit-tested without a QueryClient (SRP).
 */
export function GamesTable({ games }: GamesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game) => (
          <TableRow key={game.id}>
            <TableCell className="font-medium">{game.title}</TableCell>
            <TableCell>
              <Badge variant="secondary">{game.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
