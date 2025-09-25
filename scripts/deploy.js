const { ethers } = require("hardhat");

async function main() {
  // Get signers
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Contract addresses from your specification
  const companyAddress = "0xf450623749CEFE778B894B397A71695c57feC8dC";
  const platformAddress = "0x4B5d674dc94C44F13A30F306a49A7C9283e93A4F";
  const creatorAddress = "0x212eb7D9494503C5779d009A0B9B4DaB9240A08C";

  // Revenue sharing percentages (Platform: 30%, Creator: 70%)
  const platformShare = 30;
  const creatorShare = 70;

  // Deploy the contract
  const AdRevenueSharing = await ethers.getContractFactory("AdRevenueSharing");
  const adRevenueSharing = await AdRevenueSharing.deploy(
    platformAddress,
    creatorAddress,
    platformShare,
    creatorShare
  );

  await adRevenueSharing.waitForDeployment();
  const contractAddress = await adRevenueSharing.getAddress();

  console.log("\n=== Deployment Successful ===");
  console.log("AdRevenueSharing deployed to:", contractAddress);
  console.log("\nContract Details:");
  console.log("- Company (deployer):", deployer.address);
  console.log("- Platform address:", platformAddress);
  console.log("- Creator address:", creatorAddress);
  console.log("- Platform share:", platformShare + "%");
  console.log("- Creator share:", creatorShare + "%");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress: contractAddress,
    companyAddress: deployer.address,
    platformAddress: platformAddress,
    creatorAddress: creatorAddress,
    platformShare: platformShare,
    creatorShare: creatorShare,
    deploymentTime: new Date().toISOString(),
    network: "localhost",
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployment-info.json");
  console.log("\n=== Next Steps ===");
  console.log("1. Company can deposit funds using the deposit() function");
  console.log(
    "2. Platform and Creator can withdraw their share using withdraw()"
  );
  console.log("3. Check balances using checkBalance(address)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
