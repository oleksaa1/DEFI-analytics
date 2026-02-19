# Technical Documentation

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Next.js 16 Frontend                     │
│                    (Turbopack, SSR)                        │
│                                                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐             │
│  │ Dashboard  │  │ Approvals │  │  AI Chat  │             │
│  │   Page     │  │   Page    │  │   Page    │             │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘             │
│        │               │               │                  │
│  ┌─────┴───────────────┴───────────────┴──────┐           │
│  │       React Hooks (TanStack Query v5)       │           │
│  │  usePortfolio · useDeFiPositions · useNFTs  │           │
│  │  useApprovals · useWalletStats · useSwaps   │           │
│  │  usePnL · useTransactions                   │           │
│  └─────┬───────────────┬───────────────┬──────┘           │
│        │               │               │                  │
│  ┌─────┴─────┐  ┌─────┴──────┐  ┌─────┴──────┐          │
│  │  wagmi +  │  │ /api/      │  │ /api/      │          │
│  │   viem    │  │ moralis    │  │ ai/chat    │          │
│  └─────┬─────┘  └─────┬──────┘  └─────┬──────┘          │
└────────┼───────────────┼───────────────┼─────────────────┘
         │               │               │
         │        ┌──────┴──────┐  ┌─────┴──────┐
         │        │   Moralis   │  │   OpenAI   │
         │        │ Web3 API    │  │  GPT-5.2   │
         │        │(12 endpoints)│  │ (streaming)│
         │        └──────┬──────┘  └────────────┘
         │               │
    ┌────┴────┐   ┌──────┴──────┐
    │   BSC   │   │ BatchRevoke │
    │  RPC    │   │  Contract   │
    └─────────┘   └─────────────┘
```

## Project Structure

```
3defi-analitics/
├── README.md
├── bsc.address                          # Contract deployment info
├── .gitignore
│
├── docs/
│   ├── PROJECT.md                       # Problem, solution, roadmap
│   ├── TECHNICAL.md                     # This file
│   └── EXTRAS.md                        # Demo links, AI build log
│
├── src/                                 # Next.js 16 application
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── .env.example
│   ├── .env                             # Local env (not committed)
│   ├── app/
│   │   ├── layout.tsx                   # Root layout + providers
│   │   ├── page.tsx                     # Landing page
│   │   ├── globals.css                  # Tailwind + theme
│   │   ├── dashboard/page.tsx           # Portfolio dashboard
│   │   ├── approvals/page.tsx           # Approval scanner
│   │   ├── chat/page.tsx               # AI advisor
│   │   └── api/
│   │       ├── moralis/route.ts         # Moralis proxy (12 actions)
│   │       └── ai/chat/route.ts         # OpenAI GPT-5.2 streaming
│   ├── components/
│   │   ├── WalletProvider.tsx           # wagmi + RainbowKit setup
│   │   ├── Navbar.tsx                   # Navigation bar
│   │   ├── Dashboard/
│   │   │   ├── PortfolioSummary.tsx     # Net worth + stat cards
│   │   │   ├── PortfolioChart.tsx       # Distribution pie chart
│   │   │   ├── TokenBalances.tsx        # Token list + 24h change
│   │   │   ├── DeFiPositions.tsx        # Protocol positions
│   │   │   ├── NFTGallery.tsx           # NFT collection grid
│   │   │   ├── TransactionHistory.tsx   # Decoded tx history
│   │   │   └── SwapHistory.tsx          # DEX swap history
│   │   ├── Approvals/
│   │   │   ├── ApprovalList.tsx         # Risk-scored approvals
│   │   │   ├── BatchRevokeButton.tsx    # Batch revoke UI
│   │   │   └── RiskBadge.tsx            # Risk level badge
│   │   ├── Chat/
│   │   │   ├── ChatInterface.tsx        # Streaming chat UI
│   │   │   └── MessageBubble.tsx        # Chat message renderer
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorDisplay.tsx
│   ├── hooks/
│   │   ├── usePortfolio.ts              # Net worth + token balances
│   │   ├── useTokenBalances.ts          # Raw token balances
│   │   ├── useDeFiPositions.ts          # DeFi protocol positions
│   │   ├── useNFTs.ts                   # NFT collections
│   │   ├── useApprovals.ts              # Token approvals + risk
│   │   ├── useTransactions.ts           # Decoded wallet history
│   │   ├── useWalletStats.ts            # Wallet statistics
│   │   ├── useSwaps.ts                  # Token swap history
│   │   └── usePnL.ts                    # Profit & loss summary
│   ├── lib/
│   │   ├── moralis.ts                   # Moralis API client (12 fn)
│   │   ├── ai.ts                        # System prompt builder
│   │   ├── contracts.ts                 # Contract ABIs + addresses
│   │   ├── riskAnalysis.ts              # Approval risk scoring
│   │   └── utils.ts                     # formatUSD, cn, etc.
│   └── types/
│       └── index.ts                     # All TypeScript interfaces
│
└── contracts/                           # Hardhat project
    ├── package.json
    ├── hardhat.config.ts
    ├── tsconfig.json
    ├── contracts/
    │   ├── BatchRevoke.sol              # Main contract
    │   └── MockERC20.sol                # Test mock
    ├── scripts/
    │   └── deploy.ts                    # Deployment script
    └── test/
        └── BatchRevoke.test.ts          # Contract tests
