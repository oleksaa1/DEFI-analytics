'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type {
  Token,
  TotalBalance,
  MoralisTokenBalance,
  MoralisNetWorth,
  MoralisPaginatedResponse,
} from '@/types';

function moralisToToken(t: MoralisTokenBalance): Token {
  const rawBalance = parseFloat(t.balance) || 0;
  const amount = rawBalance / Math.pow(10, t.decimals);

  return {
    id: t.native_token ? 'bnb' : t.token_address,
    chain: 'bsc',
    name: t.name,
    symbol: t.symbol,
    decimals: t.decimals,
    logo_url: t.logo,
    price: t.usd_price ?? 0,
    amount,
    is_verified: t.verified_contract,
    price_24h_change: t.usd_price_24hr_percent_change,
  };
}

export function useTotalBalance() {
  const { address, isConnected } = useAccount();

  return useQuery<TotalBalance>({
    queryKey: ['totalBalance', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=net_worth`
      );
      if (!res.ok) throw new Error('Failed to fetch net worth');
      const data: MoralisNetWorth = await res.json();
      return { total_usd_value: parseFloat(data.total_networth_usd) || 0 };
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
  });
}

export function useTokenList() {
  const { address, isConnected } = useAccount();

  return useQuery<Token[]>({
    queryKey: ['tokenList', address],
    queryFn: async () => {
      const res = await fetch(
        `/api/moralis?address=${address}&action=token_balances_prices`
      );
      if (!res.ok) throw new Error('Failed to fetch token list');
      const data: MoralisPaginatedResponse<MoralisTokenBalance> = await res.json();
      return (data.result || [])
        .filter((t) => !t.possible_spam)
        .map(moralisToToken);
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
  });
}
