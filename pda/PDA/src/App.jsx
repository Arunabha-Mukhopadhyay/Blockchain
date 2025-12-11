import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import GetPda from './GetPda';


function App() {

  return (
    <div style={{width: "100vw"}}>
      <ConnectionProvider endpoint={`https://api.devnet.solana.com`}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 20
              }}>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>

            <GetPda />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App
