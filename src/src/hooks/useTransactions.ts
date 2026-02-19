'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisWalletHistoryItem, MoralisPaginatedResponse } from '@/types';

export function useWalletHistory() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisWalletHistoryItem[]>({
    queryKey: ['walletHistory', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=wallet_history`
      );
      if (!res.ok) throw new Error('Failed to fetch wallet history');
      const data: MoralisPaginatedResponse<MoralisWalletHistoryItem> = await res.json();
      return (data.result || []).filter((item) => !item.possible_spam);
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
  });
}
