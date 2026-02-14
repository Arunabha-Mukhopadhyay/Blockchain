# PDA (Program Derived Address) - Solana Program

A comprehensive Solana program demonstrating Program Derived Addresses (PDA) functionality. This project teaches how to use PDAs for deterministic account generation and state management in Solana smart contracts.

## Project Structure

```
pda/
└── PDA/
    ├── src/
    │   ├── App.jsx          # Main React application
    │   ├── main.jsx         # Application entry point
    │   ├── index.css        # Styling
    │   ├── components/      # React components for PDA operations
    │   └── assets/          # Static assets
    ├── public/              # Public static files
    ├── index.html           # HTML template
    ├── package.json         # Dependencies
    ├── vite.config.js       # Vite configuration
    └── eslint.config.js     # Code linting rules
```

## Features

- **PDA Generation**: Create deterministic addresses using program and seeds
- **Account State Management**: Store and retrieve data using PDAs
- **Wallet Integration**: Connect Solana wallets (Phantom, Solflare, etc.)
- **Transaction Broadcasting**: Submit transactions to Solana network
- **Real-time Updates**: Monitor state changes across transactions
- **Multi-Network Support**: Connect to devnet, testnet, or mainnet
- **Interactive UI**: User-friendly interface for PDA operations

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
