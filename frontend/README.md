# EventX - NFT Event Ticketing Platform

A modern React frontend for an NFT-based event ticketing system built on the Stellar blockchain. This is a hackathon MVP featuring secure ticket purchases, QR code check-ins, ticket resale functionality, and passkey authentication.

## 🚀 Features

### Core Functionality
- **Event Management**: Create and manage events with detailed information
- **NFT Ticketing**: Each ticket is a unique NFT on Stellar blockchain
- **Secure Purchases**: Gasless transactions via Launchtube relayer
- **QR Code Check-in**: Staff can scan tickets for event entry
- **Ticket Resale**: Secure marketplace for ticket transfers
- **Automatic Refunds**: Smart contract handles event cancellations

### Authentication & Security
- **Passkey Authentication**: Modern, passwordless login using biometrics
- **Wallet Integration**: Connect Stellar wallets (Freighter, etc.)
- **Admin Controls**: Role-based access for event organizers
- **Fraud Prevention**: Blockchain-based ticket verification

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Live ticket availability and pricing
- **Modern UI**: Clean, professional interface with smooth animations
- **Comprehensive Search**: Filter events by category, date, and price

## 🛠 Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context + Hooks
- **QR Codes**: react-qr-code & react-qr-reader
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Blockchain**: Stellar SDK (ready for integration)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── events/         # Event-related components
│   ├── layout/         # Layout components
│   ├── qr/             # QR code components
│   ├── tickets/        # Ticket management components
│   └── ui/             # Base UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and blockchain services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with WebAuthn support (for passkeys)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

### Demo Accounts
The app includes mock authentication for demo purposes:
- **Regular User**: Full access to events and ticket purchasing
- **Admin User**: Additional access to event creation and management

## 🔧 Configuration

### Environment Variables
Create a `.env` file for production deployment:
```env
VITE_API_BASE_URL=your_api_endpoint
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Blockchain Integration
The app is structured for easy Stellar/Soroban integration:

1. **Smart Contract Integration**:
   - Replace mock functions in `src/services/blockchain.ts`
   - Implement actual Stellar SDK calls
   - Configure contract addresses and network settings

2. **Wallet Connection**:
   - Integrate with Freighter or other Stellar wallets
   - Handle transaction signing and submission
   - Implement proper error handling

3. **Passkey Authentication**:
   - Replace mock implementation in `src/services/auth.ts`
   - Integrate with WebAuthn API
   - Add server-side credential verification

## 🎯 Key Components

### Event Management
- **EventForm**: Create new events with comprehensive validation
- **EventList**: Browse and filter available events
- **EventCard**: Display event information with real-time availability

### Ticket System
- **PurchaseTicketModal**: Handle ticket purchases with wallet integration
- **TicketCard**: Display owned tickets with QR codes
- **ResellModal**: List tickets for resale with price validation

### QR Code System
- **QRCodeDisplay**: Generate QR codes for tickets
- **QRCodeScanner**: Scan tickets for event check-in
- **CheckInPage**: Staff interface for attendee verification

### Authentication
- **LoginForm**: Passkey-based authentication interface
- **ProtectedRoute**: Route protection with role-based access
- **AuthContext**: Global authentication state management

## 🔐 Security Features

- **Passkey Authentication**: Biometric/PIN-based login
- **Wallet Integration**: Secure blockchain transactions
- **Role-based Access**: Admin and user permission levels
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure API communication

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px - Optimized touch interface
- **Tablet**: 768px - 1024px - Balanced layout
- **Desktop**: > 1024px - Full feature set

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#8B5CF6 to #3B82F6)
- **Secondary**: Blue (#3B82F6)
- **Accent**: Green (#10B981)
- **Status Colors**: Success, warning, error variants
- **Neutrals**: Comprehensive gray scale

### Typography
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable fonts with proper spacing
- **Interactive**: Clear button and link styling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
The app is configured for static hosting:
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🔮 Future Enhancements

### Blockchain Integration
- [ ] Implement actual Stellar SDK integration
- [ ] Deploy Soroban smart contracts
- [ ] Add multi-signature support
- [ ] Implement cross-chain compatibility

### Features
- [ ] Event streaming integration
- [ ] Social features and reviews
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support

### Performance
- [ ] Implement caching strategies
- [ ] Add offline support
- [ ] Optimize bundle size
- [ ] Add performance monitoring

## 🤝 Contributing

This is a hackathon project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for blockchain infrastructure
- **React Team** for the excellent framework
- **Tailwind CSS** for the utility-first styling approach
- **Lucide** for the beautiful icon set

---

**Built for the Stellar Hackathon 2024** 🌟

This project demonstrates the potential of blockchain technology in creating secure, transparent, and user-friendly event ticketing solutions.