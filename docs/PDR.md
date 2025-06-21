# 📄 Project Definition Report — EventX NFT Ticketing Platform

## 1. 🎯 Project Goal  
Build and deploy a minimum viable product (MVP) for a secure, NFT-based event ticketing system on the Stellar blockchain. Features include QR code check-in, secondary ticket sales control, and automated refunds — all within 2 days.

## 2. 👥 Stakeholders & Needs  

| Stakeholder        | Needs / Expectations                                         |  
|--------------------|--------------------------------------------------------------|  
| Event Organizers    | Fraud-free ticket sales, resale control, real-time revenue tracking, automated refunds on cancellation |  
| Ticket Buyers      | Easy ticket purchase, verified ownership, simple QR check-in, secure resale capability |  
| Platform Operators | Reliable blockchain backend, secure authentication, smooth user experience, low fees |

## 3. ✅ Functional Requirements (MVP Scope)  

| Feature                        | Priority  | Description                                        |  
|-------------------------------|-----------|----------------------------------------------------|  
| Event Creation                | Must Have | Admins can create events with detailed info        |  
| NFT Ticket Minting            | Must Have | Mint unique NFT tickets per event                    |  
| QR Code Generation            | Must Have | Generate QR codes linked to NFT tickets              |  
| QR Code Scanning & Validation | Must Have | Validate ticket ownership and usage at event entry   |  
| Secondary Ticket Transfer     | Must Have | Enable secure resale by transferring NFT ownership   |  
| Refund Automation             | Must Have | Automatic refund processing on event cancellations   |  
| Passkey Authentication       | Must Have | Passwordless, secure user login with Passkeys        |  
| Launchtube Integration       | Must Have | Gasless transactions via relayer service             |

## 4. 🗓️ Non-Functional Requirements & Constraints  

- Deploy all smart contracts on Stellar Testnet.  
- Frontend must be responsive, user-friendly, and clear.  
- QR code generation and scanning should support offline usage if needed.  
- Full solution ready and demoable within 48 hours.  
- Complete, clear documentation including Prompt, PDR, Technical Design, and README.  

## 5. ⚠️ Risks & Mitigation Strategies  

| Risk                          | Mitigation                                              |  
|-------------------------------|---------------------------------------------------------|  
| Tight timeline                | Prioritize core MVP features, defer optional extras      |  
| Blockchain or network downtime | Use Stellar Testnet; prepare fallback messaging          |  
| QR code scanning failure      | Implement manual code entry fallback option              |  
| User wallet onboarding complexity | Use Passkey smart wallets for simplified user onboarding |  
| Refund logic bugs             | Keep refund logic simple and thoroughly test             |

## 6. ⏱️ Project Timeline (48 Hours)  

| Stage                       | Duration | Notes                                  |  
|-----------------------------|----------|----------------------------------------|  
| Planning & Finalizing Scope | 1 hour   | Define scope, tech stack, and features |  
| Smart Contract Development  | 4 hours  | Write, test, deploy Soroban contracts  |  
| Frontend Setup & Integration| 3 hours  | Build UI, connect wallets & contracts  |  
| QR Code Implementation      | 2 hours  | QR code generation and scanning        |  
| Passkey & Launchtube Setup  | 2 hours  | Integrate authentication and relayer   |  
| Testing & Bug Fixing        | 4 hours  | End-to-end tests, edge cases            |  
| Documentation & README      | 3 hours  | Write clear docs and demo instructions  |  
| Buffer & Demo Preparation   | 3 hours  | Final fixes, demo recording preparation|  

## 7. 📈 Success Metrics  

- NFT tickets minted and transferred successfully.  
- QR codes scanned and validated reliably.  
- Secure resale through NFT transfers.  
- Automated refunds processed on cancellations.  
- Passkey login works smoothly and securely.  
- Demo operates without critical errors on Stellar Testnet.  

## 8. 🛠️ Tools & Technologies  

- **Blockchain:** Stellar Network & Soroban Smart Contracts  
- **Authentication:** Passkey Smart Wallets  
- **Transaction Relayer:** Launchtube  
- **Frontend:** React.js  
- **QR Handling:** react-qr-code, react-qr-reader (or equivalents)  
- **Deployment:** Stellar Testnet, Vercel/Netlify for frontend hosting  
