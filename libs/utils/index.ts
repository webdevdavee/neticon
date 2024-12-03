export const calculateChange = (prices: number[]): string => {
  if (prices.length < 2) return "0.00";
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = ((last - first) / first) * 100;
  return change.toFixed(2);
};

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculatePoolShare = (
  depositAmount: number,
  totalValueLocked: number
): number => {
  return (depositAmount / totalValueLocked) * 100;
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
