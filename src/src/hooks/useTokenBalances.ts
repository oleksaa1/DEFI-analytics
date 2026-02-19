'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisTokenBalance, MoralisPaginatedResponse } from '@/types';

export function useTokenBalances() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisTokenBalance[]>({
    queryKey: ['tokenBalances', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=token_balances_prices`
      );
      if (!res.ok) throw new Error('Failed to fetch token balances');
      const data: MoralisPaginatedResponse<MoralisTokenBalance> = await res.json();
      return data.result || [];
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
  });
}
