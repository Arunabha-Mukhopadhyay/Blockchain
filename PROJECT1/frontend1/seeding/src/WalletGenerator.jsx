import React, { useState } from "react";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const WalletGenerator = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [count, setCount] = useState(1);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revealedData, setRevealedData] = useState({});
  const [isVisible, setIsVisible] = useState({});

  // Generate a random mnemonic
  const generateMnemonic = () => {
    setMnemonic(bip39.generateMnemonic());
  };

  // Reveal sensitive data from backend
  const revealData = async (walletId, field) => {
    try {
      const res = await fetch("http://localhost:3000/api/reveal-wallet-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId, field }),
      });
      const data = await res.json();
      if (res.ok) {
        setRevealedData((prev) => ({
          ...prev,
          [`${walletId}-${field}`]: data.data,
        }));
      } else {
        alert(data.error || "Failed to reveal data");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  // Toggle visibility for a specific field of a wallet
  const toggleVisibility = (walletId, field) => {
    const key = `${walletId}-${field}`;
    setIsVisible((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (!isVisible[key] && !revealedData[key]) {
      revealData(walletId, field);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWallets([]);
    setRevealedData({}); // Reset revealed data
    setIsVisible({}); // Reset visibility
    try {
      const res = await fetch("http://localhost:3000/api/generate-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mnemonic, count: Number(count) }),
      });
      const data = await res.json();
      if (res.ok) {
        setWallets(data.wallets);
      } else {
        setError(data.error || "Error generating wallets");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        background: "#222",
        color: "#fff",
        padding: "2rem",
        borderRadius: "1rem",
      }}
    >
      <h2>Wallet Generator</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Seed Phrase (mnemonic):</label>
          <br />
          <input
            type="text"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
          <button
            type="button"
            onClick={generateMnemonic}
            style={{ marginTop: "0.5rem" }}
          >
            Generate Mnemonic
          </button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Number of Wallets:</label>
          <br />
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Generating..." : "Generate Wallets"}
        </button>
      </form>
      {error && (
        <div style={{ color: "#f55", marginBottom: "1rem" }}>{error}</div>
      )}
      {wallets.length > 0 && (
        <div>
          <h3>Generated Wallets</h3>
          {wallets.map((w, idx) => (
            <div
              key={idx}
              style={{
                background: "#333",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
            >
              <strong>{w.walletName}</strong>
              <br />
              <span>
                Public Key: <code>{w.publicKey}</code>
              </span>
              <br />
              <span>
                Private Key:{" "}
                <code>
                  {isVisible[`${w.walletId}-privateKey`]
                    ? revealedData[`${w.walletId}-privateKey`] || w.privateKey
                    : w.privateKey}
                </code>
                <button
                  onClick={() => toggleVisibility(w.walletId, "privateKey")}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  {isVisible[`${w.walletId}-privateKey`] ? "👁️" : "👁️‍🗨️"}
                </button>
              </span>
              <br />
              <span>
                Secret Phrase:{" "}
                <code>
                  {isVisible[`${w.walletId}-secretPhrase`]
                    ? revealedData[`${w.walletId}-secretPhrase`] ||
                      w.secretPhrase
                    : w.secretPhrase}
                </code>
                <button
                  onClick={() => toggleVisibility(w.walletId, "secretPhrase")}
                  style={{
                    marginLeft: "0.5rem",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                >
                  {isVisible[`${w.walletId}-secretPhrase`] ? "👁️" : "👁️‍🗨️"}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;
