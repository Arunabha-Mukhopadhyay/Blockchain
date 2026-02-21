import { useState } from 'react'
import { config } from './config.js'
import './App.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Appbar from './Appbar.jsx'
import Dashboard from './Dashboard.jsx'

function App() {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Appbar />
        <Dashboard />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
