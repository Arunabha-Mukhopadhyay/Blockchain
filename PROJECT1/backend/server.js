import express from "express";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import pkg from "@solana/web3.js";
const { Keypair, Connection, PublicKey } = pkg;
import { derivePath } from "ed25519-hd-key";
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let generatedWallets = [];

const solanaConnection = new Connection("https://api.mainnet-beta.solana.com");
const ethereumProvider = new ethers.JsonRpcProvider("https://cloudflare-eth.com");

const maskData = (data) => {
  return "•".repeat(Math.min(data.length, 20)) + (data.length > 20 ? "..." : "");
};

// solana wallet:
const generateSolanaWallet = (seed, index) => {
  const path = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Buffer.from(keypair.secretKey).toString("hex");
  
  return {
    walletName: `Solana Wallet ${index + 1}`,
    publicKey,
    privateKey: maskData(privateKey),
    secretPhrase: maskData(seed.toString("hex")),
    walletId: `solana-${Date.now()}-${index}`,
    type: "solana",
    actualPrivateKey: privateKey,
    actualSecretPhrase: seed.toString("hex")
  };
};

//ethreum wallet:
const generateEthereumWallet = (mnemonic, index) => {
  const path = `m/44'/60'/0'/0/${index}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);
  
  return {
    walletName: `Ethereum Wallet ${index + 1}`,
    publicKey: wallet.address,
    privateKey: maskData(wallet.privateKey),
    secretPhrase: maskData(mnemonic),
    walletId: `ethereum-${Date.now()}-${index}`,
    type: "ethereum",
    actualPrivateKey: wallet.privateKey,
    actualSecretPhrase: mnemonic
  };
};

app.post("/api/generate-wallets", (req, res) => {
  const { mnemonic, count, type = "both" } = req.body;
  if (!mnemonic || !count || count < 1) {
    return res.status(400).json({ error: "Mnemonic and count are required." });
  }
  
  try {
    const seed = mnemonicToSeedSync(mnemonic);
    const wallets = [];
    
    if (type === "solana" || type === "both") {
      for (let i = 0; i < count; i++) {
        wallets.push(generateSolanaWallet(seed, i));
      }
    }
    
    if (type === "ethereum" || type === "both") {
      for (let i = 0; i < count; i++) {
        wallets.push(generateEthereumWallet(mnemonic, i));
      }
    }
    
    generatedWallets = wallets.map(w => ({
      ...w,
      actualPrivateKey: w.actualPrivateKey,
      actualSecretPhrase: w.actualSecretPhrase
    }));
    
    return res.json({ wallets });
  } catch (err) {
    console.error("Wallet generation error:", err);
    return res.status(500).json({ error: "Failed to generate wallets." });
  }
});



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


app.post("/api/check-address", async (req, res) => {
  const { address, type } = req.body;
  
  console.log("Check address request:", { address, type });
  
  if (!address || !type) {
    console.log("Missing required fields:", { address: !!address, type: !!type });
    return res.status(400).json({ error: "Address and type are required." });
  }
  
  try {
    let accountInfo = {};
    
    if (type === "solana") {
      try {
        const pubKey = new PublicKey(address);
        const balance = await solanaConnection.getBalance(pubKey);
        const accountInfoData = await solanaConnection.getAccountInfo(pubKey);
        
        accountInfo = {
          address: address,
          balance: balance / 1e9, 
          balanceRaw: balance,
          executable: accountInfoData?.executable || false,
          owner: accountInfoData?.owner?.toBase58() || null,
          lamports: balance,
          data: accountInfoData?.data ? Buffer.from(accountInfoData.data).toString('hex') : null
        };
      } catch (err) {
        return res.status(400).json({ error: "Invalid Solana address." });
      }
    } else if (type === "ethereum") {
      try {
        // Validate Ethereum address format
        if (!ethers.isAddress(address)) {
          return res.status(400).json({ error: "Invalid Ethereum address format." });
        }
        
        const balance = await ethereumProvider.getBalance(address);
        const transactionCount = await ethereumProvider.getTransactionCount(address);
        
        accountInfo = {
          address: address,
          balance: ethers.formatEther(balance),
          balanceRaw: balance.toString(),
          transactionCount: transactionCount,
          isContract: false 
        };
      } catch (err) {
        console.error("Ethereum address check error:", err);
        return res.status(400).json({ error: "Failed to fetch Ethereum address data." });
      }
    } else {
      return res.status(400).json({ error: "Invalid type. Use 'solana' or 'ethereum'." });
    }
    
    return res.json({ accountInfo });
  } catch (err) {
    console.error("Address check error:", err);
    return res.status(500).json({ error: "Failed to check address." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend 1 is running on http://localhost:${PORT}`);
});