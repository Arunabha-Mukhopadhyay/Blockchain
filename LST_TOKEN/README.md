# LST Token - Liquid Staking Token on Solana

A Node.js application for managing Liquid Staking Tokens (LST) on the Solana blockchain. This project provides functionality for minting, managing, and interacting with liquid staking tokens that represent staked SOL.

## Project Structure

```
LST_TOKEN/
├── src/
│   ├── index.js          # Main application entry point
│   ├── mintToken.js      # Token minting logic
│   └── address.js        # Address and account utilities
├── package.json          # Dependencies and scripts
└── README.md
```

## Features

- **Token Minting**: Create and mint liquid staking tokens
- **Solana Integration**: Native Solana blockchain interaction
- **Account Management**: Manage token accounts and wallets
- **Balance Queries**: Check token balances and staking details
- **Transaction Broadcasting**: Submit transactions to Solana network
- **Metadata Management**: Handle SPL token metadata

## Technologies Used

- **Solana Web3.js**: JavaScript SDK for Solana blockchain
- **SPL Token**: Standard Program Library for token operations
- **Node.js**: JavaScript runtime
- **Express.js**: Server framework (optional for API endpoints)
- **dotenv**: Environment variable management
- **bs58**: Base58 encoding for Solana addresses

## Prerequisites

