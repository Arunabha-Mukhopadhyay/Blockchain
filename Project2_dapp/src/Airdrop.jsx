import {useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';


export function Airdrop() {

  const[balance, setBalance] = useState(0);
  const wallet = useWallet();
  const {connection} = useConnection();

  async function sendAirdrop() {
    try{
      if (!wallet.publicKey) return alert("Connect wallet first!");

      console.log("RPC endpoint:", connection.rpcEndpoint);

      const amount = parseFloat(document.getElementById("amount").value);
      if (!amount || amount <= 0) return alert("Enter a valid amount");

      await connection.requestAirdrop(wallet.publicKey,amount * 1000000000);
      alert(`Airdrop ${amount} Successful`);
    } catch(err){
      console.error(err);
      alert("Airdrop Failed");
    }
  }

  async function getBalance(){
    try{
      if(!wallet.publicKey){
        alert("Wallet not connected");
        setBalance(0);
        return;
      }
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }catch(err){
      console.log(err.message);
      alert("Failed to get balance");
    }
  }

  return <div>
      <div>
        <h1>Wallet Balance: {balance.toFixed(4)} SOL</h1>
        <button onClick={getBalance}>Refresh Balance</button>
      </div>
      <input id="amount" type="text" placeholder="Amount"></input>
      <button onClick={sendAirdrop}>Request Airdrop</button>
    </div>
}


