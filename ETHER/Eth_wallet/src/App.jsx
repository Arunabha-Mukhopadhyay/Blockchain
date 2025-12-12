import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, createConfig, WagmiProvider, useConnect, useAccount, useDisconnect, useBalance, useSendTransaction } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const queryClient = new QueryClient();

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    // walletConnect({ projectId }),
    // metaMask(),
    // safe(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
})


function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector />
        <EthSend />
        <Address />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Address() {
  const {address} = useAccount()
  const {disconnect} = useDisconnect();

  const {balance} = useBalance({
    address: address,
  })

  return (
    <>
      <div>Your address: {address}</div>
      <div>Your balance: {balance?.data?.formatted} {balance?.symbol}</div>
      <button onClick={()=>disconnect()}>Disconnected</button>
    </>
  )
  
}

function WalletConnector() {
  const {connectors,connect} = useConnect()

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ))
}

function EthSend() {

  const {data:hash,sendTransaction} = useSendTransaction();

  function sendETH(){
    sendTransaction({
      to: document.getElementById("torec")?.value,
      value: "100000000000000000"
    })
  }

  return <div>
    <input id='torec' type="text" placeholder='address..' />
    <button onClick={sendETH}>send ETH</button>
    {hash && <div>Transaction Hash: {hash}</div>}
  </div>
}


export default App

















// import React from "react";
// import { createPublicClient, http } from "viem";
// import { mainnet } from "viem/chains";
// import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// const client = createPublicClient({
//   chain: mainnet,
//   transport: http(),
// });

// async function getBalance() {
//   const balance = await client.getBalance({
//     address: "0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107",
//   });

//   // MUST return something so React Query can store it
//   return balance.toString();
// }

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <div className="App">
//         <h1>Ethereum Wallet</h1>
//         <Todos />
//       </div>
//     </QueryClientProvider>
//   );
// }

// function Todos() {
//   const query = useQuery({
//     queryKey: ["balance"],
//     queryFn: getBalance,
//     refetchInterval: 10 * 1000, // 10 seconds
//   });

//   return (
//     <div>
//       <h3>Balance:</h3>
//       {query.isLoading && <p>Loading...</p>}
//       {query.isError && <p>Error fetching balance</p>}
//       {query.data && <p>{query.data} wei</p>}
//     </div>
//   );
// }

// export default App;
