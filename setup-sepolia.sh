#!/bin/bash

echo "🚀 Setting up Sepolia Deployment for Ad Revenue Sharing..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file with your details:"
    echo "   1. Add your MetaMask private key (without 0x)"
    echo "   2. Optionally add your Etherscan API key"
    echo "   3. RPC URL is already configured with public endpoint"
    echo ""
    echo "📖 See SEPOLIA_DEPLOYMENT.md for detailed instructions"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile contracts
echo "⚡ Compiling contracts..."
npm run compile

echo ""
echo "🎯 Next steps for Sepolia deployment:"
echo "1. Get Sepolia ETH from faucets:"
echo "   - https://sepoliafaucet.com/"
echo "   - https://www.infura.io/faucet/sepolia"
echo ""
echo "2. Edit .env file with your private key"
echo ""
echo "3. Deploy to Sepolia:"
echo "   npm run deploy:sepolia"
echo ""
echo "4. Test the deployment:"
echo "   npm run demo:sepolia"
echo ""
echo "📋 Full guide: See SEPOLIA_DEPLOYMENT.md"