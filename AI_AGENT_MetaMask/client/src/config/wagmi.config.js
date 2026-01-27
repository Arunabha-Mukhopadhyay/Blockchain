import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { lineaSepolia } from "wagmi/chains";
import { createPublicClient } from "viem";

export const publicClient = createPublicClient({
  chain: lineaSepolia,
  transport: http(),
});

export const wagmiConfig = createConfig({
  chains: [lineaSepolia],
  connectors: [metaMask()],
  transports: {
    [lineaSepolia.id]: http(),
  },
});
