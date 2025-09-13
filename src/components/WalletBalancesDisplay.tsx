import React from "react";
import { DollarSign } from "lucide-react";
import type {
  TokenBalancesWithPriceResponse,
  NativeBalancesForAddressesResponse,
} from "../types";

interface WalletBalancesDisplayProps {
  address: string;
  tokensWithPrice: TokenBalancesWithPriceResponse | null;
  nativeBalances: NativeBalancesForAddressesResponse | null;
  networthUsd?: number;
  nativeDecimals?: number; // defaults to 18 (ETH); use 9 for SOL
}

export const WalletBalancesDisplay: React.FC<WalletBalancesDisplayProps> = ({
  address,
  tokensWithPrice,
  nativeBalances,
  networthUsd,
  nativeDecimals = 18,
}) => {
  const native = nativeBalances?.result?.find(
    (w) => w.address.toLowerCase() === address.toLowerCase()
  );
  const nativeAmount = native
    ? parseFloat(native.balance) / Math.pow(10, nativeDecimals)
    : undefined;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Wallet Balances
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {typeof networthUsd === "number" && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">
                Net Worth (USD)
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${networthUsd.toFixed(2)}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Native Balance
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {nativeAmount !== undefined ? nativeAmount.toFixed(6) : "-"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Tokens</div>
            <div className="text-2xl font-bold text-gray-900">
              {tokensWithPrice?.result ? tokensWithPrice.result.length : 0}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Token USD
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {tokensWithPrice?.result
                ? `$${tokensWithPrice.result
                    .reduce((sum, t) => sum + (t.usd_value || 0), 0)
                    .toFixed(2)}`
                : "-"}
            </div>
          </div>
        </div>

        {tokensWithPrice?.result && tokensWithPrice.result.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 pr-4">Balance</th>
                  <th className="py-2 pr-4">Price (USD)</th>
                  <th className="py-2 pr-4">Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {tokensWithPrice.result.map((t, idx) => {
                  const decimals = t.decimals || 18;
                  const raw = parseFloat(t.balance || "0");
                  const human = raw / Math.pow(10, decimals);
                  return (
                    <tr key={idx} className="border-t">
                      <td className="py-2 pr-4">
                        <div className="font-medium text-gray-900">
                          {t.symbol || "-"}
                        </div>
                        <div className="text-gray-500">
                          {t.name || t.token_address || ""}
                        </div>
                      </td>
                      <td className="py-2 pr-4">
                        {Number.isFinite(human) ? human.toFixed(6) : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        {t.usd_price !== undefined
                          ? `$${t.usd_price.toFixed(4)}`
                          : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        {t.usd_value !== undefined
                          ? `$${t.usd_value.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletBalancesDisplay;
