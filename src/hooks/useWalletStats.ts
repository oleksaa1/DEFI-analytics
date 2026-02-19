'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisWalletStats } from '@/types';

export function useWalletStats() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisWalletStats>({
    queryKey: ['walletStats', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=wallet_stats`
      );
      if (!res.ok) throw new Error('Failed to fetch wallet stats');
      return res.json();
    },
    enabled: isConnected && !!address,
    staleTime: 60_000,
  });
}
