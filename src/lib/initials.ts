/**
 * First letter of up to the first two words of a title, uppercased — used
 * as a placeholder monogram wherever cover art is unavailable.
 */
export function getInitials(title: string): string {
  return title
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
