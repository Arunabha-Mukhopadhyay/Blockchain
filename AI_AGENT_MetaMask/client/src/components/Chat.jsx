import React from 'react'
import { useState } from 'react'
import { useAccount,useSendTransaction } from 'wagmi'
import { parseEther } from "viem";


function Chat() {
  const {address} = useAccount();
  const {sendTransaction} = useSendTransaction();

  const[messages,setMessages] = useState([
    {
      role:"ai",
      content:`You have connected your wallet successfully. Your wallet address is ${address}`
    }
  ]);
  const[input,setInput] = useState("");

  async function sendMessage(){
    if (!input) return;
    const userMessage = {role: "user", content: input};
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const ROUTE = import.meta.env.VITE_ROUTE || "http://localhost:3001";

    const response = await fetch(`${ROUTE}/chat`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        address,
      }), 
    })

    if (!response.ok) {
      throw new Error("Server error");
  }

    const data = await response.json();
    setMessages((m) => [...m, { role: "ai", content: data.text }]);

    if (data.tx) {
      sendTransaction({
        to: data.tx.to,
        value: parseEther(data.tx.amount),
      });
    }
  }


  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <b>{m.role === "user" ? "User" : "AI"}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat