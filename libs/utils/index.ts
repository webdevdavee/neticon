export const calculateChange = (prices: number[]): string => {
  if (prices.length < 2) return "0.00";
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = ((last - first) / first) * 100;
  return change.toFixed(2);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
