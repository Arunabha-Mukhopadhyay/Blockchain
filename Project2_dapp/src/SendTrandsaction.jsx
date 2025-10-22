import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL,PublicKey,SystemProgram,Transaction } from '@solana/web3.js';

export function SendTransaction() {
  const wallet = useWallet();
  const {connection} = useConnection();
  
  async function sendTokens(){
    if(!wallet.publicKey){
      alert("Wallet not connected");
      return;
    }
    
    const reciptAdd = document.getElementById("reciptAdd").value.trim();
    const amount = document.getElementById("amount").value;
    
    if (!reciptAdd || isNaN(amount)) {
      alert("Invalid address or amount");
      return;
    }

    const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(reciptAdd),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

    await wallet.sendTransaction(transaction,connection);
    alert(`ampount ${amount} SOL sent to ${reciptAdd}`);
  }


  return <div>
      <input id="reciptAdd" type="text" placeholder="Recipient Address"></input>
      <input id="amount" type="text" placeholder="Amount"></input>
      <button onClick={sendTokens}>Send</button>
    </div>
}
