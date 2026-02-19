'use client';

import type { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

const riskConfig: Record<
  RiskLevel,
  { label: string; className: string; icon: React.ElementType }
> = {
  high: {
    label: 'High Risk',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: ShieldAlert,
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    icon: AlertTriangle,
  },
  low: {
    label: 'Low Risk',
    className: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: ShieldCheck,
  },
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
