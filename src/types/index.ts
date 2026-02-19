// ============================================================
// Normalized App Types (used by components and hooks)
// ============================================================

export interface Token {
  id: string;
  chain: string;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string | null;
  price: number;
  amount: number;
  is_verified: boolean;
  price_24h_change: number | null;
}

export interface TotalBalance {
  total_usd_value: number;
}

export interface DeFiProtocol {
  id: string;
  chain: string;
  name: string;
  site_url: string;
  logo_url: string | null;
  net_usd_value: number;
  asset_usd_value: number;
  debt_usd_value: number;
  portfolio_item_list: DeFiPortfolioItem[];
}

export interface DeFiPortfolioItem {
  stats: {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
  };
  name: string;
  detail_types: string[];
  detail: {
    supply_token_list?: Token[];
    borrow_token_list?: Token[];
    reward_token_list?: Token[];
    token_list?: Token[];
  };
}

// ============================================================
// Moralis API Types
// ============================================================

export interface MoralisTokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_price: number | null;
  usd_price_24hr_percent_change: number | null;
  usd_value: number | null;
  native_token: boolean;
  portfolio_percentage: number;
}

export interface MoralisNFT {
  token_address: string;
  token_id: string;
  amount: string;
  owner_of: string;
  token_hash: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string | null;
  metadata: string | null;
  normalized_metadata: MoralisNFTMetadata | null;
  media: MoralisNFTMedia | null;
  possible_spam: boolean;
  verified_collection: boolean;
  floor_price: number | null;
  floor_price_usd: number | null;
  collection_logo: string | null;
  collection_banner_image: string | null;
}

export interface MoralisNFTMetadata {
  name: string | null;
  description: string | null;
  image: string | null;
  animation_url: string | null;
  external_link: string | null;
  attributes: Array<{
    trait_type: string;
    value: string;
    display_type?: string;
  }> | null;
}

export interface MoralisNFTMedia {
  original_media_url: string | null;
  media_collection?: {
    low?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    high?: { url: string; width: number; height: number };
  };
}

export interface MoralisApproval {
  block_number: string;
  block_timestamp: string;
  transaction_hash: string;
  token: {
    address: string;
    name: string;
    symbol: string;
    logo: string | null;
    decimals: number;
    possible_spam: boolean;
    verified_contract: boolean;
    usd_price: number | null;
  };
  spender: {
    address: string;
    address_label: string | null;
  };
  value: string;
  value_formatted: string;
}

export interface MoralisTransaction {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  receipt_gas_used: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  method_label: string | null;
  summary: string | null;
  category: string;
}

export interface MoralisPaginatedResponse<T> {
  page: number;
  page_size: number;
  cursor: string | null;
  result: T[];
}

export interface MoralisDeFiPosition {
  protocol_name: string;
  protocol_id: string;
  protocol_url: string;
  protocol_logo: string;
  chain: string;
  position: {
    label: string;
    tokens: Array<{
      address: string;
      name: string;
      symbol: string;
      decimals: number;
      balance: string;
      balance_formatted: string;
      usd_price: number;
      usd_value: number;
      logo: string | null;
    }>;
    address: string;
    balance_usd: number;
  };
}

export interface MoralisNetWorth {
  total_networth_usd: string;
  chains: Array<{
    chain: string;
    native_balance: string;
    native_balance_formatted: string;
    native_balance_usd: string;
    token_balance_usd: string;
    networth_usd: string;
  }>;
}

export interface MoralisWalletHistoryItem {
  hash: string;
  from_address: string;
  from_address_label: string | null;
  to_address: string;
  to_address_label: string | null;
  method_label: string | null;
  value: string;
  block_timestamp: string;
  block_number: string;
  summary: string;
  category: string;
  possible_spam: boolean;
  nft_transfers: Array<{
    token_name: string;
    token_symbol: string;
    token_logo: string | null;
    token_address: string;
    token_id: string;
    from_address: string;
    to_address: string;
    value: string;
    direction: string;
  }>;
  erc20_transfers: Array<{
    token_name: string;
    token_symbol: string;
    token_logo: string | null;
    address: string;
    from_address: string;
    to_address: string;
    value: string;
    value_formatted: string;
    direction: string;
  }>;
  native_transfers: Array<{
    from_address: string;
    to_address: string;
    value: string;
    value_formatted: string;
    direction: string;
  }>;
}

export interface MoralisWalletStats {
  nfts: string;
  collections: string;
  transactions: {
    total: string;
  };
}

export interface MoralisSwapToken {
  address: string;
  name: string;
  symbol: string;
  logo: string | null;
  amount: string;
  usdPrice: number;
  usdAmount: number;
}

export interface MoralisTokenSwap {
  transactionHash: string;
  transactionIndex: number;
  transactionType: string;
  blockTimestamp: string;
  blockNumber: number;
  subCategory: string;
  pairLabel: string;
  exchangeName: string | null;
  exchangeAddress: string;
  bought: MoralisSwapToken;
  sold: MoralisSwapToken;
  totalValueUsd: number;
}

export interface MoralisPnLSummary {
  total_count_of_trades: number;
  total_trade_volume: string;
  total_realized_profit_usd: string;
  total_realized_profit_percentage: number;
  total_buys: number;
  total_sells: number;
  total_buy_volume: string;
  total_sell_volume: string;
}

// ============================================================
// App Types
// ============================================================

export type RiskLevel = 'high' | 'medium' | 'low';

export interface ApprovalWithRisk extends MoralisApproval {
  riskLevel: RiskLevel;
  riskReason: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PortfolioContext {
  address: string;
  totalUsdValue: number;
  tokens: Token[];
  protocols: DeFiProtocol[];
  approvals: ApprovalWithRisk[];
}
