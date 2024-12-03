export interface Transaction {
  id: string;
  time: string;
  type: {
    from: string;
    to: string;
  };
  usdAmount: number;
  tokenAmount1: number;
  tokenAmount2: number;
  walletAddress: string;
}

export interface Token {
  symbol: string;
  amount: number;
  address?: string;
}

export interface LiquidityPool {
  id: string;
  pair: string;
  totalValueLocked: number;
  apr: number;
  volume24h: number;
  myLiquidity: number;
  tokens: {
    token1: Token;
    token2: Token;
  };
}

export interface DepositAmounts {
  [poolId: string]: {
    token1: number;
    token2: number;
  };
}
