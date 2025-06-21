# EventX - NFT-Based Event Ticketing Platform

[![Stellar](https://img.shields.io/badge/Blockchain-Stellar-blue)](https://stellar.org)
[![Soroban](https://img.shields.io/badge/Smart%20Contracts-Soroban-orange)](https://soroban.stellar.org)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)](https://reactjs.org)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38b2ac)](https://tailwindcss.com)

A next-generation event ticketing platform built on Stellar blockchain with Soroban smart contracts. EventX revolutionizes the ticketing industry by providing secure, transparent, and fraud-proof NFT-based tickets with seamless user experience.

## 🚀 Features

### Core Features
- **NFT Ticket Minting** - Each ticket is a unique NFT on Stellar blockchain
- **QR Code Check-in** - Secure event entry with QR code scanning
- **Secondary Market** - Built-in ticket resale marketplace
- **Auto-refund System** - Automatic refunds for cancelled events
- **Gasless Transactions** - Powered by Launchtube relayer for zero-fee transactions

### Authentication & Security
- **Passkey Authentication** - Modern, passwordless login using biometric authentication
- **Freighter Wallet Integration** - Seamless Stellar wallet connection
- **Multi-signature Support** - Enhanced security for high-value transactions
- **Fraud Prevention** - Blockchain-verified ticket authenticity

### User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Updates** - Live ticket status and balance updates
- **Admin Dashboard** - Event creation and management tools
- **Analytics** - Event performance and ticket sales insights

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Blockchain
- **Stellar** - Fast, secure blockchain network
- **Soroban** - Smart contract platform
- **Freighter** - Stellar wallet integration
- **Launchtube** - Gasless transaction relayer

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vite HMR** - Hot module replacement

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Rust** (for Soroban smart contracts)
- **Soroban CLI** (for contract deployment)
- **Freighter Wallet** (browser extension)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/eventx.git
cd eventx
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Smart Contract Dependencies
```bash
cd ../contracts/eventx
cargo install soroban-cli
```

### 4. Environment Setup
Create a `.env` file in the frontend directory:
```env
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_CONTRACT_ADDRESS=CAH5FS7J4U5GRLVN4FKAOSGXKLKWWT7SCXA22GKUM4ECG2DKBIWMGU5S
```

## 🏗 Smart Contract Deployment

### 1. Build the Contract
```bash
cd contracts/eventx
soroban contract build
```

### 2. Deploy to Testnet
```bash
soroban contract deploy \
  --wasm target/wasm32v1-none/release/eventx.wasm \
  --source admin \
  --network testnet
```

### 3. Initialize Contract
```bash
soroban contract invoke \
  --id CAH5FS7J4U5GRLVN4FKAOSGXKLKWWT7SCXA22GKUM4ECG2DKBIWMGU5S \
  --source admin \
  --network testnet \
  -- initialize \
  --admin GCKUE5RWKYTNJNMOJ64YR3HMIOBAEF4PIY4HH6RRNSHSOS325LXWAGAJ
```

## 🎯 Usage

### Development Server
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

### Smart Contract Testing
```bash
cd contracts/eventx
cargo test
```

## 🔧 Configuration

### Stellar Network Settings
Update `frontend/src/utils/constants.ts`:
```typescript
export const STELLAR_CONFIG = {
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  CONTRACT_ADDRESS: 'CAH5FS7J4U5GRLVN4FKAOSGXKLKWWT7SCXA22GKUM4ECG2DKBIWMGU5S'
};
```

### Wallet Configuration
1. Install [Freighter Wallet](https://www.freighter.app/)
2. Create a testnet account
3. Get test XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=testnet)

## 📱 Features Walkthrough

### 1. Wallet Connection
- Click "Connect Wallet" in the header
- Choose between Freighter integration or manual public key input
- View your XLM balance and public key

### 2. Event Creation (Admin)
- Navigate to "Create Event"
- Fill in event details (name, date, price, capacity)
- Deploy event to blockchain

### 3. Ticket Purchase
- Browse available events
- Select quantity and purchase
- Receive NFT ticket in your wallet

### 4. Event Check-in
- Use QR code scanner
- Verify ticket authenticity
- Mark attendance on blockchain

### 5. Ticket Resale
- List tickets on secondary market
- Set custom prices
- Transfer ownership securely

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
vercel --prod
```

### Smart Contract Deployment (Production)
```bash
# Switch to mainnet
soroban config network mainnet

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32v1-none/release/eventx.wasm \
  --source admin \
  --network mainnet
```

### Environment Variables (Production)
```env
VITE_STELLAR_NETWORK=mainnet
VITE_HORIZON_URL=https://horizon.stellar.org
VITE_CONTRACT_ADDRESS=<your_mainnet_contract_address>
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Smart Contract Tests
```bash
cd contracts/eventx
cargo test
```

### Integration Tests
```bash
npm run test:integration
```

## 📊 Smart Contract Functions

### Core Functions
- `initialize(admin: Address)` - Initialize contract with admin
- `create_event(params: CreateEventParams)` - Create new event
- `mint_ticket(params: MintTicketParams)` - Mint NFT ticket
- `transfer_ticket(params: TransferTicketParams)` - Transfer ticket ownership
- `use_ticket(ticket_id: Symbol)` - Mark ticket as used
- `cancel_event(event_id: Symbol)` - Cancel event and refund tickets

### Query Functions
- `get_event(event_id: Symbol)` - Get event details
- `get_ticket(ticket_id: Symbol)` - Get ticket information
- `get_user_tickets(user: Address)` - Get user's tickets
- `is_ticket_valid(ticket_id: Symbol)` - Verify ticket validity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org) for the blockchain infrastructure
- [Soroban](https://soroban.stellar.org) for smart contract capabilities
- [Freighter](https://www.freighter.app/) for wallet integration
- [Launchtube](https://launchtube.com) for gasless transactions

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/eventx/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/eventx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/eventx/discussions)
- **Email**: support@eventx.com

---

**Built with ❤️ on Stellar Blockchain** 