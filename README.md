# Blockchain for Transparent Ad Revenue Sharing

A decentralized solution for transparent and automatic ad revenue sharing between platforms and content creators using blockchain technology.

## 🌟 Overview

This project implements a smart contract that automatically splits ad revenue between platforms and content creators based on predetermined percentages. When a company deposits ad payment, the funds are automatically distributed according to the agreed-upon revenue sharing model, ensuring transparency and eliminating the need for manual calculations.

## 🏗️ Architecture

### Smart Contract Components
- **Company**: The advertiser who deposits funds into the contract
- **Platform**: The advertising platform (receives 30% by default)
- **Creator**: The content creator (receives 70% by default)
- **Automatic Split**: Funds are automatically distributed when deposited

### Key Features
- ✅ **Transparent Revenue Sharing**: All transactions are recorded on the blockchain
- ✅ **Automatic Distribution**: No manual intervention required for splitting funds
- ✅ **Customizable Split Ratios**: Platform and creator percentages can be set during deployment
- ✅ **Secure Withdrawals**: Only platform and creator can withdraw their respective shares
- ✅ **Real-time Balance Tracking**: Check balances at any time
- ✅ **Event Logging**: All deposits and withdrawals are logged as events

## 📁 Project Structure

```
Blockchain-for-Transparent-Ad-Revenue-Sharing/
├── contracts/
│   └── AdRevenueSharing.sol      # Main smart contract
├── scripts/
│   ├── deploy.js                 # Deployment script
│   └── demo.js                   # Demo script
├── test/
│   └── AdRevenueSharing.test.js  # Comprehensive tests
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js               # React frontend
│   │   ├── App.css              # Styles
│   │   └── index.js             # Entry point
│   └── package.json
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Node.js dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Blockchain-for-Transparent-Ad-Revenue-Sharing.git
cd Blockchain-for-Transparent-Ad-Revenue-Sharing

# Install dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Smart Contract Setup

```bash
# Compile the smart contract
npm run compile

# Run tests
npm run test

# Start local blockchain (in a separate terminal)
npm run node

# Deploy to local network
npm run deploy:localhost
```

### 3. Frontend Setup

```bash
# Start the React frontend
npm run frontend
```

### 4. MetaMask Configuration

1. Add the local network to MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

2. Import the test accounts using the private keys shown when you run `npm run node`

## 📊 Contract Details

### Default Configuration
- **Platform Address**: `0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F`
- **Creator Address**: `0x212eb7D9494503C5779d009A0B9B4DaB9240A08C`
- **Platform Share**: 30%
- **Creator Share**: 70%

### Smart Contract Functions

#### For Company (Depositor)
- `deposit()`: Deposit ad revenue (automatically splits funds)

#### For Platform & Creator
- `withdraw()`: Withdraw available balance
- `checkBalance(address)`: Check balance for any address

#### Public View Functions
- `getContractInfo()`: Get all contract details
- `balances(address)`: Check balance mapping
- `company()`, `platform()`, `creator()`: Get participant addresses
- `platformShare()`, `creatorShare()`: Get sharing percentages

## 🧪 Testing

The project includes comprehensive tests covering:
- Contract deployment with various scenarios
- Deposit functionality and automatic splitting
- Withdrawal mechanics
- Access control (only company can deposit, only platform/creator can withdraw)
- Balance tracking and edge cases

```bash
npm run test
```

## 💻 Frontend Features

The React frontend provides:
- **MetaMask Integration**: Connect your wallet seamlessly
- **Role Detection**: Automatically detects if you're Company, Platform, Creator, or Observer
- **Real-time Balance Display**: See current balances for all participants
- **Deposit Interface**: Company can deposit funds with automatic splitting
- **Withdrawal Interface**: Platform and Creator can withdraw their shares
- **Transaction Monitoring**: Real-time transaction status and confirmations
- **Responsive Design**: Works on desktop and mobile devices

## 📝 Usage Examples

### Depositing Funds (Company)
```javascript
// Company deposits 1 ETH
await contract.deposit({ value: ethers.parseEther("1.0") });
// Result: 0.3 ETH goes to platform, 0.7 ETH goes to creator
```

### Withdrawing Funds (Platform/Creator)
```javascript
// Platform or Creator withdraws their balance
await contract.withdraw();
// Transfers available balance to caller's address
```

### Checking Balances
```javascript
// Check platform balance
const platformBalance = await contract.checkBalance(platformAddress);

// Check creator balance  
const creatorBalance = await contract.checkBalance(creatorAddress);
```

## 🔐 Security Features

- **Access Control**: Only the company can deposit funds
- **Secure Withdrawals**: Platform and Creator can only withdraw their own balances
- **Reentrancy Protection**: Uses secure transfer patterns
- **Input Validation**: Comprehensive requirement checks
- **Event Logging**: All major operations emit events for transparency

## 🌐 Deployment

### Local Development
```bash
npm run node          # Start local blockchain
npm run deploy        # Deploy to local network
```

### Custom Networks
Update `hardhat.config.js` with your network configuration and deploy:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Technology Stack

- **Blockchain**: Ethereum, Solidity ^0.8.17
- **Development**: Hardhat, Ethers.js v6
- **Frontend**: React 18, CSS3
- **Testing**: Mocha, Chai
- **Wallet**: MetaMask integration

## 🎯 Use Cases

1. **YouTube/Platform Revenue Sharing**: Automatic distribution of ad revenue between platform and creators
2. **Sponsored Content**: Transparent sharing of sponsorship payments
3. **Affiliate Marketing**: Automatic commission distribution
4. **Content Monetization**: Fair and transparent revenue sharing for any content platform
5. **Partnership Agreements**: Automated revenue distribution based on agreed percentages

## 📞 Support

For questions or support:
- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🚀 Future Enhancements

- [ ] Multi-token support (ERC-20 tokens)
- [ ] Dynamic percentage adjustment
- [ ] Multi-party revenue sharing (more than 2 recipients)
- [ ] Time-based revenue release
- [ ] Integration with major platforms' APIs
- [ ] Mobile app for easier access
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for transparent and fair revenue sharing in the digital economy.**
