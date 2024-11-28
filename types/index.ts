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
