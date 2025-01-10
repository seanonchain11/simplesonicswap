# SimpleSonicSwap - Project Documentation

## Overview
SimpleSonicSwap is a decentralized application (dApp) built on the Sonic blockchain that enables users to seamlessly swap between native Sonic ($S) tokens and wrapped Sonic ($wS) tokens. The application features a modern, intuitive interface and integrates directly with MetaMask for secure wallet connections.

## Technical Stack
- **Frontend Framework**: Next.js 14 with TypeScript
- **UI Library**: Chakra UI
- **Blockchain Integration**: Ethers.js v6
- **Smart Contracts**: Solidity 0.8.20 with Hardhat
- **Deployment**: Vercel
- **Domain Management**: AWS Route 53

## Pages Breakdown

### 1. Landing Page (`src/app/page.tsx`)
The landing page serves as the introduction to SimpleSonicSwap, featuring a clean and modern design.

#### Visual Layout
- **Header**
  - Left: SimpleSonicSwap logo (201.7px × 40px)
  - Right: "Launch APP" button with orange-to-purple gradient
  
- **Main Content** (Two-Column Layout)
  - Left Column:
    - Heading: "The Easiest Way to Wrap Your $S Tokens"
    - Descriptive text about the service
    - "Swap Now" button with gradient styling
    - Link to Sonic Gateway (in orange)
  
  - Right Column:
    - Preview of the swap interface in a dark container
    - Semi-transparent background with border radius
    
- **Background**
  - Dark theme (#0E0E0E)
  - Subtle radial gradient effect
  - Decorative pattern overlay

#### Functionality
- Navigation to app interface (/app)
- External link to Sonic Gateway
- Responsive design that adapts to mobile devices

### 2. App Page (`src/app/app/page.tsx`)
The main application interface where users perform token swaps.

#### Visual Layout
- **Header**
  - Left: SimpleSonicSwap logo
  - Right: Wallet connection button
    - Disconnected: Gradient "Connect Wallet" button
    - Connected: Address display with MetaMask logo

- **Swap Interface**
  - Centered card with glass-morphism effect
  - Token input fields:
    - Upper field: Source token (S/wS)
    - Lower field: Destination token (wS/S)
    - Each field shows:
      - Token icon
      - Token symbol
      - Balance (when connected)
      - Input amount
  - Swap direction arrow between fields
  - Action button (context-dependent):
    - "Connect Wallet" (when disconnected)
    - "Approve" (when approval needed)
    - "Swap Now" (when ready to swap)

- **Footer**
  - Social media links (X, Discord, Telegram, GitHub)

#### Core Functionality
1. **Wallet Connection**
   - MetaMask integration
   - Account display
   - Balance fetching
   - Network validation

2. **Token Operations**
   - Real-time balance display
   - Token approval system
   - Swap functionality
   - Maximum amount selection

3. **Transaction Handling**
   - Approval transactions
   - Swap transactions
   - Transaction status tracking
   - Error handling and notifications

4. **Price Information**
   - Real-time price updates
   - Gas fee estimation
   - Price impact calculation
   - 0.3% swap fee display

## Smart Contract Integration

### Key Contracts
1. **Wrapper Contract**
   - Address: Environment variable `NEXT_PUBLIC_WRAPPER_ADDRESS`
   - Functions:
     - `wrap()`: Convert S to wS
     - `unwrap(amount)`: Convert wS to S
     - `balanceOf(account)`: Check balance

2. **wSonic Contract**
   - Address: Environment variable `NEXT_PUBLIC_WSONIC_ADDRESS`
   - Functions:
     - `approve(spender, amount)`
     - `allowance(owner, spender)`
     - `balanceOf(account)`
     - `transfer(to, amount)`

## Services

### ContractService
- Handles all blockchain interactions
- Manages contract instances
- Provides gas estimation
- Handles transaction execution

### PriceService
- Manages price updates
- Calculates swap impacts
- Handles token approvals
- Manages balance checks

## User Flow
1. User connects wallet via MetaMask
2. System fetches and displays token balances
3. User inputs swap amount
4. If needed, user approves token spending
5. User confirms swap transaction
6. System processes swap and updates balances
7. Transaction history is updated

## Deployment
- Main site: [simplesonicswap.xyz](https://simplesonicswap.xyz)
- App interface: [simplesonicswap.xyz/app](https://simplesonicswap.xyz/app)
- Hosting: Vercel with automatic deployments
- DNS: AWS Route 53 with custom domain configuration

## Security Features
- Secure wallet connection
- Transaction confirmation modals
- Error handling and validation
- Smart contract allowance system
- Network validation
- Gas limit safety measures

## UI/UX Features
- Dark theme with gradient accents
- Responsive design
- Loading states and animations
- Clear error messages
- Transaction status updates
- Token balance displays
- Intuitive swap interface 