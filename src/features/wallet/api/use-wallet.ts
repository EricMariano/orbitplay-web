import { useQuery } from '@tanstack/react-query'
import type { Wallet } from '@/api-types'
import { api } from '@/lib/api-client'
import { walletKeys } from './wallet-keys'

/** Get the current player's wallet balance. */
export function useWallet() {
  return useQuery({
    queryKey: walletKeys.balance(),
    queryFn: () => api.get<Wallet>('/wallet'),
  })
}
