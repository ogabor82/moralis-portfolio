import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Transaction } from '../types';
import { formatEth, formatAddress, formatDate } from '../utils/calculations';

interface TransactionListProps {
  transactions: Transaction[];
  walletAddress: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, walletAddress }) => {
  const getTransactionType = (tx: Transaction) => {
    return tx.to_address.toLowerCase() === walletAddress.toLowerCase() ? 'received' : 'sent';
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {transactions.length} most recent transactions
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => {
            const type = getTransactionType(tx);
            const isReceived = type === 'received';
            const ethValue = formatEth(tx.value);

            return (
              <div key={tx.hash} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isReceived ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isReceived ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isReceived ? 'text-green-700' : 'text-red-700'}`}>
                          {isReceived ? 'Received' : 'Sent'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {isReceived ? 'from' : 'to'} {formatAddress(isReceived ? tx.from_address : tx.to_address)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(tx.block_timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${isReceived ? 'text-green-700' : 'text-red-700'}`}>
                      {isReceived ? '+' : '-'}{ethValue} ETH
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        Block #{tx.block_number}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};