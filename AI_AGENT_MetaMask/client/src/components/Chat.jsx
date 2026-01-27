import React from 'react'
import { useState } from 'react'
import { useAccount, useTransaction } from 'wagmi'

function Chat() {
  const {address} = useAccount();
  const {sendTransaction} = useTransaction();

  const[messages,setMessages] = useState([
    {
      role:"AI",
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

    const response = await fetch("",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: input,
        address,
      }), 
    })

    const data = await response.json();
    setMessages((m) => [...m, { role: "ai", content: data.text }]);

    // If tx :
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