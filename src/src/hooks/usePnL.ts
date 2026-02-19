'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisPnLSummary } from '@/types';

export function usePnL() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisPnLSummary | null>({
    queryKey: ['pnl', address],
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/moralis?address=${address}&action=pnl_summary`
        );
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
    enabled: isConnected && !!address,
    staleTime: 120_000,
  });
}
