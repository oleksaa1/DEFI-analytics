import { NextRequest, NextResponse } from 'next/server';
import {
  getTokenBalances,
  getTokenBalancesWithPrices,
  getNativeBalance,
  getNetWorth,
  getNFTs,
  getApprovals,
  getTransactions,
  getWalletHistory,
  getDeFiPositions,
  getWalletStats,
  getTokenSwaps,
  getPnLSummary,
} from '@/lib/moralis';

const VALID_ACTIONS = [
  'token_balances', 'token_balances_prices', 'native_balance', 'net_worth',
  'nfts', 'approvals', 'transactions', 'wallet_history', 'defi_positions',
  'wallet_stats', 'token_swaps', 'pnl_summary',
] as const;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const action = searchParams.get('action');
  const cursor = searchParams.get('cursor') || undefined;

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Moralis API key not configured' },
      { status: 500 }
    );
  }

  try {
    let data;

    switch (action) {
      case 'token_balances':
        data = await getTokenBalances(address, apiKey);
        break;
      case 'token_balances_prices':
        data = await getTokenBalancesWithPrices(address, apiKey);
        break;
      case 'native_balance':
        data = await getNativeBalance(address, apiKey);
        break;
      case 'net_worth':
        data = await getNetWorth(address, apiKey);
        break;
      case 'nfts':
        data = await getNFTs(address, apiKey, cursor);
        break;
      case 'approvals':
        data = await getApprovals(address, apiKey);
        break;
      case 'transactions':
        data = await getTransactions(address, apiKey, cursor);
        break;
      case 'wallet_history':
        data = await getWalletHistory(address, apiKey, cursor);
        break;
      case 'defi_positions':
        data = await getDeFiPositions(address, apiKey);
        break;
      case 'wallet_stats':
        data = await getWalletStats(address, apiKey);
        break;
      case 'token_swaps':
        data = await getTokenSwaps(address, apiKey, cursor);
        break;
      case 'pnl_summary':
        data = await getPnLSummary(address, apiKey);
        break;
      default:
        return NextResponse.json(
          { error: `Invalid action. Use: ${VALID_ACTIONS.join(', ')}` },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Moralis API error:', message);
    return NextResponse.json(
      { error: `Failed to fetch data from Moralis: ${message}` },
      { status: 500 }
    );
  }
}
