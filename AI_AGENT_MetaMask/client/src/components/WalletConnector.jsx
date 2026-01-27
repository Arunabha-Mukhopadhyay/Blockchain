import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export default function WalletConnect() {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <button className="btn" onClick={() => disconnect()}>
          Disconnect {address}
        </button>
      ) : (
        <button className="btn" onClick={() => connect({ connector: metaMask() })}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
