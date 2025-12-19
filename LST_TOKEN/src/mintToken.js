import 'dotenv/config';
import {getOrCreateAssociatedTokenAccount, mintTo} from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TOKEN_MINT_ADDRESS } from './address.js'
import bs58 from 'bs58'

const connection = new Connection('https://api.devnet.solana.com');

export function base58ToKeypair(base58PrivateKey) {
  if (!base58PrivateKey || typeof base58PrivateKey !== "string") {
    throw new Error("PRIVATE_KEY is missing or not a string");
  }

  const decoded = bs58.decode(base58PrivateKey.trim());
  return Keypair.fromSecretKey(decoded);
}
const payer = base58ToKeypair(process.env.PRIVATE_KEY);
// console.log(process.env.PUBLIC_KEY );
// console.log(payer)

export const mintTokens = async (fromAddress, amount) => {

  const recipientATA = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    TOKEN_MINT_ADDRESS,
    new PublicKey(fromAddress)
  )

  await mintTo(
    connection,
    payer,
    TOKEN_MINT_ADDRESS,
    recipientATA.address,
    payer,
    amount
  )

  console.log(`Minted ${amount} tokens to ${recipientATA.address.toString()}`);
};


export const burnTokens = async (fromAddress, toAddress, amount) => {

};


export const sendNativeTokens = async (fromAddress, toAddress, amount) => {

};