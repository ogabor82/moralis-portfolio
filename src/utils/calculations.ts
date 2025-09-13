import { Transaction, ProfitData } from "../types";

export const calculateProfitLoss = (
  transactions: Transaction[],
  address: string,
  currentBalance: string,
  ethUsdPrice?: number
): ProfitData => {
  let totalReceived = 0;
  let totalSpent = 0;
  let gasSpent = 0;

  transactions.forEach((tx) => {
    const value = parseFloat(tx.value) / Math.pow(10, 18); // Convert Wei to ETH
    const gas = parseFloat(tx.gas || "0");
    const gasPrice = parseFloat(tx.gas_price || "0");
    const gasFee = (gas * gasPrice) / Math.pow(10, 18);

    if (tx.to_address.toLowerCase() === address.toLowerCase()) {
      // Received ETH
      totalReceived += value;
    } else if (tx.from_address.toLowerCase() === address.toLowerCase()) {
      // Sent ETH
      totalSpent += value;
      gasSpent += gasFee;
    }
  });

  const currentBalanceEth = parseFloat(currentBalance) / Math.pow(10, 18);
  const totalValue = currentBalanceEth + totalSpent;
  const totalCost = totalReceived + gasSpent;
  const profit = totalValue - totalCost;
  const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const result: ProfitData = {
    totalValue: totalValue,
    totalSpent: totalCost,
    profit,
    profitPercentage,
    isProfit: profit > 0,
  };

  if (ethUsdPrice && Number.isFinite(ethUsdPrice)) {
    result.ethUsdPrice = ethUsdPrice;
    result.totalValueUsd = totalValue * ethUsdPrice;
    result.totalSpentUsd = totalCost * ethUsdPrice;
    result.profitUsd = profit * ethUsdPrice;
  }

  return result;
};

export const formatEth = (wei: string): string => {
  const eth = parseFloat(wei) / Math.pow(10, 18);
  return eth.toFixed(6);
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp: string): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
