import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Wallet</h3>
            <p className="text-sm text-gray-600">
              Fetching transactions and calculating profit/loss...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};