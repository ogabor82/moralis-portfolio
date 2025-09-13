import Moralis from "moralis";

// Uses same API key initialization as EVM; SolApi shares core
const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY as
  | string
  | undefined;

export const initializeMoralisSol = async () => {
  if (!Moralis.Core.isStarted) {
    if (!MORALIS_API_KEY) {
      throw new Error(
        "Missing VITE_MORALIS_API_KEY. Define it in a .env file (e.g. VITE_MORALIS_API_KEY=your_key)."
      );
    }
    await Moralis.start({ apiKey: MORALIS_API_KEY });
  }
};

// Get native SOL balance for an address
export const getSolBalance = async (
  address: string,
  network: "mainnet" | "devnet" = "mainnet"
) => {
  const res = await Moralis.SolApi.account.getBalance({
    address,
    network,
  });
  return res.toJSON();
};

// Get SPL tokens (balances)
export const getSplTokens = async (
  address: string,
  network: "mainnet" | "devnet" = "mainnet"
) => {
  const res = await Moralis.SolApi.account.getSPL({
    address,
    network,
  });
  return res.toJSON();
};

// Get wallet portfolio (aggregated)
export const getSolPortfolio = async (
  address: string,
  network: "mainnet" | "devnet" = "mainnet"
) => {
  const res = await Moralis.SolApi.account.getPortfolio({
    address,
    network,
  });
  return res.toJSON();
};

// Optional: token price for an SPL mint
export const getSolTokenPrice = async (
  address: string,
  network: "mainnet" | "devnet" = "mainnet"
) => {
  const res = await Moralis.SolApi.token.getTokenPrice({
    address,
    network,
  });
  return res.toJSON();
};
