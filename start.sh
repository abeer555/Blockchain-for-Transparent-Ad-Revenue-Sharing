#!/bin/bash

echo "🚀 Starting Blockchain Ad Revenue Sharing System..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down..."
    kill $HARDHAT_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start Hardhat node in background
echo "🔗 Starting local blockchain..."
npm run node &
HARDHAT_PID=$!

# Wait for Hardhat to start
sleep 5

# Deploy contracts
echo "📋 Deploying smart contract..."
npm run deploy:localhost

# Start frontend in background
echo "💻 Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ System is running!"
echo "📊 Frontend: http://localhost:3000"
echo "🔗 Blockchain: http://127.0.0.1:8545"
echo ""
echo "🎯 Test addresses from your Hardhat node output above:"
echo "- Use Account #0 as Company (deployer)"
echo "- Platform: 0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F"
echo "- Creator: 0x212eb7D9494503C5779d009A0B9B4DaB9240A08C"
echo ""
echo "Press Ctrl+C to stop all services..."

# Wait for processes
wait $HARDHAT_PID $FRONTEND_PID