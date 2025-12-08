import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import React from 'react';


function SignMessage() {

  const {publicKey, signMessage} = useWallet();

  async function onClick() {
    if(!publicKey){
      alert("Wallet not connected");
      return;
    }
    if(!signMessage){
      alert("Wallet does not support message signing");
      return;
    }

    const message = document.getElementById('message').value;
    const encodeMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodeMessage);

    if(!ed25519.verify(signature, encodeMessage, publicKey.toBytes())){
      alert("Signature verification failed");
      return;
    }
    
    alert(`Message signed successfully. Signature: ${bs58.encode(signature)}`);
  }

  return (
    <div>
      <input id='message' type="text" placeholder='Message' />
      <button onClick={onClick}>
        Sign Message
      </button>
    </div>
  )
}

export default SignMessage