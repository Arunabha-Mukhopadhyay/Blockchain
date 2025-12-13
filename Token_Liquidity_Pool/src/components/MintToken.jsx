import { createAssociatedTokenAccountInstruction, createMint, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js';
import React from 'react'

export function MintToken({mintAddress,onDone}) {

  const wallet = useWallet();
  const {connection} = useConnection();

  async function mintToken(){
    const associatedToken = getAssociatedTokenAddress(
      mintAddress,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintAddress,
        TOKEN_PROGRAM_ID
      )
    )

    await wallet.sendTransaction(transaction,connection);

    const mintTransaction = new Transaction().add(
      createMintToInstruction(mintAddress, associatedToken, wallet.publicKey, 1000000000, [], TOKEN_PROGRAM_ID)
    )

    await wallet.sendTransaction(mintTransaction, connection);
    console.log("Minting done for token " + mintAddress.toBase58());
    onDone();
  }

  return <div>
    <input type="text"></input>
    <button onClick={mint}>Mint tokens</button>
  </div>
}

