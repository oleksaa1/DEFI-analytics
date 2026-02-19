'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisTokenSwap, MoralisPaginatedResponse } from '@/types';

export function useSwaps() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisTokenSwap[]>({
    queryKey: ['swaps', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=token_swaps`
      );
      if (!res.ok) throw new Error('Failed to fetch swaps');
      const data: MoralisPaginatedResponse<MoralisTokenSwap> = await res.json();
      return data.result || [];
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
  });
}
