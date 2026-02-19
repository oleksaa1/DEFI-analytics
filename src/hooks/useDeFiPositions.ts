'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { DeFiProtocol, DeFiPortfolioItem, Token, MoralisDeFiPosition } from '@/types';

function positionTokenToToken(t: MoralisDeFiPosition['position']['tokens'][0]): Token {
  const amount = parseFloat(t.balance_formatted) || 0;
  return {
    id: t.address,
    chain: 'bsc',
    name: t.name,
    symbol: t.symbol,
    decimals: t.decimals,
    logo_url: t.logo,
    price: t.usd_price,
    amount,
    is_verified: true,
    price_24h_change: null,
  };
}

function groupByProtocol(positions: MoralisDeFiPosition[]): DeFiProtocol[] {
  const grouped = new Map<string, { meta: MoralisDeFiPosition; items: MoralisDeFiPosition[] }>();

  for (const pos of positions) {
    const key = pos.protocol_id;
    if (!grouped.has(key)) {
      grouped.set(key, { meta: pos, items: [] });
    }
    grouped.get(key)!.items.push(pos);
  }

  return Array.from(grouped.values()).map(({ meta, items }) => {
    const portfolioItems: DeFiPortfolioItem[] = items.map((item) => {
      const tokens = item.position.tokens.map(positionTokenToToken);
      const assetValue = item.position.balance_usd;
      return {
        name: item.position.label,
        detail_types: [item.position.label.toLowerCase()],
        stats: {
          asset_usd_value: assetValue,
          debt_usd_value: 0,
          net_usd_value: assetValue,
        },
        detail: {
          supply_token_list: tokens,
        },
      };
    });

    const netValue = portfolioItems.reduce((s, i) => s + i.stats.net_usd_value, 0);
    const assetValue = portfolioItems.reduce((s, i) => s + i.stats.asset_usd_value, 0);

    return {
      id: meta.protocol_id,
      chain: meta.chain || 'bsc',
      name: meta.protocol_name,
      site_url: meta.protocol_url,
      logo_url: meta.protocol_logo,
      net_usd_value: netValue,
      asset_usd_value: assetValue,
      debt_usd_value: 0,
      portfolio_item_list: portfolioItems,
    };
  });
}

export function useDeFiPositions() {
  const { address, isConnected } = useAccount();

  return useQuery<DeFiProtocol[]>({
    queryKey: ['defiPositions', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=defi_positions`
      );
      if (!res.ok) throw new Error('Failed to fetch DeFi positions');
      const data: MoralisDeFiPosition[] = await res.json();
      return groupByProtocol(data);
    },
    enabled: isConnected && !!address,
    staleTime: 60_000,
  });
}
