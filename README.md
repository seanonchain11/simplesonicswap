# SimpleSonicSwap

A decentralized application built on the Sonic blockchain that enables users to swap between native Sonic ($S) and wrapped Sonic ($wS) tokens using the Rayidum AMM protocol.

## Websites

- Landing Page: [simplesonicswap.xyz](https://simplesonicswap.xyz)
- App: [simplesonicswap.app](https://simplesonicswap.app)

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
- Ethers.js
- Hardhat (Smart Contracts)
- Solidity 0.8.20

## Smart Contract Addresses

- Wrapped Sonic: `0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38`
- Rayidum Router: `routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS`

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then fill in your environment variables.

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

The application is deployed on AWS infrastructure:
- Landing page: Static site hosting
- App: Next.js application
- Smart Contracts: Sonic Mainnet (Chain ID: 146)

## License

MIT 