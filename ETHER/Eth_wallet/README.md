# ETHER Wallet Application

A modern web-based Ethereum wallet built with React and Vite. This application provides a user-friendly interface for managing Ethereum assets, checking wallet balances, and performing blockchain transactions.

## Project Structure

```
ETHER/
└── Eth_wallet/
    ├── src/
    │   ├── App.jsx          # Main application component
    │   ├── main.jsx         # Application entry point
    │   ├── index.css        # Global styles
    │   ├── assets/          # Static assets and images
    │   └── components/      # Reusable React components
    ├── public/              # Static files served directly
    ├── index.html           # HTML template
    ├── package.json         # Dependencies and scripts
    ├── vite.config.js       # Vite configuration
    └── eslint.config.js     # ESLint rules
```

## Features

- **Wallet Connection**: Seamless integration with Web3 wallets (MetaMask, WalletConnect, etc.)
- **Balance Display**: Real-time display of ETH and token balances
- **Transaction History**: View recent transactions and transaction details
- **Network Switching**: Support for multiple Ethereum networks
- **Responsive Design**: Mobile-friendly interface
- **Gas Estimation**: Display estimated gas fees for transactions
- **ENS Support**: Domain name resolution for addresses

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
