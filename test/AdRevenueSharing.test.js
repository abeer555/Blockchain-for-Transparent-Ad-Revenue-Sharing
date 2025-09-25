const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AdRevenueSharing", function () {
  let adRevenueSharing;
  let company, platform, creator;
  let companyAddress, platformAddress, creatorAddress;

  const PLATFORM_SHARE = 30;
  const CREATOR_SHARE = 70;

  beforeEach(async function () {
    [company, platform, creator] = await ethers.getSigners();
    companyAddress = company.address;
    platformAddress = platform.address;
    creatorAddress = creator.address;

    const AdRevenueSharing = await ethers.getContractFactory(
      "AdRevenueSharing"
    );
    adRevenueSharing = await AdRevenueSharing.deploy(
      platformAddress,
      creatorAddress,
      PLATFORM_SHARE,
      CREATOR_SHARE
    );
    await adRevenueSharing.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct company address", async function () {
      expect(await adRevenueSharing.company()).to.equal(companyAddress);
    });

    it("Should set the correct platform address", async function () {
      expect(await adRevenueSharing.platform()).to.equal(platformAddress);
    });

    it("Should set the correct creator address", async function () {
      expect(await adRevenueSharing.creator()).to.equal(creatorAddress);
    });

    it("Should set the correct share percentages", async function () {
      expect(await adRevenueSharing.platformShare()).to.equal(PLATFORM_SHARE);
      expect(await adRevenueSharing.creatorShare()).to.equal(CREATOR_SHARE);
    });

    it("Should reject invalid addresses", async function () {
      const AdRevenueSharing = await ethers.getContractFactory(
        "AdRevenueSharing"
      );

      await expect(
        AdRevenueSharing.deploy(
          ethers.ZeroAddress,
          creatorAddress,
          PLATFORM_SHARE,
          CREATOR_SHARE
        )
      ).to.be.revertedWith("Invalid platform address");
    });

    it("Should reject invalid share percentages", async function () {
      const AdRevenueSharing = await ethers.getContractFactory(
        "AdRevenueSharing"
      );

      await expect(
        AdRevenueSharing.deploy(
          platformAddress,
          creatorAddress,
          40,
          70 // 40 + 70 = 110, not 100
        )
      ).to.be.revertedWith("Shares must add up to 100");
    });
  });

  describe("Deposit", function () {
    it("Should allow company to deposit funds", async function () {
      const depositAmount = ethers.parseEther("1.0");

      await expect(
        adRevenueSharing.connect(company).deposit({ value: depositAmount })
      )
        .to.emit(adRevenueSharing, "PaymentReceived")
        .withArgs(companyAddress, depositAmount)
        .and.to.emit(adRevenueSharing, "RevenueDistributed");
    });

    it("Should correctly split revenue between platform and creator", async function () {
      const depositAmount = ethers.parseEther("1.0");

      await adRevenueSharing.connect(company).deposit({ value: depositAmount });

      const expectedPlatformAmount =
        (depositAmount * BigInt(PLATFORM_SHARE)) / BigInt(100);
      const expectedCreatorAmount =
        (depositAmount * BigInt(CREATOR_SHARE)) / BigInt(100);

      expect(await adRevenueSharing.balances(platformAddress)).to.equal(
        expectedPlatformAmount
      );
      expect(await adRevenueSharing.balances(creatorAddress)).to.equal(
        expectedCreatorAmount
      );
    });

    it("Should reject deposits from non-company addresses", async function () {
      const depositAmount = ethers.parseEther("1.0");

      await expect(
        adRevenueSharing.connect(platform).deposit({ value: depositAmount })
      ).to.be.revertedWith("Only company can deposit");
    });

    it("Should reject zero-value deposits", async function () {
      await expect(
        adRevenueSharing.connect(company).deposit({ value: 0 })
      ).to.be.revertedWith("Must deposit funds");
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      const depositAmount = ethers.parseEther("1.0");
      await adRevenueSharing.connect(company).deposit({ value: depositAmount });
    });

    it("Should allow platform to withdraw their share", async function () {
      const initialBalance = await ethers.provider.getBalance(platformAddress);

      await expect(adRevenueSharing.connect(platform).withdraw()).to.emit(
        adRevenueSharing,
        "Withdrawn"
      );

      expect(await adRevenueSharing.balances(platformAddress)).to.equal(0);
    });

    it("Should allow creator to withdraw their share", async function () {
      const initialBalance = await ethers.provider.getBalance(creatorAddress);

      await expect(adRevenueSharing.connect(creator).withdraw()).to.emit(
        adRevenueSharing,
        "Withdrawn"
      );

      expect(await adRevenueSharing.balances(creatorAddress)).to.equal(0);
    });

    it("Should reject withdrawal when no balance", async function () {
      await expect(
        adRevenueSharing.connect(company).withdraw()
      ).to.be.revertedWith("No balance to withdraw");
    });
  });

  describe("Balance Check", function () {
    it("Should return correct balances", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await adRevenueSharing.connect(company).deposit({ value: depositAmount });

      const expectedPlatformAmount =
        (depositAmount * BigInt(PLATFORM_SHARE)) / BigInt(100);
      const expectedCreatorAmount =
        (depositAmount * BigInt(CREATOR_SHARE)) / BigInt(100);

      expect(await adRevenueSharing.checkBalance(platformAddress)).to.equal(
        expectedPlatformAmount
      );
      expect(await adRevenueSharing.checkBalance(creatorAddress)).to.equal(
        expectedCreatorAmount
      );
      expect(await adRevenueSharing.checkBalance(companyAddress)).to.equal(0);
    });
  });

  describe("Contract Info", function () {
    it("Should return correct contract information", async function () {
      const info = await adRevenueSharing.getContractInfo();

      expect(info[0]).to.equal(companyAddress); // company
      expect(info[1]).to.equal(platformAddress); // platform
      expect(info[2]).to.equal(creatorAddress); // creator
      expect(info[3]).to.equal(PLATFORM_SHARE); // platformShare
      expect(info[4]).to.equal(CREATOR_SHARE); // creatorShare
      expect(info[5]).to.equal(0); // contractBalance (initially 0)
    });
  });
});
