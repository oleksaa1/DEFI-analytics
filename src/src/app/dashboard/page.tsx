'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import PortfolioSummary from '@/components/Dashboard/PortfolioSummary';
import TokenBalances from '@/components/Dashboard/TokenBalances';
import PortfolioChart from '@/components/Dashboard/PortfolioChart';
import DeFiPositions from '@/components/Dashboard/DeFiPositions';
import NFTGallery from '@/components/Dashboard/NFTGallery';
import TransactionHistory from '@/components/Dashboard/TransactionHistory';
import SwapHistory from '@/components/Dashboard/SwapHistory';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <LayoutDashboard className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Connect your BNB Chain wallet to view your complete portfolio
          analytics, DeFi positions, and more.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Portfolio overview for{' '}
            <span className="font-mono text-xs">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </p>
        </div>
      </div>

      {/* Portfolio Summary Cards (6 cards: balance, defi, pnl, activity, risk, protocols) */}
      <PortfolioSummary />

      {/* Charts & Tokens Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioChart />
        <TokenBalances />
      </div>

      {/* DeFi Positions */}
      <DeFiPositions />

      {/* Swaps & Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SwapHistory />
        <TransactionHistory />
      </div>

      {/* NFTs */}
      <NFTGallery />
    </div>
  );
}
