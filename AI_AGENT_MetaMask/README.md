# AI Agent MetaMask

An intelligent AI-powered wallet agent that integrates with MetaMask to provide natural language interaction for blockchain operations. This project combines OpenAI/Grok AI capabilities with Ethereum blockchain functionality.

## Project Structure

```
AI_AGENT_MetaMask/
├── backend/              # Express.js server with AI integration
│   ├── app.mjs          # Main server file with AI chat endpoints
│   ├── package.json     # Backend dependencies
│   └── Dockerfile       # Docker configuration
├── client/              # React frontend with MetaMask integration
│   ├── src/
│   │   ├── App.jsx      # Main application component
│   │   ├── main.jsx     # Entry point
│   │   └── components/  # React components
│   ├── package.json     # Frontend dependencies
│   └── Dockerfile       # Docker configuration
└── docker-compose.yml   # Multi-container orchestration
```

## Features

- **AI-Powered Chat Interface**: Natural language processing for wallet commands
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Smart Contract Interaction**: Execute blockchain operations via chat
- **Wallet Management**: Check balances, send transactions, deploy contracts
- **Real-time Feedback**: Instant response to user commands via AI agent

## Technologies Used

### Backend
- **Express.js**: RESTful API server
- **OpenAI/Grok API**: AI natural language processing
- **Viem**: Ethereum client library
- **Node.js**: JavaScript runtime
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 19**: Modern UI framework
- **Vite**: Fast build tool
- **MetaMask SDK**: Wallet integration
- **Wagmi**: React hooks for web3
- **React Query**: Server state management

### Infrastructure
- **Docker & Docker Compose**: Containerization
- **Node.js**: Runtime environment

## Prerequisites

- Node.js 16+ or Docker
- MetaMask browser extension
- Ethereum testnet funds (Sepolia recommended)
- OpenAI API key or Grok API key
- Alchemy API key for RPC endpoint

## Installation & Setup

### Using Docker (Recommended)

```bash
# Navigate to project root
cd AI_AGENT_MetaMask

# Build and run containers
docker-compose up --build
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Manual Installation

#### Backend Setup
```bash
cd backend
npm install

# Configure environment variables
echo "GROK_API_KEY=your_api_key_here" > .env
echo "PORT=3001" >> .env

# Start backend server
npm start
```

#### Frontend Setup
```bash
cd client
npm install

# Configure MetaMask and RPC endpoints in environment
# Edit vite.config.js if needed for API endpoints

# Start development server
npm run dev
```

## Environment Variables

### Backend (.env)
```
GROK_API_KEY=your_grok_api_key
OPENAI_API_KEY=your_openai_api_key (if using OpenAI)
PORT=3001
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_key
```

### Frontend
- MetaMask automatically provides wallet connection
- Update API endpoint in components if backend URL changes

## Usage

### Connecting Wallet
1. Open the application in your browser
2. Click "Connect Wallet" button
3. Approve MetaMask connection request
4. Wallet is now ready for operations

### AI Commands

#### Check Balance
```
"What's my balance?"
"Show my ETH balance"
"How much do I have?"
```

#### Send Transactions
```
"Send 0.5 ETH to 0x742d35Cc6634C0532925a3b844Bc92d426b4e2d5"
"Transfer 1 ETH to my friend's address"
```

#### Deploy Contracts
```
"Deploy a new ERC20 token called MyToken"
"Create a contract"
```

#### Smart Contract Interaction
```
"Call the balanceOf function"
"Interact with contract at 0x..."
```

## API Endpoints

### POST /chat
Send a message to the AI agent and receive blockchain action recommendations.

**Request Body:**
```json
{
  "message": "Check my wallet balance",
  "address": "0x742d35Cc6634C0532925a3b844Bc92d426b4e2d5"
}
```

**Response:**
```json
{
  "text": "Your wallet balance is 2.5 ETH.",
  "action": "getBalance"
}
```

### GET /
Health check endpoint to verify API is running.

## Smart Contract Interactions

The AI agent can:
- Execute read operations on smart contracts
- Prepare transaction data for write operations
- Interpret contract ABIs
- Format function calls based on user intent

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd client
npm run lint
```

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed and unlocked
- Check that you're on the correct network (Sepolia)
- Clear browser cache and try reconnecting

### AI Response Issues
- Verify API keys are correctly set in environment variables
- Check API rate limits on OpenAI/Grok
- Ensure the backend server is running and accessible

### Transaction Failures
- Verify wallet has sufficient funds
- Check Sepolia testnet faucet for free test ETH
- Ensure transaction parameters are valid

### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# View logs
docker-compose logs -f
```

## Security Considerations

⚠️ **Important Security Notes:**
- Never commit API keys or private keys to version control
- Use `.env` files and add them to `.gitignore`
- Always validate user input on backend
- Implement rate limiting for production
- Use HTTPS in production environments
- Keep MetaMask SDK updated
- Validate contract addresses before interaction

## Performance Optimization

- Backend uses connection pooling for RPC calls
- Frontend implements React Query for caching
- Vite provides optimized builds
- Docker containers for isolated environments

## Future Enhancements

- [ ] Multi-chain support (Mainnet, Polygon, etc.)
- [ ] Advanced contract deployment wizard
- [ ] Transaction history and analytics
- [ ] Portfolio management features
- [ ] Gas price optimization
- [ ] Automated trading bot integration
- [ ] Multi-wallet support
- [ ] Advanced natural language understanding

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the ISC License - see LICENSE file for details.

## Support & Resources

- [MetaMask Documentation](https://docs.metamask.io/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [OpenAI API](https://platform.openai.com/)
- [Sepolia Testnet](https://sepolia.dev/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)

## Disclaimer

This is an educational project. Use with caution on mainnet. Always test thoroughly on testnet first.
