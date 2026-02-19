import type { MoralisApproval, ApprovalWithRisk, RiskLevel } from '@/types';
import { isUnlimitedApproval } from './utils';

// Well-known BNB Chain protocol addresses (routers, etc.)
const KNOWN_PROTOCOLS: Record<string, string> = {
  '0x10ed43c718714eb63d5aa57b78b54704e256024e': 'PancakeSwap Router V2',
  '0x13f4ea83d0bd40e75c8222255bc855a974568dd4': 'PancakeSwap Router V3',
  '0x1b81d678ffb9c0263b24a97847620c99d213eb14': 'PancakeSwap: Smart Router',
  '0x05ff2b0db69458a0750badebc4f9e13add608c7f': 'PancakeSwap: Old Router',
  '0xcf0febd3f17cef5b47b0cd257acf6025c5bff3b7': 'ApeSwap Router',
  '0x3a6d8ca21d1cf76f653a67577fa0d27453350dd8': 'Biswap Router',
  '0x325e343f1de602396e256b67efd1f61c3a6b38bd': 'Thena Router',
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': 'ParaSwap',
  '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router V5',
  '0x6352a56caadc4f1e25cd6c75970fa768a3304e64': 'OpenOcean Exchange',
};

function getSpenderLabel(spenderAddress: string, addressLabel: string | null): string {
  const lower = spenderAddress.toLowerCase();
  return KNOWN_PROTOCOLS[lower] || addressLabel || 'Unknown Contract';
}

function isKnownProtocol(spenderAddress: string): boolean {
  return spenderAddress.toLowerCase() in KNOWN_PROTOCOLS;
}

function assessRisk(approval: MoralisApproval): { level: RiskLevel; reason: string } {
  const unlimited = isUnlimitedApproval(approval.value);
  const known = isKnownProtocol(approval.spender.address);
  const verified = approval.token.verified_contract;
  const hasLabel = !!approval.spender.address_label;
  const isSpam = approval.token.possible_spam;

  // Spam token approvals
  if (isSpam) {
    return {
      level: 'high',
      reason: 'Approval for a potential spam/scam token',
    };
  }

  // Unlimited approval to unknown, unverified contract
  if (unlimited && !known && !hasLabel) {
    return {
      level: 'high',
      reason: 'Unlimited approval to an unknown, unlabeled contract',
    };
  }

  // Unlimited approval to unknown but labeled contract
  if (unlimited && !known && hasLabel) {
    return {
      level: 'medium',
      reason: `Unlimited approval to ${approval.spender.address_label}`,
    };
  }

  // Unlimited approval to known protocol
  if (unlimited && known) {
    return {
      level: 'low',
      reason: `Unlimited approval to ${getSpenderLabel(approval.spender.address, approval.spender.address_label)}`,
    };
  }

  // Limited approval to unknown contract
  if (!known && !hasLabel && !verified) {
    return {
      level: 'medium',
      reason: 'Limited approval to an unverified, unknown contract',
    };
  }

  // Limited approval to known or labeled contract
  return {
    level: 'low',
    reason: `Limited approval to ${getSpenderLabel(approval.spender.address, approval.spender.address_label)}`,
  };
}

export function analyzeApprovals(approvals: MoralisApproval[]): ApprovalWithRisk[] {
  return approvals
    .map((approval) => {
      const { level, reason } = assessRisk(approval);
      return {
        ...approval,
        riskLevel: level,
        riskReason: reason,
      };
    })
    .sort((a, b) => {
      const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
      return order[a.riskLevel] - order[b.riskLevel];
    });
}

export function getRiskStats(approvals: ApprovalWithRisk[]) {
  return {
    total: approvals.length,
    high: approvals.filter((a) => a.riskLevel === 'high').length,
    medium: approvals.filter((a) => a.riskLevel === 'medium').length,
    low: approvals.filter((a) => a.riskLevel === 'low').length,
  };
}
