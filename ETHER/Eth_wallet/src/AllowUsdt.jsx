import { useWriteContract } from "wagmi";

function AllowUsdt() {
const { data, writeContract, isPending, error } = useWriteContract();

  async function allowUsdt(){
    await writeContract({
      address : "0x65dD388D90920df649c2740Fb58cAc89b5C23D1c",
      abi : [
        {"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}
      ],
      functionName:"approve",
      args:["0x4405CaC41683a65A4267c4020C965BE8E7AaF5e9",BigInt(10000)]
    });
  }

  return (
    <form onSubmit={allowUsdt}>
      <button type="submit" disabled={isPending}>
        {isPending ? "Approving..." : "Allow USDT"}
      </button>

      {data && <p>Tx Hash: {data}</p>}
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
export default AllowUsdt;