#!/bin/bash

# Setup script for Blockchain Ad Revenue Sharing
echo "🚀 Setting up Blockchain Ad Revenue Sharing Project..."

# Install main project dependencies
echo "📦 Installing main project dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Compile smart contracts
echo "⚡ Compiling smart contracts..."
npm run compile

# Run tests
echo "🧪 Running tests..."
npm run test

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start local blockchain: npm run node"
echo "2. Deploy contract: npm run deploy:localhost"
echo "3. Start frontend: npm run frontend"
echo ""
echo "Or run everything with: ./start.sh"