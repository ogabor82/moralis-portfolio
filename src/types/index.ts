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

// Moralis Wallet Profitability summary response (subset of fields used in UI)
export interface MoralisProfitabilitySummary {
  address?: string;
  total_buy_count?: number;
  total_sell_count?: number;
  total_buy_volume_usd?: number;
  total_sell_volume_usd?: number;
  realized_profit_usd?: number;
  realized_profit_ratio?: number; // 0..1
  unrealized_profit_usd?: number;
  unrealized_profit_ratio?: number; // 0..1
  total_fees_usd?: number;
}

export interface MoralisProfitabilityItem {
  token_address?: string;
  token_symbol?: string;
  token_name?: string;
  realized_profit_usd?: number;
  realized_profit_ratio?: number; // 0..1
  total_buy_count?: number;
  total_sell_count?: number;
  total_buy_volume_usd?: number;
  total_sell_volume_usd?: number;
}

export interface MoralisProfitabilityResponse {
  cursor?: string | null;
  page?: number;
  page_size?: number;
  total?: number;
  result?: MoralisProfitabilityItem[];
}

export interface MoralisNetWorthResponse {
  total_networth_usd?: number;
}

// Token balances with price response
export interface TokenBalanceWithPrice {
  token_address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  balance?: string; // raw string
  usd_price?: number;
  usd_value?: number;
}

export interface TokenBalancesWithPriceResponse {
  result?: TokenBalanceWithPrice[];
}

export interface NativeBalanceForAddress {
  address: string;
  balance: string; // wei
}

export interface NativeBalancesForAddressesResponse {
  result: NativeBalanceForAddress[];
}
