import React from "react";
import { BarChart3 } from "lucide-react";
import type {
  MoralisProfitabilityResponse,
  MoralisProfitabilitySummary,
  MoralisNetWorthResponse,
} from "../types";

interface MoralisProfitDisplayProps {
  summary: MoralisProfitabilitySummary | null;
  items: MoralisProfitabilityResponse | null;
  networth: MoralisNetWorthResponse | null;
}

export const MoralisProfitDisplay: React.FC<MoralisProfitDisplayProps> = ({
  summary,
  items,
  networth,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Moralis Profitability (API)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Net Worth
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {networth?.total_networth_usd !== undefined
                ? `$${networth.total_networth_usd.toFixed(2)} USD`
                : "-"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Realized PnL
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary?.realized_profit_usd !== undefined
                ? `${summary.realized_profit_usd! >= 0 ? "+" : ""}$${Math.abs(
                    summary.realized_profit_usd!
                  ).toFixed(2)} USD`
                : "-"}
            </div>
            <div className="text-sm text-gray-600">
              {summary?.realized_profit_ratio !== undefined
                ? `(${(summary.realized_profit_ratio! * 100).toFixed(2)}%)`
                : ""}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Unrealized PnL
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {summary?.unrealized_profit_usd !== undefined
                ? `${summary.unrealized_profit_usd! >= 0 ? "+" : ""}$${Math.abs(
                    summary.unrealized_profit_usd!
                  ).toFixed(2)} USD`
                : "-"}
            </div>
            <div className="text-sm text-gray-600">
              {summary?.unrealized_profit_ratio !== undefined
                ? `(${(summary.unrealized_profit_ratio! * 100).toFixed(2)}%)`
                : ""}
            </div>
          </div>
        </div>

        {items?.result && items.result.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Token breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="py-2 pr-4">Token</th>
                    <th className="py-2 pr-4">Realized PnL (USD)</th>
                    <th className="py-2 pr-4">Buy / Sell</th>
                  </tr>
                </thead>
                <tbody>
                  {items.result.map((it, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-900">
                          {it.token_symbol || "-"}
                        </div>
                        <div className="text-gray-500">
                          {it.token_name || it.token_address || ""}
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        {it.realized_profit_usd !== undefined
                          ? `${
                              it.realized_profit_usd >= 0 ? "+" : ""
                            }$${Math.abs(it.realized_profit_usd).toFixed(2)}`
                          : "-"}
                        {it.realized_profit_ratio !== undefined && (
                          <span className="ml-2 text-gray-500">
                            (
                            {((it.realized_profit_ratio || 0) * 100).toFixed(2)}
                            % )
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-700">
                        {(it.total_buy_count || 0) +
                          " / " +
                          (it.total_sell_count || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoralisProfitDisplay;
