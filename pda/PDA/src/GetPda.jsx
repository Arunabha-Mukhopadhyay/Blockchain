import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useState } from "react";

function GetPda() {
    const [userPK, setUserPK] = useState("");
    const [mintPK, setMintPK] = useState("");

    const { publicKey } = useWallet();

    const handleGetPda = () => {
        try {
            if (!publicKey) {
              console.log("Connect wallet first!");
              return;
            }
            const userPublicKey = publicKey;
            // const userPublicKey = new PublicKey(userPK);
            const mintPublicKey = new PublicKey(mintPK);

            const [pda, bump] = PublicKey.findProgramAddressSync(
                [
                    userPublicKey.toBuffer(),
                    TOKEN_PROGRAM_ID.toBuffer(),
                    mintPublicKey.toBuffer()
                ],
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            console.log("PDA:", pda.toBase58());
            console.log("Bump:", bump);
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    return (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
            <h2>Get PDA</h2>

            {/* <input
                type="text"
                placeholder="User address"
                value={userPK}
                onChange={(e) => setUserPK(e.target.value)}
            />
            <br /> */}

            <input
                type="text"
                placeholder="Mint address"
                value={mintPK}
                onChange={(e) => setMintPK(e.target.value)}
            />
            <br />

            <button onClick={handleGetPda}>Get PDA</button>
        </div>
    );
}

export default GetPda;
