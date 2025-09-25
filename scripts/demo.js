const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Read deployment info
  const deploymentInfo = JSON.parse(
    fs.readFileSync("deployment-info.json", "utf8")
  );
  const contractAddress = deploymentInfo.contractAddress;

  // Get contract instance
  const AdRevenueSharing = await ethers.getContractFactory("AdRevenueSharing");
  const adRevenueSharing = AdRevenueSharing.attach(contractAddress);

  // Get signers
  const [company] = await ethers.getSigners();

  console.log("=== Ad Revenue Sharing Demo ===");
  console.log("Contract Address:", contractAddress);
  console.log("Company Address:", company.address);

  // Get contract info
  const info = await adRevenueSharing.getContractInfo();
  console.log("\nContract Information:");
  console.log("- Company:", info[0]);
  console.log("- Platform:", info[1]);
  console.log("- Creator:", info[2]);
  console.log("- Platform Share:", info[3].toString() + "%");
  console.log("- Creator Share:", info[4].toString() + "%");
  console.log("- Contract Balance:", ethers.formatEther(info[5]) + " ETH");

  // Deposit funds
  const depositAmount = ethers.parseEther("1.0");
  console.log("\n=== Depositing 1 ETH ===");

  const tx = await adRevenueSharing
    .connect(company)
    .deposit({ value: depositAmount });
  await tx.wait();

  console.log("Transaction Hash:", tx.hash);
  console.log("Deposit Amount:", ethers.formatEther(depositAmount) + " ETH");

  // Check balances after deposit
  const platformBalance = await adRevenueSharing.checkBalance(info[1]);
  const creatorBalance = await adRevenueSharing.checkBalance(info[2]);

  console.log("\n=== Balances After Deposit ===");
  console.log(
    "Platform Balance:",
    ethers.formatEther(platformBalance) + " ETH"
  );
  console.log("Creator Balance:", ethers.formatEther(creatorBalance) + " ETH");

  // Get updated contract info
  const updatedInfo = await adRevenueSharing.getContractInfo();
  console.log(
    "Total Contract Balance:",
    ethers.formatEther(updatedInfo[5]) + " ETH"
  );

  console.log("\n=== Demo Complete ===");
  console.log("✅ Funds successfully deposited and split automatically");
  console.log(
    "✅ Platform and Creator can now withdraw their respective shares"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
