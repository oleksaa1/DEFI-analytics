'use client';

import { useDeFiPositions } from '@/hooks/useDeFiPositions';
import { formatUSD, formatTokenAmount } from '@/lib/utils';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function DeFiPositions() {
  const { data: protocols, isLoading, error } = useDeFiPositions();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">DeFi Positions</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/30 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-secondary rounded" />
                  <div className="h-3 w-20 bg-secondary rounded" />
                </div>
                <div className="h-5 w-24 bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-2">DeFi Positions</h3>
        <p className="text-muted-foreground text-sm">Failed to load DeFi positions</p>
      </div>
    );
  }

  const sortedProtocols = [...(protocols || [])].sort(
    (a, b) => b.net_usd_value - a.net_usd_value
  );

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">DeFi Positions</h3>
        <span className="text-xs text-muted-foreground">
          {sortedProtocols.length} protocols
        </span>
      </div>

      {sortedProtocols.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          No active DeFi positions found
        </p>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {sortedProtocols.map((protocol) => {
            const isExpanded = expanded.has(protocol.id);
            return (
              <div
                key={protocol.id}
                className="rounded-lg border border-border overflow-hidden"
              >
                {/* Protocol Header */}
                <button
                  onClick={() => toggleExpand(protocol.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors text-left"
                >
                  {protocol.logo_url ? (
                    <img
                      src={protocol.logo_url}
                      alt={protocol.name}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).className =
                          'w-10 h-10 rounded-full bg-secondary';
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                      {protocol.name.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {protocol.name}
                      </span>
                      {protocol.site_url && (
                        <a
                          href={protocol.site_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {protocol.portfolio_item_list.length} position
                      {protocol.portfolio_item_list.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-medium text-sm">
                      {formatUSD(protocol.net_usd_value)}
                    </p>
                    {protocol.debt_usd_value > 0 && (
                      <p className="text-xs text-destructive">
                        Debt: {formatUSD(protocol.debt_usd_value)}
                      </p>
                    )}
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-border bg-secondary/10 p-4 space-y-3">
                    {protocol.portfolio_item_list.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">
                            {item.name}
                          </span>
                          <span className="text-sm">
                            {formatUSD(item.stats.net_usd_value)}
                          </span>
                        </div>

                        {/* Supplied Tokens */}
                        {item.detail?.supply_token_list &&
                          item.detail.supply_token_list.length > 0 && (
                            <div className="pl-3 space-y-1">
                              <p className="text-xs text-muted-foreground">
                                Supplied:
                              </p>
                              {item.detail.supply_token_list.map((token, ti) => (
                                <div
                                  key={ti}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span>
                                    {formatTokenAmount(token.amount)}{' '}
                                    {token.symbol}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatUSD(token.price * token.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Borrowed Tokens */}
                        {item.detail?.borrow_token_list &&
                          item.detail.borrow_token_list.length > 0 && (
                            <div className="pl-3 space-y-1">
                              <p className="text-xs text-destructive">
                                Borrowed:
                              </p>
                              {item.detail.borrow_token_list.map((token, ti) => (
                                <div
                                  key={ti}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span>
                                    {formatTokenAmount(token.amount)}{' '}
                                    {token.symbol}
                                  </span>
                                  <span className="text-destructive">
                                    -{formatUSD(token.price * token.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Reward Tokens */}
                        {item.detail?.reward_token_list &&
                          item.detail.reward_token_list.length > 0 && (
                            <div className="pl-3 space-y-1">
                              <p className="text-xs text-success">Rewards:</p>
                              {item.detail.reward_token_list.map((token, ti) => (
                                <div
                                  key={ti}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span>
                                    {formatTokenAmount(token.amount)}{' '}
                                    {token.symbol}
                                  </span>
                                  <span className="text-success">
                                    +{formatUSD(token.price * token.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
