import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createRaydiumPool } from "../raydium/createPool";
import { sendRaydiumTx } from "../raydium/sendTx";
import { WSOL } from "../raydium/constants";

export function CpPool({ mintAddress }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  async function createPool() {
    const innerTxs = await createRaydiumPool({
      connection,
      wallet,
      baseMint: mintAddress,
      quoteMint: WSOL,
      baseDecimals: 9,
      quoteDecimals: 9,
      baseAmount: 1_000_000_000,
      quoteAmount: 1_000_000_000,
    });

    const sig = await sendRaydiumTx({
      connection,
      wallet,
      innerTransactions: innerTxs,
    });

    console.log("Pool created:", sig);
  }

  return (
    <div>
      <h3>Raydium CP Pool</h3>
      <button onClick={createPool}>
        Create Pool
      </button>
    </div>
  );
}
