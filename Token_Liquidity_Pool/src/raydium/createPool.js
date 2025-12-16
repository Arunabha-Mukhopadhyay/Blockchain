import {
  Liquidity,
  Token,
  TxVersion,
} from "@raydium-io/raydium-sdk";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function createRaydiumPool({
  connection,
  wallet,
  baseMint,
  quoteMint,
  baseDecimals,
  quoteDecimals,
  baseAmount,
  quoteAmount,
}) {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const { innerTransactions } =
    await Liquidity.makeCreatePoolV4InstructionSimple({
      connection,
      wallet: {
        publicKey: wallet.publicKey,
        payer: wallet.publicKey,
      },
      baseMint,
      quoteMint,
      baseDecimals,
      quoteDecimals,
      baseAmount,
      quoteAmount,
      startTime: Math.floor(Date.now() / 1000),
      owner: wallet.publicKey,
      txVersion: TxVersion.V0,
    });

  return innerTransactions;
}
