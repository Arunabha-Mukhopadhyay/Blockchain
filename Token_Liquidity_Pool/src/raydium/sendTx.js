import { Transaction } from "@solana/web3.js";

export async function sendRaydiumTx({
  connection,
  wallet,
  innerTransactions,
}) {
  const tx = new Transaction();

  innerTransactions.forEach(ix => {
    tx.add(...ix.instructions);
  });

  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const sig = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(sig, "confirmed");

  return sig;
}
