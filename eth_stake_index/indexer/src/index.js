import { JsonRpcProvider } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const block = "0x9D8E8C"

const RPC = new JsonRpcProvider(process.env.RPC_PROVIDER)

const getlatestBlock = async () => {
  const interestedblock = ['0x7a4a0c53e3033b78982a9f640517e826794c010f34aa2a537d5631e1bafbb1be', '0xca92b500caa5f3b3342240e6341988956c3c76dcf5d5b7f2f40c24d5e31fe101', '0x7656df9463633c92f86d5b852608e47540beaf0c6826aa8ad109da3468390baa']

  const transaction = await RPC.getBlock(block);
  console.log(transaction.transactions.length)

  const interestedTransactions = transaction.filter(tx =>
    tx.to && interestedAddress.includes(tx.to.toLowerCase())
  );

  const txHash = transaction.transactionHash

  const fullTxns = await Promise.all(interestedTransactions.map(async ({ txHash }) => {
    const txn = await RPC.getTransaction(txHash);
    return txn;
  }))

  console.log(fullTxns)

  // const transaction = await RPC.getTransactionReceipt({
  //   fromBlock: block,
  //   toBlock: block,
  //   contractAddresses: interestedblock,
  //   excludeZeroValue: true,
  //   maxCount: 1000,
  // })

  

  const txReceipt = await RPC.getTransactionReceipt(txHash)

  // for (const tx of transaction){
  //   const txHash = tx.transactionHash
  //   const txReceipt = await RPC.getTransactionReceipt(txHash)
  //   console.log(txReceipt)
  // }



  //console.log(txReceipt)
}

getlatestBlock()