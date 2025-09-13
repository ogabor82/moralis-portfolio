import Moralis from "moralis";

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
