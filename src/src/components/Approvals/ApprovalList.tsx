'use client';

import { useApprovals } from '@/hooks/useApprovals';
import { getRiskStats } from '@/lib/riskAnalysis';
import {
  shortenAddress,
  getExplorerUrl,
  isUnlimitedApproval,
  timeAgo,
  formatUSD,
} from '@/lib/utils';
import { ERC20_ABI } from '@/lib/contracts';
import RiskBadge from './RiskBadge';
import { ExternalLink, Loader2, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useWriteContract, useAccount } from 'wagmi';
import { useState } from 'react';
import type { ApprovalWithRisk } from '@/types';

function RevokeButton({
  approval,
  onSuccess,
}: {
  approval: ApprovalWithRisk;
  onSuccess: () => void;
}) {
  const [isRevoking, setIsRevoking] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      await writeContractAsync({
        address: approval.token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [approval.spender.address as `0x${string}`, BigInt(0)],
      });
      onSuccess();
    } catch (error) {
      console.error('Revoke failed:', error);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <button
      onClick={handleRevoke}
      disabled={isRevoking}
      className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
    >
      {isRevoking ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Revoking...
        </>
      ) : (
        'Revoke'
      )}
    </button>
  );
}

export default function ApprovalList() {
  const { isConnected } = useAccount();
  const { data: approvals, isLoading, error, refetch } = useApprovals();

  if (!isConnected) {
    return (
      <div className="rounded-xl bg-card border border-border p-12 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground text-sm">
          Connect your wallet to scan token approvals
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Token Approvals</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Scanning approvals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">Token Approvals</h3>
        <p className="text-muted-foreground text-sm">Failed to load approvals</p>
      </div>
    );
  }

  const stats = getRiskStats(approvals || []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl bg-card border border-border p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Approvals</p>
        </div>
        <div className="rounded-xl bg-card border border-red-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{stats.high}</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ShieldAlert className="h-3 w-3" /> High Risk
          </p>
        </div>
        <div className="rounded-xl bg-card border border-yellow-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Medium
          </p>
        </div>
        <div className="rounded-xl bg-card border border-green-500/20 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.low}</p>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Low Risk
          </p>
        </div>
      </div>

      {/* Approval List */}
      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">All Approvals</h3>
          <button
            onClick={() => refetch()}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Refresh
          </button>
        </div>

        {(approvals || []).length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="font-medium">No active approvals</p>
            <p className="text-muted-foreground text-sm mt-1">
              Your wallet has no token approvals on BNB Chain
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {(approvals || []).map((approval, idx) => (
              <div
                key={`${approval.token.address}-${approval.spender.address}-${idx}`}
                className={`rounded-lg border p-4 transition-colors ${
                  approval.riskLevel === 'high'
                    ? 'border-red-500/20 bg-red-500/5'
                    : approval.riskLevel === 'medium'
                    ? 'border-yellow-500/20 bg-yellow-500/5'
                    : 'border-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Token Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {approval.token.logo ? (
                      <img
                        src={approval.token.logo}
                        alt={approval.token.symbol}
                        className="w-8 h-8 rounded-full shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                        {approval.token.symbol?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {approval.token.symbol || 'Unknown'}
                        </span>
                        <RiskBadge level={approval.riskLevel} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Spender:{' '}
                        {approval.spender.address_label ||
                          shortenAddress(approval.spender.address)}
                        <a
                          href={getExplorerUrl(approval.spender.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex ml-1 text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Amount & Date */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-sm">
                        {isUnlimitedApproval(approval.value) ? (
                          <span className="text-red-400 font-medium">
                            Unlimited
                          </span>
                        ) : (
                          <span>{approval.value_formatted}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(approval.block_timestamp)}
                      </p>
                    </div>

                    <RevokeButton
                      approval={approval}
                      onSuccess={() => refetch()}
                    />
                  </div>
                </div>

                {/* Risk Reason */}
                <p className="text-xs text-muted-foreground mt-2">
                  {approval.riskReason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
