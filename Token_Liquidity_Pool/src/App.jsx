import React, { useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';
import {TokenLaunchPad} from './components/CreateToken'
import { MintToken } from './components/MintToken';


function App() {

  const [token, setToken] = useState(null);
  const [mintDone, setMintDone] = useState(false);


  return (

    <ConnectionProvider endpoint={`https://api.devnet.solana.com`}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />

          <TokenLaunchPad onTokenCreate={(tokenMint) => {
              setToken(tokenMint);
            }} />
          {token && token.toBase58()}
          {token && <MintToken onDone={() => setMintDone(true)} mintAddress={token} />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;


//https://imgs.search.brave.com/JolhAcY1CESBQr-AAgnhfnmyNRhBFeA7neAJphtfcL4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bmluaXNiZWF1dHku/ZnIvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMTEvVG91dC1z/YXZvaXItc3VyLU1v/b24tS25pZ2h0LW9y/aWdpbmVzLXBvdXZv/aXJzLWV0LXNlY3Jl/dHMtZHUtcGVyc29u/bmFnZS1tYXJ2ZWwt/MTAyNHg2ODMucG5n