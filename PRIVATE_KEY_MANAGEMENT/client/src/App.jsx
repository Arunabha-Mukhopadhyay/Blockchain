import {Transaction,PublicKey,LAMPORTS_PER_SOL, Connection,SystemProgram} from '@solana/web3.js'
import axios from 'axios'

function App() {
  const connection = new Connection('https://api.devnet.solana.com');
  const frompublicKey = new PublicKey("BoQmnhN4yS9SgDM7P5WFS8BRFcop2taybtPhyoxMi9Z7");
  const toPublicKey = new PublicKey("EwwpLgVrBiQ2xUoLYTiMohBV2Ut3CoJky6jzKtbMxPHZ");

  async function sendSol(){
    const ix = SystemProgram.transfer({
      fromPubkey: frompublicKey,
      toPubkey: toPublicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL
    })

    const tx = new Transaction().add(ix);
    const BlockHash = await connection.getLatestBlockhash();
    tx.recentBlockhash = BlockHash.blockhash;
    tx.feePayer = frompublicKey;

    const serializetx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    axios.post('http://localhost:3000/api/v1/txn/sign',{
      message: serializetx,
      retry: false
    })

  }
  
  return <div>
    <input type="text" placeholder="Amount"></input>
    <input type="text" placeholder="Address"></input>
    <button onClick={sendSol}>Submit</button>
  </div>
}

export default App
