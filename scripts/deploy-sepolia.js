const { ethers, network } = require("hardhat");

async function main() {
  // Get signers
  const [deployer] = await ethers.getSigners();

  console.log("=== Deploying to Network:", network.name, "===");
  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Contract addresses from your specification
  const companyAddress = deployer.address; // Deployer becomes the company
  const platformAddress = "0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F";
  const creatorAddress = "0x212eb7D9494503C5779d009A0B9B4DaB9240A08C";

  // Revenue sharing percentages (Platform: 30%, Creator: 70%)
  const platformShare = 30;
  const creatorShare = 70;

  console.log("\nContract Parameters:");
  console.log("- Company (deployer):", companyAddress);
  console.log("- Platform address:", platformAddress);
  console.log("- Creator address:", creatorAddress);
  console.log("- Platform share:", platformShare + "%");
  console.log("- Creator share:", creatorShare + "%");

  // Deploy the contract
  const AdRevenueSharing = await ethers.getContractFactory("AdRevenueSharing");

  console.log("\nDeploying AdRevenueSharing contract...");
  const adRevenueSharing = await AdRevenueSharing.deploy(
    platformAddress,
    creatorAddress,
    platformShare,
    creatorShare
  );

  console.log("Waiting for deployment confirmation...");
  await adRevenueSharing.waitForDeployment();
  const contractAddress = await adRevenueSharing.getAddress();

  console.log("\n=== Deployment Successful ===");
  console.log("AdRevenueSharing deployed to:", contractAddress);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.config.chainId || "Unknown");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress: contractAddress,
    companyAddress: companyAddress,
    platformAddress: platformAddress,
    creatorAddress: creatorAddress,
    platformShare: platformShare,
    creatorShare: creatorShare,
    deploymentTime: new Date().toISOString(),
    network: network.name,
    chainId: network.config.chainId || null,
    deployerAddress: deployer.address,
    transactionHash: adRevenueSharing.deploymentTransaction()?.hash,
  };

  const filename = `deployment-${network.name}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\nDeployment info saved to ${filename}`);

  if (network.name === "sepolia") {
    console.log("\n=== Sepolia Testnet Deployment ===");
    console.log("🌐 View on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\n📋 Contract Verification:");
    console.log(
      `   npx hardhat verify --network sepolia ${contractAddress} "${platformAddress}" "${creatorAddress}" ${platformShare} ${creatorShare}`
    );
    console.log("\n💰 Get Sepolia ETH from faucets:");
    console.log("   https://sepoliafaucet.com/");
    console.log("   https://www.infura.io/faucet/sepolia");
  }

  console.log("\n=== Next Steps ===");
  console.log("1. Company can deposit funds using the deposit() function");
  console.log(
    "2. Platform and Creator can withdraw their share using withdraw()"
  );
  console.log("3. Check balances using checkBalance(address)");

  if (network.name === "localhost") {
    console.log(
      "4. Access frontend at http://localhost:3000 (after running 'npm run frontend')"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
