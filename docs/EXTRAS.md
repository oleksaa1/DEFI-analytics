# Extras

## Demo

- **Live Demo**: [To be deployed]
- **Demo Video**: [To be recorded]

## Presentation

- **Pitch Deck**: [To be created]

## Tech Stack Summary

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 16.1.6 (App Router, Turbopack) |
| Language | TypeScript 5, React 19.2.3 |
| Styling | Tailwind CSS 4 |
| Wallet | wagmi v2 + viem + RainbowKit |
| Data | Moralis Web3 Data API (12 endpoints) |
| AI | OpenAI GPT-5.2 (streaming SSE) |
| State | TanStack React Query v5 |
| Charts | Recharts 3 |
| Smart Contract | Solidity 0.8.19 + Hardhat |
| Network | BNB Smart Chain (BSC) mainnet |

## Moralis API Endpoints Integrated

1. Token Balances (ERC20)
2. Token Balances with Prices & 24h Change
3. Native BNB Balance
4. Wallet Net Worth
5. NFT Collections (metadata, media, floor price)
6. Token Approvals
7. Raw Transaction History
8. Decoded Wallet History (categorized)
9. DeFi Protocol Positions
10. Wallet Statistics
11. Token Swap History (DEX)
12. P&L Summary (limited on BSC)

## Key Frontend Components

| Component | Description |
|-----------|-------------|
| `PortfolioSummary` | Net worth, 24h change, realized P&L, wallet activity stats |
| `PortfolioChart` | Interactive pie chart of token distribution |
| `TokenBalances` | Token list with prices, amounts, 24h changes |
| `DeFiPositions` | Protocol positions grouped by protocol |
| `NFTGallery` | NFT grid with images, metadata, floor prices |
| `TransactionHistory` | Decoded transactions with category icons |
| `SwapHistory` | DEX swap log with bought/sold tokens |
| `ApprovalList` | Risk-scored approval scanner |
| `BatchRevokeButton` | Multi-select batch revoke UI |
| `ChatInterface` | Streaming AI chat with portfolio context |

## AI Build Log

This project was built using AI-assisted development:

- **IDE**: Cursor
- **AI Models Used**: Claude (development), GPT-5.2 (in-app advisor)
- **AI Usage**: Architecture design, component scaffolding, API integration, smart contract development, testing, documentation
- **Human Work**: Requirements definition, design decisions, testing, API key configuration, deployment

### AI-Assisted Areas
1. Project structure and file organization
2. TypeScript type definitions for Moralis API (12 endpoint response types)
3. React component implementation (10+ dashboard widgets, chat UI, approval scanner)
4. Data normalization layer (Moralis responses → app types)
5. Risk analysis algorithm for token approvals
6. Solidity smart contract (BatchRevoke.sol) with audit and fixes
7. OpenAI GPT-5.2 streaming integration with portfolio-aware context
8. Comprehensive test suite for smart contract
9. All project documentation
