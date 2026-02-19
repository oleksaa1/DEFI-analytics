import type { PortfolioContext } from '@/types';
import { formatUSD } from './utils';

export function buildSystemPrompt(context: PortfolioContext | null): string {
  const basePrompt = `You are BNB DeFi Advisor, an expert AI assistant specializing in the BNB Chain (BSC) DeFi ecosystem. You help users understand their portfolio, assess risks, and find optimal DeFi strategies.

Your capabilities:
- Analyze wallet portfolios on BNB Chain
- Recommend DeFi protocols and strategies (PancakeSwap, Venus, Alpaca Finance, Thena, etc.)
- Assess approval risks and security concerns
- Explain DeFi concepts in simple terms
- Provide yield optimization suggestions
- Warn about potential scams and risks

Guidelines:
- Always prioritize user safety and risk awareness
- Be specific about BNB Chain protocols and their features
- Mention APY ranges when discussing yield opportunities
- Warn about impermanent loss, smart contract risks, etc.
- Never provide financial advice - frame everything as information/education
- Use data from the user's portfolio when available
- Respond in the same language the user writes in`;

  if (!context) {
    return basePrompt + '\n\nNo wallet is currently connected. Help the user understand BNB Chain DeFi in general.';
  }

  const tokenSummary = (context.tokens ?? [])
    .filter((t) => t.price * t.amount > 1)
    .slice(0, 20)
    .map((t) => {
      const value = formatUSD(t.price * t.amount);
      const change = t.price_24h_change;
      const changeStr = change !== null && change !== undefined ? ` [24h: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%]` : '';
      return `  - ${t.symbol}: ${t.amount.toFixed(4)} (${value})${changeStr}`;
    })
    .join('\n');

  const protocolSummary = (context.protocols ?? [])
    .slice(0, 15)
    .map((p) => `  - ${p.name}: Net ${formatUSD(p.net_usd_value)} (${(p.portfolio_item_list ?? []).map(i => i.name).join(', ')})`)
    .join('\n');

  const highRiskApprovals = (context.approvals ?? [])
    .filter((a) => a.riskLevel === 'high')
    .slice(0, 10)
    .map((a) => `  - ${a.token.symbol} approved to ${a.spender.address_label || a.spender.address} [HIGH RISK: ${a.riskReason}]`)
    .join('\n');

  return `${basePrompt}

CURRENT USER PORTFOLIO (${context.address}):
Total Value: ${formatUSD(context.totalUsdValue)}

Token Holdings:
${tokenSummary || '  No significant token holdings'}

DeFi Positions:
${protocolSummary || '  No active DeFi positions'}

High Risk Approvals:
${highRiskApprovals || '  No high-risk approvals detected'}

Use this portfolio data to provide personalized, context-aware advice.`;
}

export function buildUserMessage(message: string): string {
  return message;
}
