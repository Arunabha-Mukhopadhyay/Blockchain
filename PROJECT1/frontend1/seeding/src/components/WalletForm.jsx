import React from "react";

const WalletForm = ({
  mnemonic,
  setMnemonic,
  count,
  setCount,
  walletType,
  setWalletType,
  loading,
  error,
  handleSubmit,
  generateMnemonic,
}) => {
  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Wallet Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Seed Phrase (mnemonic):
          </label>
          <input
            type="text"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={generateMnemonic}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Mnemonic
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Wallet Type:</label>
          <select
            value={walletType}
            onChange={(e) => setWalletType(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="both">Both Solana & Ethereum</option>
            <option value="solana">Solana Only</option>
            <option value="ethereum">Ethereum Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Wallets:
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Wallets"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md text-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletForm;
