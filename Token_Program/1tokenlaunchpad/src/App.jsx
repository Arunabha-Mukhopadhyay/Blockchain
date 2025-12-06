import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { TokenLaunchpad } from './components/TokenLaunchpad';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';


function App() {
  return (
    <div style={{width: "100vw"}}>
      <ConnectionProvider endpoint={`https://api.devnet.solana.com`}>
        <WalletProvider wallets={[]} autoconnect>
          <WalletModalProvider>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 20
              }}>
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
              <TokenLaunchpad />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App