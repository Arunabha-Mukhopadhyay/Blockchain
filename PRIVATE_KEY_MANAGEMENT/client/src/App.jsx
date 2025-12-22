import {Transaction,PublicKey,LAMPORTS_PER_SOL, Connection,SystemProgram} from '@solana/web3.js'
import axios from 'axios'

function App() {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const frompublicKey = new PublicKey();
  const toPublicKey = new PublicKey();

  async function sendSol(){
    const ix = SystemProgram.transfer({
      fromPubkey: frompublicKey,
      toPubkey: toPublicKey,
      lamports: 1000 * LAMPORTS_PER_SOL
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
