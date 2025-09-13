import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { ProfitData } from '../types';

interface ProfitDisplayProps {
  profitData: ProfitData;
  address: string;
}

export const ProfitDisplay: React.FC<ProfitDisplayProps> = ({ profitData, address }) => {
  const { totalValue, totalSpent, profit, profitPercentage, isProfit } = profitData;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
            {isProfit ? (
              <TrendingUp className="w-6 h-6 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-600" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Profit/Loss Analysis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Current Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalValue.toFixed(4)} ETH
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {totalSpent.toFixed(4)} ETH
            </p>
          </div>

          <div className={`rounded-lg p-4 ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isProfit ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? 'Profit' : 'Loss'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
              {profit > 0 ? '+' : ''}{profit.toFixed(4)} ETH
            </p>
            <p className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              ({profitPercentage > 0 ? '+' : ''}{profitPercentage.toFixed(2)}%)
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Wallet:</span> {address}
          </p>
        </div>
      </div>
    </div>
  );
};