'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { BATCH_REVOKE_ABI, BATCH_REVOKE_ADDRESS } from '@/lib/contracts';
import type { ApprovalWithRisk } from '@/types';
import { Loader2, ShieldOff } from 'lucide-react';

interface BatchRevokeButtonProps {
  approvals: ApprovalWithRisk[];
  onSuccess: () => void;
}

export default function BatchRevokeButton({
  approvals,
  onSuccess,
}: BatchRevokeButtonProps) {
  const [isRevoking, setIsRevoking] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const highRiskApprovals = approvals.filter((a) => a.riskLevel === 'high');

  if (highRiskApprovals.length === 0) return null;

  // If no BatchRevoke contract deployed yet, show disabled state
  const isContractDeployed =
    BATCH_REVOKE_ADDRESS !== '0x0000000000000000000000000000000000000000';

  const handleBatchRevoke = async () => {
    if (!isContractDeployed) return;

    setIsRevoking(true);
    try {
      const tokens = highRiskApprovals.map(
        (a) => a.token.address as `0x${string}`
      );
      const spenders = highRiskApprovals.map(
        (a) => a.spender.address as `0x${string}`
      );

      await writeContractAsync({
        address: BATCH_REVOKE_ADDRESS as `0x${string}`,
        abi: BATCH_REVOKE_ABI,
        functionName: 'batchRevoke',
        args: [tokens, spenders],
      });
      onSuccess();
    } catch (error) {
      console.error('Batch revoke failed:', error);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <button
      onClick={handleBatchRevoke}
      disabled={isRevoking || !isContractDeployed}
      className="inline-flex items-center gap-2 rounded-lg bg-destructive text-white hover:bg-destructive/90 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={
        !isContractDeployed
          ? 'BatchRevoke contract not yet deployed'
          : undefined
      }
    >
      {isRevoking ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Revoking {highRiskApprovals.length} approvals...
        </>
      ) : (
        <>
          <ShieldOff className="h-4 w-4" />
          Batch Revoke {highRiskApprovals.length} High-Risk Approvals
        </>
      )}
    </button>
  );
}
