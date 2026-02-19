# BNB DeFi Analytics

**A comprehensive BNB Chain wallet analytics platform with AI-powered DeFi consulting.**

Connect your wallet to view portfolio analytics, DeFi positions, NFT collections, token swap history, wallet statistics, scan token approvals for security risks, and consult an AI advisor for DeFi strategy recommendations — all on BNB Chain.

## Key Features

- **Portfolio Dashboard** — Total net worth, token balances with 24h price changes, distribution charts
- **DeFi Position Tracker** — All protocol positions (lending, LP, farming, staking)
- **NFT Gallery** — NFT collection browser with metadata, images, and floor prices
- **Token Swap History** — Recent DEX swaps with bought/sold tokens, USD values, and exchange info
- **Transaction History** — Decoded, categorized wallet history with ERC20 and native transfers
- **Wallet Statistics** — Total transactions, NFTs, collections count
- **Token Approval Scanner** — Risk-scored approval list with one-click and batch revoke
- **AI DeFi Advisor** — Portfolio-aware streaming AI chat (OpenAI GPT-5.2) for DeFi strategy consulting
- **BatchRevoke Smart Contract** — On-chain contract for batch-revoking dangerous approvals in one tx

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) + TypeScript |
| Styling | Tailwind CSS 4 |
| Wallet | wagmi v2 + viem + RainbowKit |
| Data APIs | Moralis Web3 Data API (12 endpoints) |
| AI | OpenAI GPT-5.2 (streaming SSE) |
| Smart Contract | Solidity 0.8.19 + Hardhat |
| Charts | Recharts 3 |
| State | TanStack React Query v5 |

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd 3defi-analitics

# Install frontend dependencies
cd src
npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys in .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Source | Required |
|----------|--------|----------|
| `MORALIS_API_KEY` | [Moralis Admin](https://admin.moralis.com/) | Yes |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/) | Yes (for AI chat) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | [WalletConnect Cloud](https://cloud.walletconnect.com/) | Yes |
| `BSC_RPC_URL` | Default provided | Optional |

## Network

This project is built exclusively for **BNB Smart Chain (BSC)** mainnet (Chain ID: 56).

## Documentation

- [Project Details](docs/PROJECT.md) — Problem, solution, impact, roadmap
- [Technical Guide](docs/TECHNICAL.md) — Architecture, API integration, smart contract
- [Extras](docs/EXTRAS.md) — Demo links, AI build log
- [Contract Deployment](bsc.address) — On-chain contract addresses

## On-chain Proof

The `BatchRevoke` smart contract is deployed on BNB Smart Chain. See [bsc.address](bsc.address) for contract details.

## License

MIT
