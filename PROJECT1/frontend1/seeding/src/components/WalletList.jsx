import React from "react";

const WalletList = ({ wallets, revealedData, isVisible, toggleVisibility, getWalletTypeColor }) => {
  if (!wallets?.length) return null;

  return (
    <div className="bg-gray-800 text-white p-8 rounded-lg">
      <h3 className="text-2xl font-bold mb-6">Generated Wallets</h3>

      <div className="space-y-4">
        {wallets.map((w) => (
          <div
            key={w.walletId}
            className="bg-gray-700 p-6 rounded-lg border-l-4"
            style={{ borderLeftColor: getWalletTypeColor(w.type) }}
          >
            <div className="mb-3">
              <strong className="text-lg" style={{ color: getWalletTypeColor(w.type) }}>
                {w.walletName}
              </strong>
            </div>

            <div className="space-y-3">
              <div>
                <span className="font-medium">Public Key:</span>{" "}
                <code className="bg-gray-600 px-2 py-1 rounded text-sm break-all">{w.publicKey}</code>
              </div>

              <div>
                <span className="font-medium">Private Key:</span>{" "}
                <code className="bg-gray-600 px-2 py-1 rounded text-sm break-all">
                  {isVisible[w.walletId]?.privateKey
                    ? revealedData[w.walletId]?.privateKey || w.privateKey
                    : w.privateKey}
                </code>
                <button
                  onClick={() => toggleVisibility(w.walletId, "privateKey")}
                  className="ml-2 text-xl"
                >
                  {isVisible[w.walletId]?.privateKey ? "🙈" : "👁️"}
                </button>
              </div>

              <div>
                <span className="font-medium">Secret Phrase:</span>{" "}
                <code className="bg-gray-600 px-2 py-1 rounded text-sm break-all">
                  {isVisible[w.walletId]?.secretPhrase
                    ? revealedData[w.walletId]?.secretPhrase || w.secretPhrase
                    : w.secretPhrase}
                </code>
                <button
                  onClick={() => toggleVisibility(w.walletId, "secretPhrase")}
                  className="ml-2 text-xl"
                >
                  {isVisible[w.walletId]?.secretPhrase ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletList;
