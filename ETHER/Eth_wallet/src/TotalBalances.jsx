import React from 'react'
import { writeContract } from 'viem/actions'
import {useReadContract, useWriteContract} from 'wagmi'

function TotalBalances() {
  const {data:ethBalance,isLoading,error} = useReadContract({
    address:'0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107',
    abi:[
      {
        "constant":true,
        "inputs":[{"name":"who","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
      }
    ],
    functionName:'balanceOf',
  }) 

  if(isLoading) return <div>Loading...</div>
  return (
    <div>
      total supply: {JSON.stringify(ethBalance?.ethBalance.toString())}
    </div>

  )
}

export default TotalBalances


// also a approve a write contract function :
// const {data, writeContract} = useWriteContract();

// async function submitApprove(e){
//   e.preventDefault();
//   writeContract({
//   address:'0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107',
//   abi:[
//     {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
//   ],
//   functionName:'approve',
//   args:['0x0f1D1ca5b5Ac85DcBB0319bd8c083BFa0691F107', BigInt(1000000)],
// })
// }