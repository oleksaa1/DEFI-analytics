import type {
  MoralisTokenBalance,
  MoralisNFT,
  MoralisApproval,
  MoralisTransaction,
  MoralisPaginatedResponse,
  MoralisDeFiPosition,
  MoralisNetWorth,
  MoralisWalletHistoryItem,
  MoralisWalletStats,
  MoralisTokenSwap,
  MoralisPnLSummary,
} from '@/types';

const MORALIS_BASE_URL = 'https://deep-index.moralis.io/api/v2.2';
const BSC = 'bsc';

async function moralisFetch<T>(endpoint: string, apiKey: string): Promise<T> {
  const res = await fetch(`${MORALIS_BASE_URL}${endpoint}`, {
    headers: {
      'X-API-Key': apiKey,
      accept: 'application/json',
    },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`Moralis API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Token Balances ──────────────────────────────────────────

export async function getTokenBalances(
  address: string,
  apiKey: string
): Promise<MoralisTokenBalance[]> {
  return moralisFetch(`/${address}/erc20?chain=${BSC}`, apiKey);
}

export async function getTokenBalancesWithPrices(
  address: string,
  apiKey: string
): Promise<MoralisPaginatedResponse<MoralisTokenBalance>> {
  return moralisFetch(`/wallets/${address}/tokens?chain=${BSC}`, apiKey);
}

export async function getNativeBalance(
  address: string,
  apiKey: string
): Promise<{ balance: string }> {
  return moralisFetch(`/${address}/balance?chain=${BSC}`, apiKey);
}

// ── Net Worth ───────────────────────────────────────────────

export async function getNetWorth(
  address: string,
  apiKey: string
): Promise<MoralisNetWorth> {
  return moralisFetch(
    `/wallets/${address}/net-worth?chains[]=${BSC}&exclude_spam=true&exclude_unverified_contracts=true`,
    apiKey
  );
}

// ── NFTs ────────────────────────────────────────────────────

export async function getNFTs(
  address: string,
  apiKey: string,
  cursor?: string
): Promise<MoralisPaginatedResponse<MoralisNFT>> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return moralisFetch(
    `/${address}/nft?chain=${BSC}&exclude_spam=true&normalizeMetadata=true&media_items=true${cursorParam}`,
    apiKey
  );
}

// ── Approvals ───────────────────────────────────────────────

export async function getApprovals(
  address: string,
  apiKey: string
): Promise<MoralisPaginatedResponse<MoralisApproval>> {
  return moralisFetch(`/wallets/${address}/approvals?chain=${BSC}`, apiKey);
}

// ── Transactions (raw) ─────────────────────────────────────

export async function getTransactions(
  address: string,
  apiKey: string,
  cursor?: string
): Promise<MoralisPaginatedResponse<MoralisTransaction>> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return moralisFetch(
    `/${address}?chain=${BSC}&include=internal_transactions${cursorParam}`,
    apiKey
  );
}

// ── Wallet History (decoded, categorized) ───────────────────

export async function getWalletHistory(
  address: string,
  apiKey: string,
  cursor?: string
): Promise<MoralisPaginatedResponse<MoralisWalletHistoryItem>> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return moralisFetch(
    `/wallets/${address}/history?chain=${BSC}&include_internal_transactions=true&order=DESC${cursorParam}`,
    apiKey
  );
}

// ── DeFi Positions ──────────────────────────────────────────

export async function getDeFiPositions(
  address: string,
  apiKey: string
): Promise<MoralisDeFiPosition[]> {
  return moralisFetch(`/wallets/${address}/defi/positions?chain=${BSC}`, apiKey);
}

// ── Wallet Stats ────────────────────────────────────────────

export async function getWalletStats(
  address: string,
  apiKey: string
): Promise<MoralisWalletStats> {
  return moralisFetch(`/wallets/${address}/stats?chain=${BSC}`, apiKey);
}

// ── Token Swaps ─────────────────────────────────────────────

export async function getTokenSwaps(
  address: string,
  apiKey: string,
  cursor?: string
): Promise<MoralisPaginatedResponse<MoralisTokenSwap>> {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return moralisFetch(
    `/wallets/${address}/swaps?chain=${BSC}&order=DESC${cursorParam}`,
    apiKey
  );
}

// ── PnL Summary ─────────────────────────────────────────────

export async function getPnLSummary(
  address: string,
  apiKey: string
): Promise<MoralisPnLSummary> {
  return moralisFetch(
    `/wallets/${address}/profitability/summary?chain=${BSC}&days=all`,
    apiKey
  );
}
