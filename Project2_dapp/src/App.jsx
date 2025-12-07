import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    WalletConnectButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { Airdrop } from './Airdrop';

import '@solana/wallet-adapter-react-ui/styles.css';


import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useState } from 'react'
import './App.css'
import { SendTransaction } from './SendTrandsaction';

function App() {
  const [count, setCount] = useState(0)
  const wallets = [new PhantomWalletAdapter()]; 


  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <WalletMultiButton></WalletMultiButton>
                <WalletDisconnectButton></WalletDisconnectButton>
                  <h1>Solana Faucet</h1>
                  <Airdrop></Airdrop>
                  <h1>send transaction</h1>
                  <SendTransaction></SendTransaction>
              </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
