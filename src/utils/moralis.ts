import Moralis from "moralis";
import type {
  MoralisProfitabilityResponse,
  MoralisProfitabilitySummary,
  MoralisNetWorthResponse,
  TokenBalancesWithPriceResponse,
  NativeBalancesForAddressesResponse,
} from "../types";

// Vite exposes env vars via import.meta.env and requires the VITE_ prefix
const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY as
  | string
  | undefined;

export const initializeMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    if (!MORALIS_API_KEY) {
      throw new Error(
        "Missing VITE_MORALIS_API_KEY. Define it in a .env file (e.g. VITE_MORALIS_API_KEY=your_key)."
      );
    }
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
  }
};

export const getWalletTransactions = async (
  address: string,
  chain: string = "0x1"
) => {
  try {
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
      address,
      chain,
      limit: 100,
    });
    return response.raw.result;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const getWalletTokenBalances = async (
  address: string,
  chain: string = "0x1"
) => {
  try {
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain,
    });
    return response.raw;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
};

export const getEthBalance = async (address: string, chain: string = "0x1") => {
  try {
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
    });
    return response.raw.balance;
  } catch (error) {
    console.error("Error fetching ETH balance:", error);
    throw error;
  }
};

// Fetch current ETH price in USD using the WETH contract as price reference on mainnet
export const getEthUsdPrice = async (chain: string = "0x1") => {
  try {
    // WETH address on Ethereum mainnet
    const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: WETH_MAINNET,
      chain,
    });
    return response.raw.usdPrice as number;
  } catch (error) {
    console.error("Error fetching ETH/USD price:", error);
    throw error;
  }
};

// Wallet Profitability Summary (returns aggregated PnL metrics)
export const getWalletProfitabilitySummary = async (
  address: string,
  chain: string = "0x1"
): Promise<MoralisProfitabilitySummary> => {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary(
      {
        address,
        chain,
      }
    );
    return response.toJSON() as MoralisProfitabilitySummary;
  } catch (error) {
    console.error("Error fetching wallet profitability summary:", error);
    throw error;
  }
};

// Wallet Profitability (token-level breakdown)
export const getWalletProfitability = async (
  address: string,
  chain: string = "0x1"
): Promise<MoralisProfitabilityResponse> => {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletProfitability({
      address,
      chain,
    });
    return response.toJSON() as MoralisProfitabilityResponse;
  } catch (error) {
    console.error("Error fetching wallet profitability:", error);
    throw error;
  }
};

// Wallet Net Worth
export const getWalletNetWorth = async (
  address: string,
  chain: string = "0x1"
): Promise<MoralisNetWorthResponse> => {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletNetWorth({
      address,
      chains: [chain],
    });
    const raw = response.toJSON() as unknown as {
      total_networth_usd?: string | number;
    };
    const totalUsd = parseFloat(String(raw.total_networth_usd ?? "0"));
    return { total_networth_usd: totalUsd } as MoralisNetWorthResponse;
  } catch (error) {
    console.error("Error fetching wallet net worth:", error);
    throw error;
  }
};

// Wallet token balances with prices
export const getWalletTokenBalancesPrices = async (
  address: string,
  chain: string = "0x1"
): Promise<TokenBalancesWithPriceResponse> => {
  try {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      address,
      chain,
    });
    const json = response.toJSON() as unknown as {
      result?: Array<{
        token_address?: string;
        name?: string;
        symbol?: string;
        decimals?: string | number;
        balance?: string;
        usd_price?: string | number;
        usd_value?: string | number;
      }>;
    };
    const normalized = {
      result: (json.result || []).map((t) => ({
        token_address: t.token_address,
        name: t.name,
        symbol: t.symbol,
        decimals:
          typeof t.decimals === "string" ? parseInt(t.decimals) : t.decimals,
        balance: t.balance,
        usd_price:
          t.usd_price !== undefined
            ? parseFloat(String(t.usd_price))
            : undefined,
        usd_value:
          t.usd_value !== undefined
            ? parseFloat(String(t.usd_value))
            : undefined,
      })),
    } as TokenBalancesWithPriceResponse;
    return normalized;
  } catch (error) {
    console.error("Error fetching token balances with price:", error);
    throw error;
  }
};

// Native balances for a list of addresses
export const getNativeBalancesForAddresses = async (
  addresses: string[],
  chain: string = "0x1"
): Promise<NativeBalancesForAddressesResponse> => {
  try {
    const response = await Moralis.EvmApi.balance.getNativeBalancesForAddresses(
      {
        chain,
        walletAddresses: addresses,
      }
    );
    const simplified = (
      response.raw as unknown as Array<{
        wallet_balances: { address: string; balance: string }[];
      }>
    ).flatMap((c) => c.wallet_balances);
    return { result: simplified } as NativeBalancesForAddressesResponse;
  } catch (error) {
    console.error("Error fetching native balances for addresses:", error);
    throw error;
  }
};
