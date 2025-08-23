import React from "react";

const Header = ({ wallets, exportWallets, importWallets, clearAllData }) => {
  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wallet Generator</h2>
        <div className="flex gap-3">
          {wallets.length > 0 && (
            <span className="text-sm text-green-400 bg-gray-700 px-3 py-1 rounded-md">
              {wallets.length} wallet{wallets.length !== 1 ? "s" : ""} saved
            </span>
          )}

          {wallets.length > 0 && (
            <button
              type="button"
              onClick={exportWallets}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Export Wallets
            </button>
          )}

          <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm cursor-pointer">
            Import Wallets
            <input
              type="file"
              accept=".json"
              onChange={importWallets}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={clearAllData}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
