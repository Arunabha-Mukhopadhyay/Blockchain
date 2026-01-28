import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { lineaSepolia, sepolia } from "wagmi/chains";
import { createPublicClient } from "viem";

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
  },
});
