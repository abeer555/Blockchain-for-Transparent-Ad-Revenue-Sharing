const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Load deployment info from Sepolia
  let deploymentFile = "deployment-sepolia.json";

  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Sepolia deployment file not found!");
    console.log("Please deploy to Sepolia first using: npm run deploy:sepolia");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log("=== Sepolia Contract Demo ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Sepolia Testnet");

  // Get contract instance - Connect to Sepolia
  const AdRevenueSharing = await ethers.getContractFactory("AdRevenueSharing");
  const adRevenueSharing = AdRevenueSharing.attach(contractAddress);

  // Get signer
  const [company] = await ethers.getSigners();
  console.log("Company Address:", company.address);

  try {
    // Get contract info
    console.log("\n📋 Getting contract information...");
    const info = await adRevenueSharing.getContractInfo();

    console.log("\n=== Contract Information ===");
    console.log("- Company:", info[0]);
    console.log("- Platform:", info[1]);
    console.log("- Creator:", info[2]);
    console.log("- Platform Share:", info[3].toString() + "%");
    console.log("- Creator Share:", info[4].toString() + "%");
    console.log("- Contract Balance:", ethers.formatEther(info[5]) + " ETH");

    // Check current balances
    console.log("\n💰 Current Balances:");
    const platformBalance = await adRevenueSharing.checkBalance(info[1]);
    const creatorBalance = await adRevenueSharing.checkBalance(info[2]);

    console.log(
      "- Platform Balance:",
      ethers.formatEther(platformBalance) + " ETH"
    );
    console.log(
      "- Creator Balance:",
      ethers.formatEther(creatorBalance) + " ETH"
    );

    // Demo deposit (optional - uncomment to test)
    /*
    console.log("\n💸 Making demo deposit of 0.01 ETH...");
    const depositAmount = ethers.parseEther("0.01");
    
    const tx = await adRevenueSharing.connect(company).deposit({ 
      value: depositAmount,
      gasLimit: 100000 // Set gas limit for Sepolia
    });
    
    console.log("Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    await tx.wait();
    console.log("✅ Deposit successful!");
    
    // Check updated balances
    console.log("\n💰 Updated Balances:");
    const newPlatformBalance = await adRevenueSharing.checkBalance(info[1]);
    const newCreatorBalance = await adRevenueSharing.checkBalance(info[2]);
    
    console.log("- Platform Balance:", ethers.formatEther(newPlatformBalance) + " ETH");
    console.log("- Creator Balance:", ethers.formatEther(newCreatorBalance) + " ETH");
    */

    console.log("\n🌐 View on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${contractAddress}`);

    console.log("\n=== Demo Complete ===");
    console.log("✅ Contract is deployed and functional on Sepolia!");
    console.log("📝 To make a deposit, uncomment the demo code in this script");
    console.log(
      "💡 Platform and Creator can withdraw using the withdraw() function"
    );
  } catch (error) {
    console.error("❌ Error interacting with contract:");
    console.error(error.message);

    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Need more Sepolia ETH? Get some from:");
      console.log("   https://sepoliafaucet.com/");
      console.log("   https://www.infura.io/faucet/sepolia");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
