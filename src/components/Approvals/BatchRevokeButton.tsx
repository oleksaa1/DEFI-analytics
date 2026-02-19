'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { ERC20_ABI } from '@/lib/contracts';
import type { ApprovalWithRisk } from '@/types';
import { Loader2, ShieldOff, CheckCircle, XCircle } from 'lucide-react';

interface BatchRevokeButtonProps {
  approvals: ApprovalWithRisk[];
  onSuccess: () => void;
}

export default function BatchRevokeButton({
  approvals,
  onSuccess,
}: BatchRevokeButtonProps) {
  const [isRevoking, setIsRevoking] = useState(false);
  const [progress, setProgress] = useState({ done: 0, failed: 0, total: 0 });
  const { writeContractAsync } = useWriteContract();

  const highRiskApprovals = approvals.filter((a) => a.riskLevel === 'high');

  if (highRiskApprovals.length === 0) return null;

  const handleBatchRevoke = async () => {
    setIsRevoking(true);
    const total = highRiskApprovals.length;
    setProgress({ done: 0, failed: 0, total });

    let done = 0;
    let failed = 0;

    for (const approval of highRiskApprovals) {
      try {
        await writeContractAsync({
          address: approval.token.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [approval.spender.address as `0x${string}`, BigInt(0)],
        });
        done++;
      } catch (error) {
        console.error(`Revoke failed for ${approval.token.symbol}:`, error);
        failed++;
      }
      setProgress({ done, failed, total });
    }

    setIsRevoking(false);
    if (done > 0) onSuccess();
  };

  const isInProgress = isRevoking && progress.total > 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleBatchRevoke}
        disabled={isRevoking}
        className="inline-flex items-center gap-2 rounded-lg bg-destructive text-white hover:bg-destructive/90 px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRevoking ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Revoking {progress.done + progress.failed}/{progress.total}...
          </>
        ) : (
          <>
            <ShieldOff className="h-4 w-4" />
            Revoke All {highRiskApprovals.length} High-Risk
          </>
        )}
      </button>

      {isInProgress && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {progress.done > 0 && (
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle className="h-3 w-3" /> {progress.done}
            </span>
          )}
          {progress.failed > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <XCircle className="h-3 w-3" /> {progress.failed}
            </span>
          )}
        </div>
      )}

      {!isRevoking && progress.total > 0 && (
        <span className="text-xs text-muted-foreground">
          Done: {progress.done} revoked, {progress.failed} failed
        </span>
      )}
    </div>
  );
}
