import React, { useState, useEffect } from "react";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
import WalletForm from "./components/WalletForm";
import AddressLookup from "./components/AddressLookup";
import WalletList from "./components/WalletList";
import Header from "./components/Header";

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
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Header
          wallets={wallets}
          exportWallets={exportWallets}
          importWallets={importWallets}
          clearAllData={clearAllData}
        />

        <WalletForm
          mnemonic={mnemonic}
          setMnemonic={setMnemonic}
          count={count}
          setCount={setCount}
          walletType={walletType}
          setWalletType={setWalletType}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
          generateMnemonic={generateMnemonic}
        />

        <AddressLookup
          addressToCheck={addressToCheck}
          setAddressToCheck={setAddressToCheck}
          addressType={addressType}
          setAddressType={setAddressType}
          accountInfo={accountInfo}
          checkingAddress={checkingAddress}
          addressError={addressError}
          checkAddress={checkAddress}
          detectAddressType={detectAddressType}
        />

        <WalletList
          wallets={wallets}
          revealedData={revealedData}
          isVisible={isVisible}
          toggleVisibility={toggleVisibility}
          getWalletTypeColor={getWalletTypeColor}
        />
      </div>
    </div>
  );
};

export default WalletGenerator;
