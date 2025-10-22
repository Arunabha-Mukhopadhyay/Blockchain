import { useConnection, useWallet } from '@solana/wallet-adapter-react'


export function Airdrop() {
  const wallet = useWallet();
  const {connection} = useConnection();

  async function sendAirdrop() {
    const amount = document.getElementById("amount").value;
    await connection.requestAirdrop(wallet.publicKey,amount * 1000000000)
    alert("Airdrop Successful");
  }

  return <div>
      <input id="amount" type="text" placeholder="Amount"></input>
      <button onClick={sendAirdrop}>Request Airdrop</button>
    </div>
}


