# Project Documentation

## Problem

BNB Chain users face several challenges managing their DeFi portfolios:

1. **Fragmented visibility** — Token balances, DeFi positions, NFTs, swap history, and approvals are scattered across dozens of protocols and tools. Users need to visit multiple websites to get a complete picture of their holdings.

2. **Security blind spots** — Most users don't realize they have active unlimited token approvals to smart contracts. These approvals can be exploited by compromised or malicious contracts to drain tokens, even from hardware wallets.

3. **DeFi complexity** — The BNB Chain ecosystem has hundreds of DeFi protocols. Choosing the right strategies, understanding risks, and optimizing yields requires expertise that most users lack.

4. **No personalized guidance** — Existing tools show data but don't help users interpret it or make better decisions based on their specific portfolio.

## Solution

**BNB DeFi Analytics** is a unified platform that brings together portfolio analytics, security scanning, and AI-powered consulting in one interface — exclusively for BNB Smart Chain.

### Portfolio Analytics
- Connect wallet via RainbowKit (MetaMask, WalletConnect, etc.)
- View total wallet net worth and token balances with 24h price changes
- Track all DeFi positions across protocols (lending, LP, farming, staking)
- Browse NFT collections with images, metadata, and floor prices
- Interactive portfolio distribution pie chart
- Wallet statistics (total transactions, NFTs, collections)
- DEX swap history with bought/sold tokens and USD values
- Decoded, categorized transaction history

### Security Scanner
- Fetch all active token approvals via Moralis API
- Automated risk scoring:
  - **High risk**: Unlimited approvals to unverified/unknown contracts
  - **Medium risk**: Unlimited approvals to labeled but uncommon contracts
  - **Low risk**: Limited approvals or well-known protocol routers
- One-click individual revoke
- Batch revoke via on-chain smart contract (one transaction for multiple revokes)

### AI DeFi Advisor
- Streaming chat powered by OpenAI GPT-5.2
- Portfolio-aware: AI sees your token balances, DeFi positions, and risky approvals
- Capabilities:
  - Portfolio health analysis and improvement suggestions
  - DeFi strategy recommendations for BNB Chain protocols
  - Risk assessment of current positions
  - Explanation of dangerous approvals
  - Yield optimization suggestions
  - Responds in the user's language

### On-chain Component
- `BatchRevoke.sol` smart contract deployed on BSC
- Allows batch-revoking multiple approvals in a single transaction (up to 50)
- Batch allowance checking for efficient on-chain reads
- Saves gas costs for users with many risky approvals

## Data Sources

All on-chain data is sourced from the **Moralis Web3 Data API** with 12 integrated endpoints:

| Feature | Moralis Endpoint |
|---------|-----------------|
| Token Balances + Prices | `/wallets/{addr}/tokens` |
| Wallet Net Worth | `/wallets/{addr}/net-worth` |
| NFT Collections | `/{addr}/nft` |
| Token Approvals | `/wallets/{addr}/approvals` |
| DeFi Positions | `/wallets/{addr}/defi/positions` |
| Wallet History (decoded) | `/wallets/{addr}/history` |
| Wallet Statistics | `/wallets/{addr}/stats` |
| Token Swaps | `/wallets/{addr}/swaps` |
| P&L Summary | `/wallets/{addr}/profitability/summary` |
| Native Balance | `/{addr}/balance` |
| Raw Transactions | `/{addr}` |
| ERC20 Balances | `/{addr}/erc20` |

## Impact

- **For DeFi users**: Single place to see everything, understand risks, and get guidance
- **For security**: Proactive scanning prevents exploit losses from forgotten approvals
- **For adoption**: AI advisor lowers the barrier for newcomers to participate in BNB Chain DeFi
- **For efficiency**: Batch operations save gas; unified dashboard saves time

## Limitations

- Moralis API requires an API key (free tier available with rate limits)
- AI responses are informational, not financial advice
- Portfolio data is cached (30s stale time) — not real-time
- PnL summary is not supported on BSC by Moralis (displayed as "N/A")
- Batch revoke contract calls `approve(spender, 0)` on behalf of the user; requires the contract to have prior approval

## Roadmap

### Phase 1 (Hackathon MVP) — Current
- [x] Wallet connection + portfolio dashboard
- [x] Token balances with 24h price changes
- [x] Wallet net worth via Moralis
- [x] DeFi position tracking across protocols
- [x] NFT gallery with metadata and floor prices
- [x] Decoded, categorized transaction history
- [x] DEX token swap history
- [x] Wallet statistics
- [x] Portfolio distribution chart
- [x] Approval scanner with risk analysis
- [x] Individual and batch revoke
- [x] AI DeFi advisor (streaming chat with portfolio context)
- [x] BatchRevoke smart contract (audited, tested)

### Phase 2
- [ ] Multi-chain support (opBNB, Ethereum, Polygon)
- [ ] Historical portfolio tracking and charting
- [ ] Approval monitoring alerts (notifications when new approvals are detected)
- [ ] AI-generated portfolio reports (weekly/monthly)
- [ ] Token price alerts

### Phase 3
- [ ] AI agent for automated DeFi actions (swap, stake, provide liquidity)
- [ ] Social features (share portfolio stats, compare strategies)
- [ ] Mobile-optimized PWA
- [ ] Premium features with token-gated access

## AI Build Log

This project was built with AI assistance (Cursor IDE). Key areas where AI accelerated development:

- Architecture planning and file structure design
- Component implementation (React 19 + TypeScript)
- API integration patterns (Moralis Web3 Data API, 12 endpoints)
- Smart contract development and testing (Solidity + Hardhat)
- Risk analysis algorithm design
- OpenAI GPT-5.2 streaming integration
- Documentation generation
