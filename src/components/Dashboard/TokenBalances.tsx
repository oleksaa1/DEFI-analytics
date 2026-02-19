'use client';

import { useTokenList } from '@/hooks/usePortfolio';
import { formatUSD, formatTokenAmount } from '@/lib/utils';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

export default function TokenBalances() {
  const { data: tokens, isLoading, error } = useTokenList();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Token Balances</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-secondary rounded" />
                <div className="h-3 w-16 bg-secondary rounded" />
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
        <h3 className="text-lg font-semibold mb-2">Token Balances</h3>
        <p className="text-muted-foreground text-sm">Failed to load token data</p>
      </div>
    );
  }

  const sortedTokens = [...(tokens || [])]
    .filter((t) => t.price * t.amount > 0.01)
    .sort((a, b) => b.price * b.amount - a.price * a.amount);

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Token Balances</h3>
        <span className="text-xs text-muted-foreground">
          {sortedTokens.length} tokens
        </span>
      </div>

      {sortedTokens.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tokens found</p>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {sortedTokens.map((token) => {
            const change = token.price_24h_change;
            const hasChange = change !== null && change !== undefined;
            const isPositive = hasChange && change >= 0;

            return (
              <div
                key={`${token.chain}-${token.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className="relative shrink-0">
                  {token.logo_url ? (
                    <img
                      src={token.logo_url}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className =
                          'w-8 h-8 rounded-full bg-secondary';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                      {token.symbol?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">
                      {token.symbol}
                    </span>
                    {token.is_verified && (
                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatTokenAmount(token.amount)} {token.symbol}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">
                    {formatUSD(token.price * token.amount)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      @{formatUSD(token.price)}
                    </span>
                    {hasChange && (
                      <span
                        className={`flex items-center gap-0.5 text-[10px] font-medium ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-2.5 w-2.5" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" />
                        )}
                        {Math.abs(change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>

                {token.id && token.id !== 'bnb' && (
                  <a
                    href={`https://bscscan.com/token/${token.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