```

## Setup Guide

### Prerequisites

- Node.js 18+ and npm
- A web3 wallet (MetaMask recommended)
- API keys (see below)

### 1. Install Frontend

```bash
cd src
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

| Variable | Source | Required |
|----------|--------|----------|
| `MORALIS_API_KEY` | [Moralis Admin](https://admin.moralis.com/) | Yes |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/) | Yes (for AI chat) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com/) | Yes |
| `BSC_RPC_URL` | Default provided | Optional |

### 3. Run Development Server

```bash
cd src
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Deploy Smart Contract (Optional)

```bash
cd contracts
npm install

# Set DEPLOYER_PRIVATE_KEY in environment
export DEPLOYER_PRIVATE_KEY=0x...

# Deploy to BSC mainnet
npx hardhat run scripts/deploy.ts --network bsc

# Or deploy to BSC testnet first
npx hardhat run scripts/deploy.ts --network bscTestnet
```

After deployment, update:
- `bsc.address` with the contract address
- `src/lib/contracts.ts` with the deployed address

## Moralis Web3 Data API Integration

**Base URL**: `https://deep-index.moralis.io/api/v2.2`
**Auth**: `X-API-Key` header
**Chain**: BSC only (`chain=bsc`)

All Moralis calls are proxied through `/api/moralis?address=...&action=...` to keep the API key server-side.

### Endpoints Used (12 total)

| Action | Moralis Endpoint | Purpose |
|--------|-----------------|---------|
| `token_balances` | `GET /{addr}/erc20?chain=bsc` | ERC20 token balances |
| `token_balances_prices` | `GET /wallets/{addr}/tokens?chain=bsc` | Token balances with USD prices & 24h change |
| `native_balance` | `GET /{addr}/balance?chain=bsc` | Native BNB balance |
| `net_worth` | `GET /wallets/{addr}/net-worth?chains[]=bsc` | Total wallet net worth |
| `nfts` | `GET /{addr}/nft?chain=bsc` | NFT collections with metadata |
| `approvals` | `GET /wallets/{addr}/approvals?chain=bsc` | Active token approvals |
| `transactions` | `GET /{addr}?chain=bsc` | Raw transaction history |
| `wallet_history` | `GET /wallets/{addr}/history?chain=bsc` | Decoded, categorized history |
| `defi_positions` | `GET /wallets/{addr}/defi/positions?chain=bsc` | DeFi protocol positions |
| `wallet_stats` | `GET /wallets/{addr}/stats?chain=bsc` | Wallet statistics (tx count, NFTs) |
| `token_swaps` | `GET /wallets/{addr}/swaps?chain=bsc` | DEX token swap history |
| `pnl_summary` | `GET /wallets/{addr}/profitability/summary?chain=bsc` | Profit & loss summary* |

*\*PnL is not supported on BSC by Moralis — handled gracefully with "N/A" display.*

### Data Flow

1. React hooks call `/api/moralis` with the connected wallet address
2. API route validates the request and forwards to Moralis with server-side API key
3. Response is cached by TanStack Query (30s stale time)
4. Data is normalized to app-specific types (`Token`, `DeFiProtocol`, etc.)

## OpenAI GPT-5.2 API

- **Model**: `gpt-5.2`
- **Parameter**: `max_completion_tokens: 2048`
- **Streaming**: Server-Sent Events (SSE) via `ReadableStream`
- **System prompt**: Dynamically built with portfolio context (tokens, DeFi positions, risky approvals)
- **Endpoint**: `POST /api/ai/chat`

## Smart Contract — BatchRevoke.sol

Solidity 0.8.19 utility contract for managing ERC20 token approvals.

### Key Functions

```solidity
function batchRevoke(address[] tokens, address[] spenders) external
function batchCheckAllowances(address owner, address[] tokens, address[] spenders) external view returns (uint256[])
function revoke(address token, address spender) external
```

### Constraints

- Max 50 operations per batch (`MAX_BATCH_SIZE`)
- Custom errors: `ArrayLengthMismatch`, `EmptyArrays`, `BatchTooLarge`, `ZeroAddress`, `RevokeFailed_Single`
- `batchCheckAllowances` uses low-level `staticcall` for safe allowance checking (handles non-contract addresses)

### Events

| Event | When |
|-------|------|
| `BatchRevoked(address indexed owner, uint256 count)` | After batch revoke |
| `Revoked(address indexed owner, address indexed token, address indexed spender)` | Per individual revoke |
| `RevokeFailed(address indexed owner, address indexed token, address indexed spender)` | Failed revoke in batch (batch continues) |

### Security

- No admin functions, no upgradability, no proxy
- Does not hold user tokens or funds
- Uses low-level calls to handle non-standard ERC20 tokens
- Capped at 50 per batch to prevent gas limit issues

## Risk Analysis Algorithm

Approvals are scored based on:

| Factor | High Risk | Medium Risk | Low Risk |
|--------|-----------|-------------|----------|
| Approval amount | Unlimited to unknown | Unlimited to labeled | Limited |
| Spender identity | Unknown, no label | Has label, not well-known | Well-known protocol |
| Token type | Spam token | Any | Verified |

Well-known BNB Chain protocols (auto low-risk):
PancakeSwap (V2/V3/Smart Router), ApeSwap, Biswap, Thena, ParaSwap, 1inch, OpenOcean

## Build & Deploy

```bash
cd src
npm run build    # Production build
npm start        # Start production server
```
