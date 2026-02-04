import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createPublicClient, http, formatEther, getAddress } from "viem";
import { sepolia } from "viem/chains";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 3001;
const GROK_API_KEY = process.env.GROK_API;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/HXvqopb56JiSzfHc9WqgC'),
});


app.get("/", (req, res) => {
  res.send("AI Wallet Agent API is running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message, address } = req.body;

    if (!message) {
      return res.status(400).json({ text: "No message provided" });
    }

    /* ------------------ WALLET COMMANDS ------------------ */

    if (message.toLowerCase().includes("balance")) {
      if (!address) {
        return res.json({ text: "Wallet not connected." });
      }

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
        return res.json({ text: "Invalid send format. Example: send 0.01 ETH to 0x..." });
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

    /* ------------------ GROK AI ------------------ */

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content:
              "You are an AI crypto wallet assistant. Help users understand blockchain actions clearly and safely.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Grok API error:", errText);
      return res.status(500).json({ text: "AI service error" });
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    return res.json({ text: aiReply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`AI server (Grok) running on http://localhost:${PORT}`);
});
