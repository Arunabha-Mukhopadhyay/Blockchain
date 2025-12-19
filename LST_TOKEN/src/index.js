import 'dotenv/config';
import express from "express";
import { mintTokens, burnTokens, sendNativeTokens } from './mintToken.js';

const app = express();
const PORT = process.env.PORT || 3000;

const HELIUS_RESPONSE = (
  { "nativeTransfers": [{ 
    "amount": 1000000000, 
    "fromUserAccount": "47wbLn4UXKi6yJeGkAvGTeCdAcQLcP4GUyNEnn1RQH5S", 
    "toUserAccount": "BoQmnhN4yS9SgDM7P5WFS8BRFcop2taybtPhyoxMi9Z7" 
    //ata address cli = "FfXtZxTtiu3aquA1gAz6UYfeDQUxHz5DjGc7HVKhg5KU"
  }],
   "signature": "StusbTbjtKEZGSoSuriYTDPUKu4etzQoftuxSKybBVotoZibFs9gxGEVEv331zAvT6MhCUeqyCX4LJYQBxU87ER"
  }
)

const MYWALLET = "BoQmnhN4yS9SgDM7P5WFS8BRFcop2taybtPhyoxMi9Z7";

app.post('/helius',async (req,res)=>{

  const fromAccount = HELIUS_RESPONSE.nativeTransfers.find(x=>x.toUserAccount === MYWALLET )

  if(!fromAccount){
    res.json({
      message:"processed",
    })
    return
  }

  const fromAddress = fromAccount.fromUserAccount;
  const toAddress = MYWALLET;
  const amount = fromAccount.amount;
  const type = "received_native_sol";


  if (type === "received_native_sol") {
    await mintTokens(fromAddress, amount);
  } else {
    await burnTokens(fromAddress, toAddress, amount);
    await sendNativeTokens(fromAddress, toAddress, amount);
  }

  res.send('Transaction successful');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})