import { WagmiProvider, useAccount } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {wagmiConfig} from './config/wagmi.config.js'
import WalletConnect from "./components/WalletConnector";
import Chat from "./components/Chat";
const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();

  return (
    <div className="container">
      <h1>Wallet Agent setup</h1>
      <WalletConnect />
      {isConnected && <Chat />}
    </div>
  );
}


function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
     <QueryClientProvider client={queryClient}>
      <AppContent />
     </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
