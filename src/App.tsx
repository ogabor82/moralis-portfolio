import React, { useState } from "react";
import { BarChart3, AlertTriangle } from "lucide-react";
import { WalletInput } from "./components/WalletInput";
import { ProfitDisplay } from "./components/ProfitDisplay";
import { TransactionList } from "./components/TransactionList";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import {
  Transaction,
  ProfitData,
  MoralisProfitabilityResponse,
  MoralisProfitabilitySummary,
  MoralisNetWorthResponse,
} from "./types";
import {
  initializeMoralis,
  getWalletTransactions,
  getEthBalance,
  getEthUsdPrice,
  getWalletProfitability,
  getWalletProfitabilitySummary,
  getWalletNetWorth,
} from "./utils/moralis";
import { calculateProfitLoss } from "./utils/calculations";
import {
  initializeMoralisSol,
  getSolBalance,
  getSplTokens,
  getSolPortfolio,
} from "./utils/moralisSolana";
import { MoralisProfitDisplay } from "./components/MoralisProfitDisplay";
import { WalletBalancesDisplay } from "./components/WalletBalancesDisplay";

function App() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profitData, setProfitData] = useState<ProfitData | null>(null);
  const [profitSummary, setProfitSummary] =
    useState<MoralisProfitabilitySummary | null>(null);
  const [profitItems, setProfitItems] =
    useState<MoralisProfitabilityResponse | null>(null);
  const [networth, setNetworth] = useState<MoralisNetWorthResponse | null>(
    null
  );
  const [tokensWithPrice, setTokensWithPrice] = useState<any | null>(null);
  const [nativeBalances, setNativeBalances] = useState<any | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const analyzeWallet = async (
    address: string,
    chain: "eth" | "sol" = "eth"
  ) => {
    setLoading(true);
    setError("");
    setTransactions([]);
    setProfitData(null);
    setProfitSummary(null);
    setProfitItems(null);
    setNetworth(null);

    try {
      // Resolve chain defensively from input
      const resolvedChain: "eth" | "sol" = chain
        ? chain
        : /^0x[a-fA-F0-9]{40}$/.test(address)
        ? "eth"
        : "sol";

      // Initialize Moralis if not already done
      await initializeMoralis();
      await initializeMoralisSol();

      if (resolvedChain === "eth") {
        // Fetch transactions, balance and ETH/USD price in parallel
        const [
          txData,
          balance,
          ethUsd,
          summary,
          items,
          worth,
          tokensWithPrice,
          nativeBalances,
        ] = await Promise.all([
          getWalletTransactions(address),
          getEthBalance(address),
          getEthUsdPrice(),
          getWalletProfitabilitySummary(address),
          getWalletProfitability(address),
          getWalletNetWorth(address),
          // extra balances for balances display
          (
            await import("./utils/moralis")
          ).getWalletTokenBalancesPrices(address),
          (
            await import("./utils/moralis")
          ).getNativeBalancesForAddresses([address]),
        ]);

        if (!txData || txData.length === 0) {
          throw new Error("No transactions found for this address");
        }

        // Calculate profit/loss with USD metrics
        const profitLossData = calculateProfitLoss(
          txData,
          address,
          balance,
          ethUsd
        );

        setTransactions(txData);
        setProfitData(profitLossData);
        setProfitSummary(summary);
        setProfitItems(items);
        setNetworth(worth);
        setCurrentAddress(address);
        setTokensWithPrice(tokensWithPrice);
        setNativeBalances(nativeBalances);
      } else {
        // Solana branch: fetch balance, SPL tokens and portfolio
        const [solBalance, spl, portfolio] = await Promise.all([
          getSolBalance(address),
          getSplTokens(address),
          getSolPortfolio(address),
        ]);

        // Store address and reuse balances display by mapping SPL tokens to expected shape
        setCurrentAddress(address);
        setProfitData(null); // EVM-specific PnL not applicable for SOL right now
        setProfitSummary(null);
        setProfitItems(null);
        // Portfolio endpoint does not return USD net worth directly in this SDK build
        setNetworth(undefined as any);

        // Map SPL to WalletBalancesDisplay shape quickly
        const tokensWithPrice = {
          result: ((spl as any[]) || []).map((t: any) => ({
            token_address: t.mint || undefined,
            name: t.name || undefined,
            symbol: t.symbol || undefined,
            decimals: t.decimals ?? 9,
            balance: String(t.amount?.lamports ?? t.amountRaw ?? 0),
            usd_price: t.price_usd ? Number(t.price_usd) : undefined,
            usd_value: t.value_usd ? Number(t.value_usd) : undefined,
          })),
        } as any;
        const lamports = Number(solBalance ?? 0);
        const nativeBalances = {
          result: [{ address, balance: String(lamports) }],
        } as any;
        setTokensWithPrice(tokensWithPrice);
        setNativeBalances(nativeBalances);
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(
        err.message ||
          "Failed to analyze wallet. Please check the address and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentAddress) {
      analyzeWallet(currentAddress);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Wallet Analyzer
              </h1>
              <p className="text-gray-600">
                Analyze any Ethereum wallet's profit and loss
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* API Key Notice */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Setup Required</span>
          </div>
          <p className="text-sm text-yellow-700">
            To use this application, you need to replace 'YOUR_MORALIS_API_KEY'
            in
            <code className="mx-1 px-2 py-1 bg-yellow-100 rounded">
              src/utils/moralis.ts
            </code>
            with your actual Moralis API key. Get one free at
            <a
              href="https://moralis.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              moralis.io
            </a>
          </p>
        </div>

        <WalletInput onAnalyze={analyzeWallet} loading={loading} />

        {loading && <LoadingState />}

        {error && (
          <ErrorState
            message={error}
            onRetry={currentAddress ? handleRetry : undefined}
          />
        )}

        {currentAddress && (
          <>
            {profitData && (
              <ProfitDisplay profitData={profitData} address={currentAddress} />
            )}

            {(profitSummary || profitItems || networth) && (
              <MoralisProfitDisplay
                summary={profitSummary}
                items={profitItems}
                networth={networth}
              />
            )}

            {(tokensWithPrice || nativeBalances) && (
              <WalletBalancesDisplay
                address={currentAddress}
                tokensWithPrice={tokensWithPrice}
                nativeBalances={nativeBalances}
                networthUsd={networth?.total_networth_usd}
                nativeDecimals={profitData ? 18 : 9}
              />
            )}

            {transactions.length > 0 && (
              <TransactionList
                transactions={transactions}
                walletAddress={currentAddress}
              />
            )}
          </>
        )}

        {!loading && !error && !profitData && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-gray-600">
                Enter any Ethereum wallet address above to see detailed
                transaction history and profit/loss analysis.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
