export interface Transaction {
  hash: string;
  block_timestamp: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  receipt_status: string;
  block_number: string;
}

export interface TokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_price?: number;
  usd_value?: number;
}

export interface WalletAnalysis {
  address: string;
  totalTransactions: number;
  firstTransaction: string;
  lastTransaction: string;
  totalSpent: number;
  totalReceived: number;
  netProfit: number;
  profitPercentage: number;
  isProfit: boolean;
}

export interface ProfitData {
  totalValue: number;
  totalSpent: number;
  profit: number;
  profitPercentage: number;
  isProfit: boolean;
  // USD metrics
  ethUsdPrice?: number;
  totalValueUsd?: number;
  totalSpentUsd?: number;
  profitUsd?: number;
}
