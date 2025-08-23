import React, { useState, useEffect } from "react";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const WalletGenerator = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [count, setCount] = useState(1);
  const [walletType, setWalletType] = useState("both");
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revealedData, setRevealedData] = useState({});
  const [isVisible, setIsVisible] = useState({});

  // Address lookup state
  const [addressToCheck, setAddressToCheck] = useState("");
  const [addressType, setAddressType] = useState("ethereum");
  const [accountInfo, setAccountInfo] = useState(null);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Load wallets from localStorage on component mount
  useEffect(() => {
    const savedWallets = localStorage.getItem("generatedWallets");
    const savedMnemonic = localStorage.getItem("savedMnemonic");
    const savedRevealedData = localStorage.getItem("revealedData");
    const savedVisibility = localStorage.getItem("walletVisibility");

    if (savedWallets) {
      try {
        setWallets(JSON.parse(savedWallets));
      } catch (err) {
        console.error("Error loading wallets from localStorage:", err);
      }
    }

    if (savedMnemonic) {
      setMnemonic(savedMnemonic);
    }

    if (savedRevealedData) {
      try {
        setRevealedData(JSON.parse(savedRevealedData));
      } catch (err) {
        console.error("Error loading revealed data from localStorage:", err);
      }
    }

    if (savedVisibility) {
      try {
        setIsVisible(JSON.parse(savedVisibility));
      } catch (err) {
        console.error("Error loading visibility from localStorage:", err);
      }
    }
  }, []);

  // Save wallets to localStorage whenever wallets change
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem("generatedWallets", JSON.stringify(wallets));
    }
  }, [wallets]);

  // Save mnemonic to localStorage
  useEffect(() => {
    if (mnemonic) {
      localStorage.setItem("savedMnemonic", mnemonic);
    }
  }, [mnemonic]);

  // Save revealed data to localStorage
  useEffect(() => {
    if (Object.keys(revealedData).length > 0) {
      localStorage.setItem("revealedData", JSON.stringify(revealedData));
    }
  }, [revealedData]);

  // Save visibility state to localStorage
  useEffect(() => {
    if (Object.keys(isVisible).length > 0) {
      localStorage.setItem("walletVisibility", JSON.stringify(isVisible));
    }
  }, [isVisible]);

  // Auto-detect address type based on format
  const detectAddressType = (address) => {
    if (address.startsWith("0x") && address.length === 42) {
      return "ethereum";
    } else if (address.length >= 32 && address.length <= 44) {
      return "solana";
    }
    return addressType; // Keep current type if can't detect
  };

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
        body: JSON.stringify({
          mnemonic,
          count: Number(count),
          type: walletType,
        }),
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

  // Check address information
  const checkAddress = async (e) => {
    e.preventDefault();
    if (!addressToCheck.trim()) {
      setAddressError("Please enter an address");
      return;
    }

    setCheckingAddress(true);
    setAddressError("");
    setAccountInfo(null);

    try {
      const res = await fetch("http://localhost:3000/api/check-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addressToCheck.trim(),
          type: addressType,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAccountInfo(data.accountInfo);
      } else {
        setAddressError(data.error || "Error checking address");
      }
    } catch (err) {
      setAddressError("Network error");
    }
    setCheckingAddress(false);
  };

  const getWalletTypeColor = (type) => {
    switch (type) {
      case "solana":
        return "#9945FF";
      case "ethereum":
        return "#627EEA";
      default:
        return "#666";
    }
  };

  // Clear all stored data
  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all stored wallets and data? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("generatedWallets");
      localStorage.removeItem("savedMnemonic");
      localStorage.removeItem("revealedData");
      localStorage.removeItem("walletVisibility");

      setWallets([]);
      setMnemonic("");
      setRevealedData({});
      setIsVisible({});
      setError("");

      alert("All data has been cleared!");
    }
  };

  // Export wallets as JSON
  const exportWallets = () => {
    if (wallets.length === 0) {
      alert("No wallets to export!");
      return;
    }

    const exportData = {
      mnemonic: mnemonic,
      wallets: wallets,
      timestamp: new Date().toISOString(),
      revealedData: revealedData,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `wallets_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Wallets exported successfully!");
  };

  // Import wallets from JSON
  const importWallets = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        if (importData.wallets && Array.isArray(importData.wallets)) {
          setWallets(importData.wallets);
          if (importData.mnemonic) {
            setMnemonic(importData.mnemonic);
          }
          if (importData.revealedData) {
            setRevealedData(importData.revealedData);
          }
          alert(
            `Successfully imported ${importData.wallets.length} wallet(s)!`
          );
        } else {
          alert("Invalid wallet file format!");
        }
      } catch (err) {
        console.error("Error importing wallets:", err);
        alert("Error importing wallets. Please check the file format.");
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = "";
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2>Wallet Generator</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {wallets.length > 0 && (
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#4CAF50",
                  backgroundColor: "#1a1a1a",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                }}
              >
                {wallets.length} wallet{wallets.length !== 1 ? "s" : ""} saved
              </span>
            )}
            {wallets.length > 0 && (
              <button
                type="button"
                onClick={exportWallets}
                style={{
                  background: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Export Wallets
              </button>
            )}
            <label
              style={{
                background: "#4CAF50",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "inline-block",
              }}
            >
              Import Wallets
              <input
                type="file"
                accept=".json"
                onChange={importWallets}
                style={{ display: "none" }}
              />
            </label>
            <button
              type="button"
              onClick={clearAllData}
              style={{
                background: "#d32f2f",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Clear All Data
            </button>
          </div>
        </div>
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
            <label>Wallet Type:</label>
            <br />
            <select
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="both">Both Solana & Ethereum</option>
              <option value="solana">Solana Only</option>
              <option value="ethereum">Ethereum Only</option>
            </select>
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
      </div>

      {/* Address Lookup Section */}
      <div
        style={{
          background: "#222",
          color: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h2>Address Lookup</h2>
        <form onSubmit={checkAddress} style={{ marginBottom: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Address:</label>
            <br />
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
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Address Type:</label>
            <br />
            <select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor:
                  addressType === "ethereum" ? "#627EEA" : "#9945FF",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
            </select>
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.9rem",
                color: "#ccc",
                fontStyle: "italic",
              }}
            >
              {addressType === "ethereum"
                ? "Format: 0x..."
                : "Format: Base58 string"}
            </div>
          </div>
          <button
            type="submit"
            disabled={checkingAddress}
            style={{ padding: "0.5rem 1rem" }}
          >
            {checkingAddress ? "Checking..." : "Check Address"}
          </button>
        </form>

        {addressError && (
          <div style={{ color: "#f55", marginBottom: "1rem" }}>
            {addressError}
          </div>
        )}

        {accountInfo && (
          <div
            style={{
              background: "#333",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h3>Account Information</h3>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Address:</strong> <code>{accountInfo.address}</code>
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>Balance:</strong> {accountInfo.balance}{" "}
              {addressType === "solana" ? "SOL" : "ETH"}
            </div>
            {addressType === "ethereum" && (
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Transaction Count:</strong>{" "}
                {accountInfo.transactionCount}
              </div>
            )}
            {addressType === "solana" && (
              <>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Lamports:</strong> {accountInfo.lamports}
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <strong>Executable:</strong>{" "}
                  {accountInfo.executable ? "Yes" : "No"}
                </div>
                {accountInfo.owner && (
                  <div style={{ marginBottom: "0.5rem" }}>
                    <strong>Owner:</strong> <code>{accountInfo.owner}</code>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Generated Wallets Section */}
      {wallets.length > 0 && (
        <div
          style={{
            background: "#222",
            color: "#fff",
            padding: "2rem",
            borderRadius: "1rem",
          }}
        >
          <h3>Generated Wallets</h3>
          {wallets.map((w, idx) => (
            <div
              key={idx}
              style={{
                background: "#333",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "0.5rem",
                borderLeft: `4px solid ${getWalletTypeColor(w.type)}`,
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <strong style={{ color: getWalletTypeColor(w.type) }}>
                  {w.walletName}
                </strong>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <span>
                  Public Key: <code>{w.publicKey}</code>
                </span>
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
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
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;
