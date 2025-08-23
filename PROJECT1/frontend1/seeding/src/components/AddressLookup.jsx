import React from "react";

const AddressLookup = ({
  addressToCheck,
  setAddressToCheck,
  addressType,
  setAddressType,
  accountInfo,
  checkingAddress,
  addressError,
  checkAddress,
  detectAddressType,
}) => {
  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Address Lookup</h2>
      <form onSubmit={checkAddress} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Address:</label>
          <input
            type="text"
            value={addressToCheck}
            onChange={(e) => {
              const value = e.target.value;
              setAddressToCheck(value);
              if (value.length > 10) {
                const detectedType = detectAddressType(value);
                setAddressType(detectedType);
              }
            }}
            placeholder="Enter Solana or Ethereum address"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Address Type:
          </label>
          <select
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
            className={`w-full p-3 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              addressType === "ethereum" ? "bg-blue-600" : "bg-purple-600"
            }`}
          >
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
          </select>
          <div className="mt-2 text-sm text-gray-400 italic">
            {addressType === "ethereum"
              ? "Format: 0x..."
              : "Format: Base58 string"}
          </div>
        </div>

        <button
          type="submit"
          disabled={checkingAddress}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkingAddress ? "Checking..." : "Check Address"}
        </button>
      </form>

      {addressError && (
        <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md text-red-200">
          {addressError}
        </div>
      )}

      {accountInfo && (
        <div className="mt-6 p-6 bg-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <strong>Address:</strong>{" "}
              <code className="bg-gray-600 px-2 py-1 rounded text-sm">
                {accountInfo.address}
              </code>
            </div>
            <div>
              <strong>Balance:</strong> {accountInfo.balance}{" "}
              {addressType === "solana" ? "SOL" : "ETH"}
            </div>
            {addressType === "ethereum" && (
              <div>
                <strong>Transaction Count:</strong>{" "}
                {accountInfo.transactionCount}
              </div>
            )}
            {addressType === "solana" && (
              <>
                <div>
                  <strong>Lamports:</strong> {accountInfo.lamports}
                </div>
                <div>
                  <strong>Executable:</strong>{" "}
                  {accountInfo.executable ? "Yes" : "No"}
                </div>
                {accountInfo.owner && (
                  <div>
                    <strong>Owner:</strong>{" "}
                    <code className="bg-gray-600 px-2 py-1 rounded text-sm">
                      {accountInfo.owner}
                    </code>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressLookup;
