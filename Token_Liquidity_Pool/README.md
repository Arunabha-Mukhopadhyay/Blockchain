# Token Liquidity Pool - Solana AMM

A decentralized liquidity pool implementation for token swaps on Solana using the Raydium AMM protocol. This project enables users to create pools, add liquidity, and swap tokens with minimal slippage.

## Project Structure

```
Token_Liquidity_Pool/
├── src/
│   ├── App.jsx              # Main application component
    ├── main.jsx             # Application entry point
    ├── index.css            # Global styles
    ├── assets/              # Static assets
    └── components/
        ├── CreateToken.jsx  # Token creation component
        ├── CpPool.jsx       # Liquidity pool component
        └── ...              # Other utility components
├── public/                  # Static files
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## Features

- **Liquidity Pool Creation**: Create custom token trading pairs
- **Add Liquidity**: Deposit tokens to earn trading fees
- **Remove Liquidity**: Withdraw tokens and claim rewards
- **Token Swaps**: Execute trades with minimal slippage
- **Price Discovery**: Real-time pricing based on pool reserves
- **Constant Product Pricing**: AMM formula (x * y = k)
- **LP Token Minting**: Receive LP tokens representing pool share
- **Fee Collection**: Earn 0.25% on all trades
- **Multi-token Support**: Swap any SPL token pairs

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
