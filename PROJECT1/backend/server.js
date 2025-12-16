import express from "express";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import pkg from "@solana/web3.js";
const { Keypair } = pkg;
import { derivePath } from "ed25519-hd-key";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Store generated wallets temporarily (in production, use a proper database)
let generatedWallets = [];

// Mask sensitive data
const maskData = (data) => {
  return "•".repeat(Math.min(data.length, 20)) + (data.length > 20 ? "..." : "");
};

// POST /api/generate-wallets
// Body: { mnemonic: string, count: number }
app.post("/api/generate-wallets", (req, res) => {
  const { mnemonic, count } = req.body;
  if (!mnemonic || !count || count < 1) {
    return res.status(400).json({ error: "Mnemonic and count are required." });
  }
  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const wallets = [];
    for (let i = 0; i < count; i++) {
      const path = `m/44'/501'/${i}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derivedSeed);
      const publicKey = keypair.publicKey.toBase58();
      const privateKey = Buffer.from(keypair.secretKey).toString("hex");
      
      wallets.push({
        walletName: `Wallet ${i + 1}`,
        publicKey,
        privateKey: maskData(privateKey), // Masked by default
        secretPhrase: maskData(mnemonic), // Masked by default
        walletId: `${Date.now()}-${i}` // Unique ID for revealing data
      });
    }
    
    // Store the actual sensitive data temporarily
    generatedWallets = wallets.map((w, i) => ({
      ...w,
      actualPrivateKey: Buffer.from(Keypair.fromSeed(derivePath(`m/44'/501'/${i}'/0'`, seed.toString("hex")).key).secretKey).toString("hex"),
      actualSecretPhrase: mnemonic
    }));
    
    return res.json({ wallets });
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate wallets." });
  }
});

// POST /api/reveal-wallet-data
// Body: { walletId: string, field: 'privateKey' | 'secretPhrase' }
app.post("/api/reveal-wallet-data", (req, res) => {
  const { walletId, field } = req.body;
  
  if (!walletId || !field) {
    return res.status(400).json({ error: "Wallet ID and field are required." });
  }
  
  const wallet = generatedWallets.find(w => w.walletId === walletId);
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found." });
  }
  
  let revealedData;
  if (field === 'privateKey') {
    revealedData = wallet.actualPrivateKey;
  } else if (field === 'secretPhrase') {
    revealedData = wallet.actualSecretPhrase;
  } else {
    return res.status(400).json({ error: "Invalid field. Use 'privateKey' or 'secretPhrase'." });
  }
  
  return res.json({ 
    walletId, 
    field, 
    data: revealedData 
  });
});

app.listen(PORT, () => {
  console.log(`Backend 1 is running on http://localhost:${PORT}`);
});