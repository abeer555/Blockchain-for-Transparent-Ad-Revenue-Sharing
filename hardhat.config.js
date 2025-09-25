require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Function to validate private key
function getValidatedPrivateKey() {
  const privateKey = process.env.PRIVATE_KEY;

  if (
    !privateKey ||
    privateKey === "your_private_key_here" ||
    privateKey.length < 64
  ) {
    console.warn("⚠️  WARNING: Invalid or missing PRIVATE_KEY in .env file");
    console.warn("   For Sepolia deployment, you need to:");
    console.warn("   1. Get your private key from MetaMask");
    console.warn("   2. Add it to .env file (without 0x prefix)");
    console.warn("   3. Ensure it's 64 characters long");
    return null;
  }

  return privateKey;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url:
        process.env.SEPOLIA_RPC_URL ||
        "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: getValidatedPrivateKey() ? [getValidatedPrivateKey()] : [],
      chainId: 11155111,
      gasPrice: "auto",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
