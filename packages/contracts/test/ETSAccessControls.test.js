const { setup } = require("./setup.js");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ETSAccessControls Tests", () => {
  beforeEach("Setup test", async () => {
    [accounts, contracts, initSettings] = await setup();

    // ETSRelayer is deployed globally for all tests,
    // so let's deploy a mock for testing access controls.
    //RelayerMock = await ethers.getContractFactory("RelayerMock", accounts.RandomOne);
    //relayerMock = await RelayerMock.deploy(
    //  await contracts.ETS.getAddress(),
    //  contracts.ETSToken.address,
    //  await contracts.ETSTarget.getAddress(),
    //  accounts.RandomOne.address, // creator
    //  accounts.RandomTwo.address, // transfer to (new owner)
    //);
  });

  describe("Valid setup/initialization", async () => {
    it("sets RELAYER_ADMIN_ROLE as the role that can grant RELAYER_FACTORY_ROLE.", async () => {
      expect(await contracts.ETSAccessControls.getRoleAdmin(ethers.id("RELAYER_FACTORY_ROLE"))).to.be.equal(
        await ethers.id("RELAYER_ADMIN_ROLE"),
      );
    });

    it("sets RELAYER_FACTORY_ROLE as the role that can grant RELAYER_ROLE.", async () => {
      expect(await contracts.ETSAccessControls.getRoleAdmin(ethers.id("RELAYER_ROLE"))).to.be.equal(
        await ethers.id("RELAYER_FACTORY_ROLE"),
      );
    });

    it("grants ETSAdmin (deployer) the DEFAULT_ADMIN_ROLE role", async () => {
      expect(await contracts.ETSAccessControls.isAdmin(accounts.ETSAdmin.address)).to.be.equal(true);
    });

    it("grants ETSPlatform the DEFAULT_ADMIN_ROLE", async () => {
      expect(await contracts.ETSAccessControls.isAdmin(accounts.ETSPlatform.address)).to.be.equal(true);
    });

    it('sets ETSPlatform address as the "Platform"', async () => {
      expect(await contracts.ETSAccessControls.getPlatformAddress()).to.be.equal(accounts.ETSPlatform.address);
    });

    it("grants ETSPlatform the RELAYER_ADMIN_ROLE", async () => {
      expect(await contracts.ETSAccessControls.isRelayerAdmin(accounts.ETSPlatform.address)).to.be.equal(true);
    });
  });

  describe("Platform address", async () => {
    it("can only be set by administrator", async () => {
      await expect(contracts.ETSAccessControls.connect(accounts.Buyer).setPlatform(accounts.RandomOne.address)).to.be
        .reverted;

      await contracts.ETSAccessControls.connect(accounts.ETSPlatform).setPlatform(accounts.RandomOne.address);
      expect(await contracts.ETSAccessControls.getPlatformAddress()).to.be.equal(accounts.RandomOne.address);
    });
  });
});
