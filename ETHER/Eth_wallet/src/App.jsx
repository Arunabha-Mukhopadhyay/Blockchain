import React from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

async function getBalance() {
  const balance = await client.getBalance({
    address: "0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107",
  });

  // MUST return something so React Query can store it
  return balance.toString();
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Ethereum Wallet</h1>
        <Todos />
      </div>
    </QueryClientProvider>
  );
}

function Todos() {
  const query = useQuery({
    queryKey: ["balance"],
    queryFn: getBalance,
    refetchInterval: 10 * 1000, // 10 seconds
  });

  return (
    <div>
      <h3>Balance:</h3>
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Error fetching balance</p>}
      {query.data && <p>{query.data} wei</p>}
    </div>
  );
}

export default App;
