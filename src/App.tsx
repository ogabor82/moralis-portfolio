import React, { useState } from "react";
import { BarChart3, AlertTriangle } from "lucide-react";
import { WalletInput } from "./components/WalletInput";
import { ProfitDisplay } from "./components/ProfitDisplay";
import { TransactionList } from "./components/TransactionList";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { Transaction, ProfitData } from "./types";
import {
  initializeMoralis,
  getWalletTransactions,
  getEthBalance,
  getEthUsdPrice,
} from "./utils/moralis";
import { calculateProfitLoss } from "./utils/calculations";

function App() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profitData, setProfitData] = useState<ProfitData | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [error, setError] = useState<string>("");

  const analyzeWallet = async (address: string) => {
    setLoading(true);
    setError("");
    setTransactions([]);
    setProfitData(null);

    try {
      // Initialize Moralis if not already done
      await initializeMoralis();

      // Fetch transactions, balance and ETH/USD price in parallel
      const [txData, balance, ethUsd] = await Promise.all([
        getWalletTransactions(address),
        getEthBalance(address),
        getEthUsdPrice(),
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
      setCurrentAddress(address);
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

        {profitData && currentAddress && (
          <>
            <ProfitDisplay profitData={profitData} address={currentAddress} />
            <TransactionList
              transactions={transactions}
              walletAddress={currentAddress}
            />
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
