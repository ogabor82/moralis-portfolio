import Moralis from "moralis";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

export const initializeMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: MORALIS_API_KEY as string,
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
