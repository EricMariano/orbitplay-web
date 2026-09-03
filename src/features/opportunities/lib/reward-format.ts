const numberFormatter = new Intl.NumberFormat('pt-BR')

/**
 * Formats an opportunity's reward using pt-BR digit grouping. The API
 * doesn't declare a currency or unit for `reward` yet (see openapi.json —
 * it's a bare `number`), so this only normalizes the digits; add currency
 * formatting here once the contract specifies one, without touching call
 * sites (OCP).
 */
export function formatReward(reward: number): string {
  return numberFormatter.format(reward)
}
