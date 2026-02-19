'use client';

import { useTotalBalance } from '@/hooks/usePortfolio';
import { useApprovals } from '@/hooks/useApprovals';
import { useDeFiPositions } from '@/hooks/useDeFiPositions';
import { useWalletStats } from '@/hooks/useWalletStats';
import { usePnL } from '@/hooks/usePnL';
import { formatUSD } from '@/lib/utils';
import { Wallet, TrendingUp, ShieldAlert, Layers, Activity, BarChart3 } from 'lucide-react';

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  isLoading,
  badge,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  isLoading: boolean;
  badge?: { text: string; color: string } | null;
}) {
  return (
    <div className="glow-card rounded-xl bg-card p-6 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-32 rounded bg-secondary animate-pulse mt-1" />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold">{value}</p>
              {badge && (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                >
                  {badge.text}
                </span>
              )}
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="rounded-lg p-3"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSummary() {
  const { data: balance, isLoading: balanceLoading } = useTotalBalance();
  const { data: approvals, isLoading: approvalsLoading } = useApprovals();
  const { data: positions, isLoading: positionsLoading } = useDeFiPositions();
  const { data: stats, isLoading: statsLoading } = useWalletStats();
  const { data: pnl, isLoading: pnlLoading } = usePnL();

  const totalValue = balance?.total_usd_value ?? 0;
  const defiValue = positions?.reduce((sum, p) => sum + p.net_usd_value, 0) ?? 0;
  const highRiskCount = approvals?.filter((a) => a.riskLevel === 'high').length ?? 0;
  const protocolCount = positions?.length ?? 0;
  const totalTxns = parseInt(stats?.transactions?.total || '0', 10);
  const totalNfts = parseInt(stats?.nfts || '0', 10);

  const realizedProfit = parseFloat(pnl?.total_realized_profit_usd || '0');
  const profitPct = pnl?.total_realized_profit_percentage ?? 0;
  const isProfitable = realizedProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Portfolio"
        value={formatUSD(totalValue)}
        subtitle="BSC Net Worth"
        icon={Wallet}
        color="#f0b90b"
        isLoading={balanceLoading}
      />
      <StatCard
        title="DeFi Positions"
        value={formatUSD(defiValue)}
        subtitle={`${protocolCount} protocols`}
        icon={TrendingUp}
        color="#22c55e"
        isLoading={positionsLoading}
      />
      <StatCard
        title="Realized P&L"
        value={pnl ? formatUSD(Math.abs(realizedProfit)) : 'N/A'}
        subtitle={pnl ? `${pnl.total_count_of_trades} trades` : 'Data not available'}
        icon={BarChart3}
        color={isProfitable ? '#22c55e' : '#ef4444'}
        isLoading={pnlLoading}
        badge={pnl ? {
          text: `${isProfitable ? '+' : ''}${profitPct.toFixed(1)}%`,
          color: isProfitable ? '#22c55e' : '#ef4444',
        } : null}
      />
      <StatCard
        title="Wallet Activity"
        value={totalTxns.toLocaleString()}
        subtitle={`${totalNfts} NFTs · ${stats?.collections || '0'} collections`}
        icon={Activity}
        color="#3b82f6"
        isLoading={statsLoading}
      />
      <StatCard
        title="Risk Alerts"
        value={highRiskCount.toString()}
        subtitle="High-risk approvals"
        icon={ShieldAlert}
        color={highRiskCount > 0 ? '#ef4444' : '#22c55e'}
        isLoading={approvalsLoading}
      />
      <StatCard
        title="Active Protocols"
        value={protocolCount.toString()}
        subtitle="On BNB Chain"
        icon={Layers}
        color="#8b5cf6"
        isLoading={positionsLoading}
      />
    </div>
  );
}