- Node.js 14+ installed
- Solana CLI installed ([Installation Guide](https://docs.solana.com/cli/install-solana-cli-tools))
- Solana wallet with devnet or testnet SOL
- RPC endpoint access (default: Solana devnet)

## Installation & Setup

### Clone and Install Dependencies

```bash
# Navigate to project directory
cd LST_TOKEN

# Install dependencies
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
# Solana Network Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet

# Wallet Configuration
WALLET_PATH=/path/to/wallet.json
PRIVATE_KEY=your_base58_encoded_private_key

# Token Configuration
TOKEN_DECIMALS=9
TOKEN_NAME=Liquid Staking Token
TOKEN_SYMBOL=LST

# Optional: For mainnet operations
MAINNET_RPC=https://api.mainnet-beta.solana.com
```

### Generate Wallet

```bash
# Create a new keypair
solana-keygen new --outfile wallet.json

# Export private key
cat wallet.json
```

## Usage

### Start Development Server

```bash
npm run dev
```

This will run the main application defined in `src/index.js`.

## Core Functions

### Mint Token (mintToken.js)

```javascript
import { mintToken } from './src/mintToken.js'

const config = {
  name: 'Liquid Staking Token',
  symbol: 'LST',
  decimals: 9,
  initialSupply: 1000000, // 1 million tokens
  walletPath: '/path/to/wallet.json',
  rpcUrl: 'https://api.devnet.solana.com'
}

const tokenAddress = await mintToken(config)
console.log('Token created:', tokenAddress)
```

### Initialize Token Mint

```javascript
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { createInitializeMintInstruction } from '@solana/spl-token'

const connection = new Connection(process.env.SOLANA_RPC_URL)
const wallet = loadWalletFromFile(process.env.WALLET_PATH)

// Create mint account
const mint = await createInitializeMintInstruction({
  mint: mintPublicKey,
  decimals: 9,
  owner: wallet.publicKey,
  freezeAuthority: wallet.publicKey
})
```

### Create Token Account

```javascript
import { createAssociatedTokenAccount } from '@solana/spl-token'

const tokenAccount = await createAssociatedTokenAccount(
  connection,
  wallet,
  mintPublicKey,
  wallet.publicKey
)

console.log('Token account created:', tokenAccount.toBase58())
```

### Mint Tokens to Account

```javascript
import { mintTo } from '@solana/spl-token'

const transaction = await mintTo(
  connection,
  wallet,
  mintPublicKey,
  tokenAccountPublicKey,
  wallet.publicKey,
  1000000000 // 1 billion units (1 million tokens with 9 decimals)
)

console.log('Mint transaction:', transaction)
```

### Query Balance

```javascript
import { getAccount } from '@solana/spl-token'

const tokenAccount = await getAccount(connection, tokenAccountPublicKey)
console.log('Token balance:', Number(tokenAccount.amount) / Math.pow(10, 9))
```

## API Endpoints (if using Express)

### POST /mint-token

Create a new LST token.

**Request Body:**
```json
{
  "name": "Liquid Staking Token",
  "symbol": "LST",
  "decimals": 9,
  "initialSupply": 1000000
}
```

**Response:**
```json
{
  "success": true,
  "tokenAddress": "TokenkegQfeZyiNwAJsyFbPVwwQnmRRB337eeWKW4sK",
  "transactionSignature": "3u5..."
}
```

### GET /token-info/:tokenAddress

Get token information.

**Response:**
```json
{
  "name": "Liquid Staking Token",
  "symbol": "LST",
  "decimals": 9,
  "totalSupply": "1000000000000000",
  "owner": "7QJnbBAFnR8ywR7q3ypPUVJ7AqZUzGqyEkZYkdELTtv"
}
```

### GET /balance/:walletAddress/:tokenAddress

Get wallet balance for a specific token.

**Response:**
```json
{
  "balance": 500000,
  "decimals": 9,
  "formattedBalance": "500000.000000000",
  "tokenAddress": "TokenkegQfeZyiNwAJsyFbPVwwQnmRRB337eeWKW4sK"
}
```

## Deployment

### Deploy to Devnet

```bash
# Fund wallet on devnet
solana airdrop 5 --keypair wallet.json --url devnet

# Run minting script
npm run dev
```

### Deploy to Mainnet

⚠️ **Before deploying to mainnet:**
1. Ensure you have real SOL for transactions
2. Test thoroughly on devnet first
3. Consider security implications
4. Implement proper access controls

```bash
# Update .env
SOLANA_NETWORK=mainnet-beta
MAINNET_RPC=https://api.mainnet-beta.solana.com

# Run deployment
npm run dev
```

## Token Metadata

Add metadata to your token for better wallet display:

```javascript
import { createInitializeMetadataPointerInstruction } from '@solana/spl-token'

// Create metadata using Metaplex
const metadata = {
  name: 'Liquid Staking Token',
  symbol: 'LST',
  uri: 'https://example.com/metadata.json', // JSON metadata file
  sellerFeeBasisPoints: 0,
  creators: [{
    address: wallet.publicKey,
    verified: true,
    share: 100
  }]
}
```

## Transaction Examples

### Complete Minting Flow

```javascript
import {
  Connection,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'

async function completeMintingFlow() {
  const connection = new Connection(process.env.SOLANA_RPC_URL)
  const wallet = loadWallet()
  
  // 1. Create mint account
  const mint = Keypair.generate()
  const transaction1 = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: 82,
      lamports: await connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID
    }),
    createInitializeMintInstruction(
      mint.publicKey,
      9, // decimals
      wallet.publicKey, // owner
      wallet.publicKey  // freeze authority
    )
  )
  
  // 2. Create associated token account
  const tokenAccount = await createAssociatedTokenAccount(
    connection,
    wallet,
    mint.publicKey,
    wallet.publicKey
  )
  
  // 3. Mint tokens
  await mintTo(
    connection,
    wallet,
    mint.publicKey,
    tokenAccount,
    wallet.publicKey,
    1000000000 // 1 billion units
  )
  
  return {
    mint: mint.publicKey.toBase58(),
    tokenAccount: tokenAccount.toBase58()
  }
}
```

## Staking Integration

### Stake SOL

```javascript
import { stake } from '@solana/spl-stake-pool'

// Delegate SOL to validator
const stakeTransaction = await stake({
  connection,
  wallet,
  validatorVote: validatorPublicKey,
  amount: 100 * LAMPORTS_PER_SOL
})
```

### Unstake SOL

```javascript
// Unstake and redeem LST for SOL
const unstakeTransaction = await unstake({
  connection,
  wallet,
  lstTokenAccount,
  amount: 100 * LAMPORTS_PER_SOL
})
```

## Account Management

### Create Wallet from Private Key

```javascript
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

const privateKeyString = process.env.PRIVATE_KEY
const secretKey = bs58.decode(privateKeyString)
const wallet = Keypair.fromSecretKey(secretKey)

console.log('Wallet address:', wallet.publicKey.toBase58())
```

### Check Wallet Balance

```javascript
const balance = await connection.getBalance(wallet.publicKey)
console.log('SOL balance:', balance / LAMPORTS_PER_SOL)
```

## Solana CLI Commands

### Check Token Info

```bash
# View token supply
spl-token supply TokenkegQfeZyiNwAJsyFbPVwwQnmRRB337eeWKW4sK --url devnet

# View token accounts
spl-token accounts --owner <wallet-address> --url devnet

# View specific account
spl-token account <token-account-address> --url devnet
```

### Transfer Tokens

```bash
spl-token transfer \
  TokenkegQfeZyiNwAJsyFbPVwwQnmRRB337eeWKW4sK \
  100 \
  <recipient-token-account> \
  --owner <wallet-keypair-file> \
  --url devnet
```

## Testing

### Unit Tests

```bash
# Create test file
npm install --save-dev jest @babel/preset-env

# Run tests
npm test
```

### Integration Tests

```javascript
// Test minting flow
describe('Token Minting', () => {
  it('should mint LST tokens successfully', async () => {
    const result = await mintToken({
      name: 'Test LST',
      symbol: 'TLST',
      decimals: 9,
      initialSupply: 1000
    })
    
    expect(result.tokenAddress).toBeDefined()
    expect(result.transactionSignature).toBeDefined()
  })
})
```

## Troubleshooting

### Common Issues

**Problem**: Insufficient balance for transaction
```bash
# Get devnet SOL
solana airdrop 5 --keypair wallet.json --url devnet
```

**Problem**: RPC endpoint timeout
```env
# Try different RPC endpoint
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**Problem**: Invalid wallet format
```bash
# Re-export wallet
solana-keygen recover --outfile wallet.json
# Follow prompts to recover wallet
```

**Problem**: Token account not found
```javascript
// Create associated token account first
const ata = await createAssociatedTokenAccount(...)
// Then mint to ATA
```

## Gas Optimization

- Batch transactions when possible
- Use devnet for testing to avoid fees
- Monitor rent exemption requirements
- Optimize account sizes

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit private keys** - Use `.env` and `.gitignore`
2. **Secure RPC endpoints** - Use private RPC for production
3. **Validate addresses** - Always check recipient addresses
4. **Rate limiting** - Implement on API endpoints
5. **Use HTTPS** - Always use secure connections
6. **Implement 2FA** - For sensitive operations
7. **Regular audits** - Audit smart contracts and code

## Solana Network Status

- **Devnet**: Free SOL, frequent resets, for testing
- **Testnet**: Occasional resets, for development
- **Mainnet**: Real SOL, production use

Check network status:
```bash
solana cluster-version --url <network-url>
```

## Performance Metrics

- Average mint transaction: ~3-5 seconds
- Token account creation: ~4-6 seconds
- Balance query: < 1 second
- Batch operations: ~5-10 transactions/second

## Future Enhancements

- [ ] Stake pool integration
- [ ] Automated yield distribution
- [ ] Multi-signature approval
- [ ] Advanced analytics dashboard
- [ ] Mobile wallet integration
- [ ] Cross-chain bridges
- [ ] DAO governance
- [ ] Validator selection UI

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly on devnet
5. Submit pull request

## License

This project is licensed under the ISC License.

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Solana Web3.js API](https://solana-labs.github.io/solana-web3.js/)
- [Metaplex Documentation](https://docs.metaplex.com/)
- [Solana Cookbook](https://solanacookbook.com/)

## Support

For questions and issues:
- Check Solana Discord
- Review example code
- Refer to official documentation
