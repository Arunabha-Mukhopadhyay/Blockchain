import * as bip39 from "bip39";
import { HDNodeWallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();
const mnemonic = process.env.MASTER_MNEMONIC;
const seed = bip39.mnemonicToSeedSync(mnemonic);

export const generateDepositAddress = (index)=>{
  const hdnode = HDNodeWallet.fromSeed(seed);
  const child = hdnode.derivePath(`m/44'/60'/${index}'/0`);
  console.log(child.privateKey)
  console.log(child.address)
  return {
    address:child.address,
    index,
  }
};