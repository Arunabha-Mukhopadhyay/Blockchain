import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createPublicClient, http, formatEther, getAddress } from "viem";
import { lineaSepolia } from "viem/chains";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const publicClient = createPublicClient({
  chain: lineaSepolia,
  transport: http(),
});

const OLLAMA_URL = "http://localhost:11434/api/generate";

// ─────────────────────────────
app.post("/chat", async (req, res) => {
  const { message, address } = req.body;

  // Balance intent
  if (message.toLowerCase().includes("balance")) {
    const balance = await publicClient.getBalance({
      address: getAddress(address),
    });

    return res.json({
      text: `Your wallet balance is ${formatEther(balance)} ETH.`,
    });
  }

  // Send intent
  if (message.toLowerCase().includes("send")) {
    return res.json({
      text: "I prepared a transaction. Please confirm in MetaMask.",
    });
  }

  // ─── Ollama AI ───
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt: message,
      stream: false,
    }),
  });

  const data = await response.json();

  res.json({ text: data.response });
});

app.listen(3001, () =>
  console.log("AI server (Ollama) running on http://localhost:3001")
);
