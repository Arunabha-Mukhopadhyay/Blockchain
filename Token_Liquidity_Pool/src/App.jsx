import React, { useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

import { TokenLaunchPad } from "./components/CreateToken";
import { CpPool } from "./components/CpPool";



export default function App() {
  const endpoint = clusterApiUrl("devnet");

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  const [mint, setMint] = useState(null);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ padding: 20 }}>
            <WalletMultiButton />
            <WalletDisconnectButton />

            <TokenLaunchPad onTokenCreate={setMint} />

            {mint && (
              <p>
                Mint created:
                <br />
                <b>{mint.toBase58()}</b>
              </p>
            )}

            <CpPool/>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}



//https://imgs.search.brave.com/JolhAcY1CESBQr-AAgnhfnmyNRhBFeA7neAJphtfcL4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bmluaXNiZWF1dHku/ZnIvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjUvMTEvVG91dC1z/YXZvaXItc3VyLU1v/b24tS25pZ2h0LW9y/aWdpbmVzLXBvdXZv/aXJzLWV0LXNlY3Jl/dHMtZHUtcGVyc29u/bmFnZS1tYXJ2ZWwt/MTAyNHg2ODMucG5n