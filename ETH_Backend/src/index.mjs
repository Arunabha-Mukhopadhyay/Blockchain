import { JsonRpcProvider,id } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

async function pollBlocks(blockNumber) {
  const logs = await provider.getLogs({
    address:"0xdac17f958d2ee523a2206206994597c13d831ec7",
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [
      id("Transfer(address,address,uint256)")
    ]
  })

  console.log('logs:', logs)
}

pollBlocks(24287994);

// can add it to the database but behing 32 blocks if gets forked near future:
// if there is a centralised exchange like coinbase: