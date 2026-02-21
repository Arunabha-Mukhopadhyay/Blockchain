import { useWriteContract, useReadContract } from "wagmi";
import {abi} from './abi.js'
import { useAccount } from "wagmi";

function Dashboard() {
  const{data:hash , writeContract} = useWriteContract();

  const CONTRACT_ADDRESS = "0x3D75c067AC826983f445B5Ed06DD63d4C9166E73";


  return <div className="h-screen w-screen flex justify-center items-center">
    <div>
      <button className='mx-2 border rounded p-2 text-2xl'  onClick={async () => {
  try {
    const hash = await writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "Stake",
      args: [BigInt(1e18)],
      value: BigInt(1e18),
    });

    console.log("TX Hash:", hash);
  } catch (err) {
    console.error("ERROR:", err);
  }
}}
>
        Stake 1 ETH
      </button>
      <div>
        <ShowStake />
      </div>
    </div>
  </div>
}


function ShowStake() {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: '0x3D75c067AC826983f445B5Ed06DD63d4C9166E73',
    abi,
    functionName: 'stake',
    args: [address],
  });

  return (
    <div>
      You have staked {data ? data.toString() : "0"} wei
    </div>
  );
}

export default Dashboard