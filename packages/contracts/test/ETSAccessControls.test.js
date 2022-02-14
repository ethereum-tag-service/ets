const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");

let accounts, accessControls;

before("Setup test", async function () {
  const ETSAccessControls = await ethers.getContractFactory("ETSAccessControls");

  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();

  accounts = {
    ETSAdmin: namedAccounts["ETSAdmin"],
    ETSPublisher: namedAccounts["ETSPublisher"],
    ETSPlatform: namedAccounts["ETSPlatform"],
  };

  accessControls = await upgrades.deployProxy(ETSAccessControls, { kind: "uups" });
});

describe("ETSAccessControls", function () {
  describe("Validate setup/initialization", async function () {
    it("named account ETSAdmin should be admin", async function () {
      expect(await accessControls.isAdmin(accounts.ETSAdmin.address)).to.be.equal(true);
    });
  });
});

describe("Publisher", async function () {
  it("should admin as contract creator", async function () {
    await accessControls.grantRole(ethers.utils.id("PUBLISHER"), accounts.ETSPublisher.address);
    expect(await accessControls.isPublisher(accounts.ETSPublisher.address)).to.be.equal(true);
  });
});
