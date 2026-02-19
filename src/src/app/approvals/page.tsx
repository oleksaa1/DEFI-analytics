'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ApprovalList from '@/components/Approvals/ApprovalList';
import BatchRevokeButton from '@/components/Approvals/BatchRevokeButton';
import { useApprovals } from '@/hooks/useApprovals';
import { ShieldAlert } from 'lucide-react';

function ApprovalsContent() {
  const { data: approvals, refetch } = useApprovals();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Approval Scanner</h1>
          <p className="text-sm text-muted-foreground">
            Review and revoke token approvals to protect your assets
          </p>
        </div>
        {approvals && approvals.length > 0 && (
          <BatchRevokeButton
            approvals={approvals}
            onSuccess={() => refetch()}
          />
        )}
      </div>

      {/* Warning Banner */}
      <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-400">
            Why check approvals?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Token approvals allow smart contracts to spend your tokens. Unlimited
            approvals to unknown or compromised contracts can lead to complete
            loss of funds. Regularly review and revoke unnecessary approvals.
          </p>
        </div>
      </div>

      {/* Approval List */}
      <ApprovalList />
    </div>
  );
}

export default function ApprovalsPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Connect your wallet to scan token approvals and identify security
          risks.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return <ApprovalsContent />;
}
