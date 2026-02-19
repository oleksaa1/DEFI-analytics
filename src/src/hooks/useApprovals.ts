'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { MoralisApproval, MoralisPaginatedResponse, ApprovalWithRisk } from '@/types';
import { analyzeApprovals } from '@/lib/riskAnalysis';

export function useApprovals() {
  const { address, isConnected } = useAccount();

  return useQuery<ApprovalWithRisk[]>({
    queryKey: ['approvals', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=approvals`
      );
      if (!res.ok) throw new Error('Failed to fetch approvals');
      const data: MoralisPaginatedResponse<MoralisApproval> = await res.json();
      return analyzeApprovals(data.result || []);
    },
    enabled: isConnected && !!address,
    staleTime: 60_000,
  });
}
