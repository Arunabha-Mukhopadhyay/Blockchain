import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ------------------ Connections ------------------ */
const solanaConnection = new Connection("https://api.mainnet-beta.solana.com");
const ethereumProvider = new ethers.JsonRpcProvider("https://cloudflare-eth.com");

/* ------------------ TEMP STORAGE (DEMO ONLY) ------------------ */
let generatedWallets = [];

/* ------------------ Utils ------------------ */
const maskData = (data) =>
  "•".repeat(Math.min(data.length, 20)) + (data.length > 20 ? "..." : "");

/* ------------------ Wallet Generators ------------------ */

// Solana
const generateSolanaWallet = (seed, index) => {
  const path = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  const privateKey = Buffer.from(keypair.secretKey).toString("hex");

  return {
    walletId: `solana-${Date.now()}-${index}`,
    walletName: `Solana Wallet ${index + 1}`,
    type: "solana",
    publicKey: keypair.publicKey.toBase58(),
    privateKey: maskData(privateKey),
    secretPhrase: maskData(seed.toString("hex")),
    actualPrivateKey: privateKey,
    actualSecretPhrase: seed.toString("hex"),
  };
};

// Ethereum
const generateEthereumWallet = (mnemonic, index) => {
  const path = `m/44'/60'/0'/0/${index}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);

  return {
    walletId: `ethereum-${Date.now()}-${index}`,
    walletName: `Ethereum Wallet ${index + 1}`,
    type: "ethereum",
    publicKey: wallet.address,
    privateKey: maskData(wallet.privateKey),
    secretPhrase: maskData(mnemonic),
    actualPrivateKey: wallet.privateKey,
    actualSecretPhrase: mnemonic,
  };
};

/* ------------------ Routes ------------------ */

// Generate wallets
app.post("/api/generate-wallets", (req, res) => {
  const { mnemonic, count, type = "both" } = req.body;

  if (!mnemonic || !count || count < 1) {
    return res.status(400).json({ error: "Mnemonic and count are required." });
  }

  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const wallets = [];

    for (let i = 0; i < count; i++) {
      if (type === "solana" || type === "both") {
        wallets.push(generateSolanaWallet(seed, i));
      }
      if (type === "ethereum" || type === "both") {
        wallets.push(generateEthereumWallet(mnemonic, i));
      }
    }

    generatedWallets = wallets;

    // Remove actual secrets before sending
    const safeWallets = wallets.map(
      ({ actualPrivateKey, actualSecretPhrase, ...rest }) => rest
    );

    res.json({ wallets: safeWallets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate wallets" });
  }
});

// Reveal wallet data
app.post("/api/reveal-wallet-data", (req, res) => {
  const { walletId, field } = req.body;

  const wallet = generatedWallets.find(w => w.walletId === walletId);
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  if (field === "privateKey") {
    return res.json({ value: wallet.actualPrivateKey });
  }

  if (field === "secretPhrase") {
    return res.json({ value: wallet.actualSecretPhrase });
  }

  res.status(400).json({ error: "Invalid field" });
});

// Check address
app.post("/api/check-address", async (req, res) => {
  const { address, type } = req.body;

  try {
    if (type === "solana") {
      const pubKey = new PublicKey(address);
      const balance = await solanaConnection.getBalance(pubKey);

      return res.json({
        address,
        balance: balance / 1e9,
      });
    }

    if (type === "ethereum") {
      if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: "Invalid ETH address" });
      }

      const balance = await ethereumProvider.getBalance(address);
      return res.json({
        address,
        balance: ethers.formatEther(balance),
      });
    }

    res.status(400).json({ error: "Invalid type" });
  } catch (err) {
    res.status(500).json({ error: "Failed to check address" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
