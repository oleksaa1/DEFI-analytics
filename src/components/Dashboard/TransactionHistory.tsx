'use client';

import { useWalletHistory } from '@/hooks/useTransactions';
import { shortenAddress, getExplorerUrl, timeAgo } from '@/lib/utils';
import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  ImageIcon,
  CheckCircle,
  Flame,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  send: { icon: ArrowUpRight, color: 'text-red-400 bg-red-500/10', label: 'Send' },
  receive: { icon: ArrowDownLeft, color: 'text-green-400 bg-green-500/10', label: 'Receive' },
  'token swap': { icon: ArrowRightLeft, color: 'text-blue-400 bg-blue-500/10', label: 'Swap' },
  'token send': { icon: ArrowUpRight, color: 'text-orange-400 bg-orange-500/10', label: 'Token Send' },
  'token receive': { icon: ArrowDownLeft, color: 'text-emerald-400 bg-emerald-500/10', label: 'Token Receive' },
  'nft send': { icon: ImageIcon, color: 'text-pink-400 bg-pink-500/10', label: 'NFT Send' },
  'nft receive': { icon: ImageIcon, color: 'text-violet-400 bg-violet-500/10', label: 'NFT Receive' },
  'nft purchase': { icon: ImageIcon, color: 'text-fuchsia-400 bg-fuchsia-500/10', label: 'NFT Buy' },
  approve: { icon: CheckCircle, color: 'text-yellow-400 bg-yellow-500/10', label: 'Approve' },
  mint: { icon: Flame, color: 'text-cyan-400 bg-cyan-500/10', label: 'Mint' },
  burn: { icon: Flame, color: 'text-red-400 bg-red-500/10', label: 'Burn' },
  contract_interaction: { icon: ArrowRightLeft, color: 'text-purple-400 bg-purple-500/10', label: 'Contract' },
};

const DEFAULT_CONFIG = { icon: HelpCircle, color: 'text-gray-400 bg-gray-500/10', label: 'Transaction' };

export default function TransactionHistory() {
  const { data: history, isLoading, error } = useWalletHistory();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-secondary rounded" />
                <div className="h-3 w-24 bg-secondary rounded" />
              </div>
              <div className="h-4 w-16 bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
        <p className="text-muted-foreground text-sm">Failed to load transactions</p>
      </div>
    );
  }

  const txs = history?.slice(0, 25) || [];

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <span className="text-xs text-muted-foreground">
          Last {txs.length} txns
        </span>
      </div>

      {txs.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No transactions found
        </p>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {txs.map((tx) => {
            const cat = tx.category?.toLowerCase() || '';
            const config = CATEGORY_CONFIG[cat] || DEFAULT_CONFIG;
            const Icon = config.icon;

            const erc20Summary = tx.erc20_transfers?.slice(0, 2).map((t) => {
              const dir = t.direction === 'receive' ? '+' : '-';
              return `${dir}${parseFloat(t.value_formatted).toFixed(4)} ${t.token_symbol}`;
            });

            const nativeValue = tx.native_transfers?.[0]
              ? parseFloat(tx.native_transfers[0].value_formatted)
              : 0;

            return (
              <div
                key={tx.hash}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{config.label}</span>
                    {tx.summary && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {tx.summary}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {tx.to_address_label && (
                      <span className="text-primary/70">{tx.to_address_label}</span>
                    )}
                    {!tx.to_address_label && tx.to_address && (
                      <span>{shortenAddress(tx.to_address)}</span>
                    )}
                    <span>·</span>
                    <span>{timeAgo(tx.block_timestamp)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  {erc20Summary && erc20Summary.length > 0 ? (
                    erc20Summary.map((s, i) => (
                      <p
                        key={i}
                        className={`text-xs font-medium ${
                          s.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {s}
                      </p>
                    ))
                  ) : nativeValue > 0 ? (
                    <p
                      className={`text-xs font-medium ${
                        tx.native_transfers?.[0]?.direction === 'receive'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {tx.native_transfers?.[0]?.direction === 'receive' ? '+' : '-'}
                      {nativeValue.toFixed(4)} BNB
                    </p>
                  ) : null}
                </div>

                <a
                  href={getExplorerUrl(tx.hash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
