'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShieldAlert,
  MessageSquare,
  Wallet,
  TrendingUp,
  Eye,
  Hexagon,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Portfolio Analytics',
    description:
      'View your complete BNB Chain portfolio with token balances, USD values, and portfolio distribution charts.',
  },
  {
    icon: TrendingUp,
    title: 'DeFi Positions',
    description:
      'Track all your DeFi positions across protocols — lending, staking, farming, and LP positions.',
  },
  {
    icon: Eye,
    title: 'NFT Gallery',
    description:
      'Browse your NFT collection with metadata, images, floor prices, and verified collection badges.',
  },
  {
    icon: ShieldAlert,
    title: 'Approval Scanner',
    description:
      'Scan all token approvals, identify dangerous permissions, and revoke them with one click.',
  },
  {
    icon: MessageSquare,
    title: 'AI DeFi Advisor',
    description:
      'Chat with AI that understands your portfolio and provides personalized DeFi strategy recommendations.',
  },
];

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-12">
        <div className="relative mb-6">
          <Hexagon className="h-20 w-20 text-primary" />
          <div className="absolute inset-0 h-20 w-20 text-primary blur-xl opacity-30">
            <Hexagon className="h-20 w-20" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="gradient-text">BNB DeFi</span> Analytics
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Connect your wallet to unlock comprehensive portfolio analytics, DeFi
          position tracking, approval security scanning, and AI-powered
          investment insights — all on BNB Chain.
        </p>

        {isConnected ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/approvals"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-6 py-3 font-medium hover:bg-secondary/80 transition-colors"
            >
              <ShieldAlert className="h-5 w-5" />
              Scan Approvals
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary text-secondary-foreground px-6 py-3 font-medium hover:bg-secondary/80 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              AI Advisor
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ConnectButton />
            <p className="text-sm text-muted-foreground">
              Connect your wallet to get started
            </p>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="py-12 border-t border-border">
        <h2 className="text-2xl font-bold text-center mb-8">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glow-card rounded-xl bg-card border border-border p-6 hover:border-primary/30 transition-colors"
            >
              <feature.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Built for BNBChain Hackathon | Powered by Moralis & OpenAI GPT-5.2
        </p>
      </footer>
    </div>
  );
}
