# SimpleSonicSwap

A decentralized application built on the Sonic blockchain that enables users to swap between native Sonic ($S) and wrapped Sonic ($wS) tokens using the Rayidum AMM protocol.

## Website

- Landing Page: [simplesonicswap.xyz](https://simplesonicswap.xyz)
- App: [simplesonicswap.xyz/app](https://simplesonicswap.xyz/app)

## Features

- Swap between native Sonic ($S) and wrapped Sonic ($wS) tokens
- Modern, intuitive user interface
- MetaMask wallet integration
- Real-time price updates and gas estimation
- 0.3% swap fee mechanism

## Tech Stack

- Next.js 14
- TypeScript
- Chakra UI
- Ethers.js v6
- Hardhat (Smart Contracts)
- Solidity 0.8.20

## Smart Contract Addresses

- Wrapped Sonic: `0x3fb23c53eb22762087b4557db13c4d105eecb2b8`
- Wrapper Contract: `${process.env.NEXT_PUBLIC_WRAPPER_ADDRESS}`

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then fill in your environment variables:
   ```
   NEXT_PUBLIC_WRAPPER_ADDRESS=your_wrapper_address
   NEXT_PUBLIC_WSONIC_ADDRESS=your_wsonic_address
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. For smart contract development:
   ```bash
   npx hardhat compile
   npx hardhat test
   ```

## Deployment

The application is deployed on Vercel:
- Main site and app: [simplesonicswap.xyz](https://simplesonicswap.xyz)
- Smart Contracts: Sonic Mainnet (Chain ID: 146)

## License

MIT 