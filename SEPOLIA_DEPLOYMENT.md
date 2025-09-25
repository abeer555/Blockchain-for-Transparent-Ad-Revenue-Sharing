# Sepolia Testnet Deployment Guide

This guide will walk you through deploying your Ad Revenue Sharing smart contract to the Sepolia testnet.

## Prerequisites

### 1. MetaMask Setup

- Install MetaMask browser extension
- Create or import a wallet
- Switch to Sepolia testnet in MetaMask

### 2. Get Sepolia ETH

You need testnet ETH to deploy the contract. Get free Sepolia ETH from these faucets:

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [Alchemy Faucet](https://sepoliafaucet.com/)

You'll need approximately 0.01-0.05 ETH for deployment.

### 3. Environment Setup

1. **Copy the environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file with your details:**

   ```env
   # Your MetaMask private key (WITHOUT 0x prefix)
   PRIVATE_KEY=your_actual_private_key_here

   # Sepolia RPC URL (you can use the default public endpoint)
   SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

   # Optional: Etherscan API key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

3. **How to get your private key from MetaMask:**
   - Open MetaMask
   - Click on account menu (3 dots)
   - Account Details → Export Private Key
   - Enter your password
   - Copy the private key (remove the 0x prefix)

## Deployment Steps

### 1. Compile the Contract

```bash
npm run compile
```

### 2. Test the Contract (Optional but Recommended)

```bash
npm test
```

### 3. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

The deployment script will:

- Deploy the contract with your specified addresses
- Save deployment info to `deployment-sepolia.json`
- Show you the contract address and Etherscan link
- Provide verification command

### 4. Verify the Contract (Optional but Recommended)

After deployment, verify your contract on Etherscan:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> "0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F" "0x212eb7D9494503C5779d009A0B9B4DaB9240A08C" 30 70
```

Replace `<CONTRACT_ADDRESS>` with your actual deployed contract address.

## Configuration Details

### Default Addresses

- **Platform Address**: `0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F` (30% share)
- **Creator Address**: `0x212eb7D9494503C5779d009A0B9B4DaB9240A08C` (70% share)
- **Company Address**: Your deployer address (the one that deploys the contract)

### Revenue Split

- Platform receives 30% of all deposits
- Creator receives 70% of all deposits
- Funds are automatically split when the company deposits

## After Deployment

### 1. Update Frontend Configuration

If using the frontend, update the contract address in `frontend/src/App.js`:

```javascript
const DEFAULT_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 2. Test the Contract

1. **As Company**: Use the deposit function to send ETH
2. **As Platform/Creator**: Use withdraw function to claim your share
3. **Monitor**: Check transactions on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### 3. Share Contract Details

Share these details with your platform and creator:

- Contract address
- Network: Sepolia Testnet
- Their respective wallet addresses
- How to interact with the contract

## Troubleshooting

### Common Issues

1. **"Insufficient funds for gas"**

   - Get more Sepolia ETH from faucets
   - Wait a few minutes and try again

2. **"Network not supported"**

   - Make sure you're using Sepolia testnet
   - Check your RPC URL in `.env`

3. **"Private key error"**

   - Ensure private key is correct (no 0x prefix)
   - Make sure the account has Sepolia ETH

4. **"Contract verification failed"**
   - Wait a few minutes after deployment
   - Ensure all parameters match the deployment

### Network Details

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **RPC URL**: https://ethereum-sepolia-rpc.publicnode.com
- **Block Explorer**: https://sepolia.etherscan.io/

## Security Notes

⚠️ **NEVER** commit your `.env` file to git!
⚠️ **NEVER** share your private key!
⚠️ Only use testnet for testing - never send real ETH to testnet addresses!

## Next Steps

1. Test all functionality on Sepolia
2. Document the contract address for your team
3. When ready, deploy to mainnet using similar process
4. Always test thoroughly on testnet first!

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify you have enough Sepolia ETH
3. Ensure your `.env` file is configured correctly
4. Check Sepolia network status
