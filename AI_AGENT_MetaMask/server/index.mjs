import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { createPublicClient, http, formatEther, getAddress } from "viem";
import { lineaSepolia ,sepolia} from "viem/chains";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const OLLAMA_URL = "http://localhost:11434/api/generate";

app.post("/chat", async (req, res) => {
  try {
    const { message, address } = req.body;

    if (!message) {
      return res.status(400).json({ text: "No message provided" });
    }

    if (message.toLowerCase().includes("balance")) {
      const balance = await publicClient.getBalance({
        address: getAddress(address),
      });

      return res.json({
        text: `Your wallet balance is ${formatEther(balance)} ETH.`,
      });
    }

    if (message.toLowerCase().includes("send")) {
      const match = message.match(
        /send\s+([\d.]+)\s+\w+\s+to\s+(0x[a-fA-F0-9]{40})/
      );

      if (!match) {
        return res.json({ text: "Invalid send format." });
      }

      const amount = match[1];
      const to = match[2];

      return res.json({
        text: `Sending ${amount} ETH to ${to}. Please confirm in MetaMask.`,
        tx: {
          to,
          amount,
        },
      });
    }


    // Ollama AI
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();

    return res.json({ text: data.response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "AI server error" });
  }
});

app.listen(3001, () =>
  console.log("AI server (Ollama) running on http://localhost:3001")
);
