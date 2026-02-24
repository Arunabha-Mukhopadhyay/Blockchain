import { JsonRpcProvider, formatEther } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const block = "0x9D8E8C"
const RPC = new JsonRpcProvider(process.env.RPC_PROVIDER)

const getNativeTransfers = async () => {

  const blockData = await RPC.getBlock(block)
  console.log("Total TXs:", blockData.transactions.length)

  const txs = await Promise.all(
    blockData.transactions.map(hash => RPC.getTransaction(hash))
  )

  //console.log(txs)

  const nativeTransfers = txs.filter(tx => tx && tx.value > 0n).map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: formatEther(tx.value),
      blockNumber: tx.blockNumber
    }))
  console.log(nativeTransfers)
}

getNativeTransfers()
