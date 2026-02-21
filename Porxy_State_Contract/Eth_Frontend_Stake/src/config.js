import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, createConfig, WagmiProvider, useConnect, useAccount, useDisconnect, useBalance, useSendTransaction, useReadContract } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains:[sepolia],
  connectors:[
    injected(),
    // metaMask(),
  ],
  transports:{
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/HXvqopb56JiSzfHc9WqgC')
    }
})