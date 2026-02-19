'use client';

import { useTokenList } from '@/hooks/usePortfolio';
import { formatUSD } from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = [
  '#f0b90b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ef4444',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

interface ChartEntry {
  name: string;
  value: number;
  percentage: number;
}

export default function PortfolioChart() {
  const { data: tokens, isLoading } = useTokenList();

  if (isLoading) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-secondary animate-pulse" />
        </div>
      </div>
    );
  }

  const sortedTokens = [...(tokens || [])]
    .filter((t) => t.price * t.amount > 1)
    .sort((a, b) => b.price * b.amount - a.price * a.amount);

  const totalValue = sortedTokens.reduce(
    (sum, t) => sum + t.price * t.amount,
    0
  );

  const topTokens = sortedTokens.slice(0, 8);
  const othersValue = sortedTokens
    .slice(8)
    .reduce((sum, t) => sum + t.price * t.amount, 0);

  const chartData: ChartEntry[] = topTokens.map((t) => ({
    name: t.symbol,
    value: t.price * t.amount,
    percentage: totalValue > 0 ? ((t.price * t.amount) / totalValue) * 100 : 0,
  }));

  if (othersValue > 0) {
    chartData.push({
      name: 'Others',
      value: othersValue,
      percentage: totalValue > 0 ? (othersValue / totalValue) * 100 : 0,
    });
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
        <p className="text-muted-foreground text-sm text-center py-12">
          No token data available
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart */}
        <div className="w-full lg:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const data = payload[0].payload as ChartEntry;
                  return (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
                      <p className="text-sm font-medium">{data.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatUSD(data.value)} ({data.percentage.toFixed(1)}%)
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm flex-1">{entry.name}</span>
              <span className="text-sm text-muted-foreground">
                {entry.percentage.toFixed(1)}%
              </span>
              <span className="text-sm font-medium">
                {formatUSD(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
