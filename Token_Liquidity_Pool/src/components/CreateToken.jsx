import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import {TOKEN_PROGRAM_ID,MINT_SIZE, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction} from '@solana/spl-token'
import React from 'react'

export function TokenLaunchPad({onTokenCreate}) {

  const {connection} = useConnection();
  const wallet = useWallet();

  async function createToken(){
    const mintKeyPair = Keypair.generate();
    console.log("Mint Keypair", mintKeyPair);
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubKey : wallet.publicKey,
        newAccountPubkey: mintKeyPair.publicKey,
        lamports,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(mintKeyPair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
    )

    transaction.feePayer = wallet.publicKey;
    let latestBlock = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlock.blockhash;

    transaction.partialSign(mintKeyPair);
    await wallet.sendTransaction(transaction, connection);
    console.log("mint account created successfully");

    onTokenCreate(mintKeyPair.publicKey)
}
  return <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' placeholder='Name'></input> <br />
        <input className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}

