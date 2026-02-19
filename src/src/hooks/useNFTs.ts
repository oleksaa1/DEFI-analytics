'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisNFT, MoralisPaginatedResponse } from '@/types';

export function useNFTs() {
  const { address, isConnected } = useAccount();

  return useQuery<MoralisPaginatedResponse<MoralisNFT>>({
    queryKey: ['nfts', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=nfts`
      );
      if (!res.ok) throw new Error('Failed to fetch NFTs');
      return res.json();
    },
    enabled: isConnected && !!address,
    staleTime: 60_000,
  });
}
