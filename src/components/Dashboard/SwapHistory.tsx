'use client';

import { useSwaps } from '@/hooks/useSwaps';
import { formatUSD, timeAgo, getExplorerUrl } from '@/lib/utils';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default function SwapHistory() {
  const { data: swaps, isLoading, error } = useSwaps();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Swaps</h3>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 bg-secondary rounded" />
                <div className="h-3 w-20 bg-secondary rounded" />
              </div>
              <div className="h-4 w-20 bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">Recent Swaps</h3>
        <p className="text-muted-foreground text-sm">Failed to load swaps</p>
      </div>
    );
  }

  const items = swaps?.slice(0, 15) || [];

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Swaps</h3>
        <span className="text-xs text-muted-foreground">{items.length} swaps</span>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No swap history found
        </p>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {items.map((swap) => {
            const soldAmt = Math.abs(parseFloat(swap.sold.amount));
            const boughtAmt = parseFloat(swap.bought.amount);

            return (
              <div
                key={swap.transactionHash}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                {/* Sold Token */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {swap.sold.logo ? (
                    <img
                      src={swap.sold.logo}
                      alt={swap.sold.symbol}
                      className="w-6 h-6 rounded-full shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).className = 'w-6 h-6 rounded-full bg-secondary';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {swap.sold.symbol?.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {soldAmt < 0.0001 ? '< 0.0001' : soldAmt.toFixed(4)} {swap.sold.symbol}
                    </p>
                  </div>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

                {/* Bought Token */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {swap.bought.logo ? (
                    <img
                      src={swap.bought.logo}
                      alt={swap.bought.symbol}
                      className="w-6 h-6 rounded-full shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).className = 'w-6 h-6 rounded-full bg-secondary';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {swap.bought.symbol?.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {boughtAmt < 0.0001 ? '< 0.0001' : boughtAmt.toFixed(4)} {swap.bought.symbol}
                    </p>
                  </div>
                </div>

                {/* Value & Meta */}
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">{formatUSD(swap.totalValueUsd)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {swap.pairLabel} · {timeAgo(swap.blockTimestamp)}
                  </p>
                </div>

                <a
                  href={getExplorerUrl(swap.transactionHash, 'tx')}
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
