export const BATCH_REVOKE_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const BATCH_REVOKE_ABI = [
  {
    name: 'batchCheckAllowances',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'tokens', type: 'address[]' },
      { name: 'spenders', type: 'address[]' },
    ],
    outputs: [{ name: 'allowances', type: 'uint256[]' }],
  },
  {
    name: 'batchRevoke',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokens', type: 'address[]' },
      { name: 'spenders', type: 'address[]' },
    ],
    outputs: [],
  },
  {
    name: 'revoke',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [],
  },
  {
    name: 'MAX_BATCH_SIZE',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'BatchRevoked',
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'count', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'Revoked',
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
    ],
  },
  {
    name: 'RevokeFailed',
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
    ],
  },
] as const;

export const BSC_CHAIN_ID = 56;
