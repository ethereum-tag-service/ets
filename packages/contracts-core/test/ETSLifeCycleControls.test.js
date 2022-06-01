const { ethers, upgrades } = require("hardhat");
const { expect, assert } = require("chai");
const { BigNumber, constants } = ethers;

let accounts, factories, ETSAccessControls, ETSLifeCycleControls, ETS;

describe("ETS CTAG ownership lifecycle tests", function () {
  // we create a setup function that can be called by every test and setup variable for easy to read tests
  beforeEach("Setup test", async function () {
    // See namedAccounts section of hardhat.config.js
    const namedAccounts = await ethers.getNamedSigners();
    const unnamedAccounts = await ethers.getUnnamedSigners();
    accounts = {
      ETSAdmin: namedAccounts["ETSAdmin"],
      ETSPublisher: namedAccounts["ETSPublisher"],
      ETSPlatform: namedAccounts["ETSPlatform"],
      Buyer: unnamedAccounts[0],
      RandomOne: unnamedAccounts[1],
      RandomTwo: unnamedAccounts[2],
      Creator: unnamedAccounts[3],
    };

    factories = {
      ETSAccessControls: await ethers.getContractFactory("ETSAccessControls"),
      ETSLifeCycleControls: await ethers.getContractFactory("ETSLifeCycleControls"),
      ETS: await ethers.getContractFactory("ETS"),
    };

    ETSAccessControls = await upgrades.deployProxy(factories.ETSAccessControls, { kind: "uups" });
    assert((await ETSAccessControls.isAdmin(accounts.ETSAdmin.address)) === true);

    await ETSAccessControls.grantRole(
      await ETSAccessControls.SMART_CONTRACT_ROLE(),
      accounts.ETSAdmin.address,
      { from: accounts.ETSAdmin.address },
    );

    // add a publisher to the protocol
    await ETSAccessControls.grantRole(ethers.utils.id("PUBLISHER"), accounts.ETSPublisher.address);

    ETSLifeCycleControls = await upgrades.deployProxy(
      factories.ETSLifeCycleControls,
      [ETSAccessControls.address],
      { kind: "uups" },
    );

    assert((await ETSLifeCycleControls.version()) === "0.1.0");
    assert((await ETSLifeCycleControls.ets()) === constants.AddressZero);

    ETS = await upgrades.deployProxy(
      factories.ETS,
      [ETSAccessControls.address, ETSLifeCycleControls.address, accounts.ETSPlatform.address],
      { kind: "uups" },
    );

    await ETSLifeCycleControls.setETS(ETS.address);

  });

  describe("Validate setup", async function () {
    it("should have name and symbol", async function () {
      expect(await ETS.name()).to.be.equal("Ethereum Tag Service");
      expect(await ETS.symbol()).to.be.equal("CTAG");
      expect(await ETS.platform()).to.be.equal(accounts.ETSPlatform.address);
    });

    it("should have default configs", async function () {
      assert((await ETSLifeCycleControls.version()) === "0.1.0");
      assert((await ETSLifeCycleControls.ets()) === ETS.address);
      assert((await ETSLifeCycleControls.accessControls()) === ETSAccessControls.address);
      expect(await ETSLifeCycleControls.ownershipTermLength()).to.be.equal("63072000");
    });
  });

  describe("Owner/Admin functions", async function () {
    it("Admin should be able to set ownership term", async function() {
      const thirtyDays = 30 * 24 * 60 * 60;
      await ETSLifeCycleControls.setOwnershipTermLength(thirtyDays);
      expect(await ETSLifeCycleControls.ownershipTermLength()).to.be.equal(thirtyDays);
    });

    it("Only admin should be able to set ownership term", async function() {
      await expect(
        ETSLifeCycleControls.connect(accounts.RandomTwo).setOwnershipTermLength(10)).to.be.revertedWith(
        "Caller must have administrator access",
      );
    });
  });

  describe("Renewing a tag", async function () {
    let lastRenewed, tokenId;

    beforeEach(async function () {
      const tag = "#BlockRocket";

      // RandomTwo account creates a tag.
      await ETS.connect(accounts.RandomTwo).createTag(tag, accounts.ETSPublisher.address);
      tokenId = await ETS.computeTagId(tag);

    });

    it("for newly minted tag should have last renewed be zero", async function () {
      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);
      assert(Number(lastRenewed.toString()) === 0);
    });

    it("will occur only when token is transferred away from platform", async function() {
      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );
      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);
      let blockNum = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNum);
      let timestamp = block.timestamp;
      // Verify current block timestamp and last renewTime are equal.
      expect(timestamp).to.be.equal(lastRenewed);
    });

    it("is reset when transferred back to platform", async function () {

      // Transfer tag away from platform.
      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );

      // Send back to platform.
      await ETS.connect(accounts.RandomTwo).transferFrom(
        accounts.RandomTwo.address,
        accounts.ETSPlatform.address,
        tokenId
      );

      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);
      assert(Number(lastRenewed) === 0);

    });

    it("will fail if renewer not the owner", async function () {
      // Tag owned by platform.
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).renewTag(tokenId)).to.be.revertedWith(
        "renewTag: Invalid sender",
      );

      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );

      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).renewTag(tokenId)).to.not.be.reverted;

    });

    it("will fail if token does not exist", async function () {
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).renewTag(constants.Two)).to.be.revertedWith(
        "CTAG renew/recycle: Token not found",
      );
    });

    it("can be done before renewal period has passed", async function () {

      // Transfer tag away from platform.
      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );

      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);

      // Advance current time by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastRenewed.add((await ETSLifeCycleControls.ownershipTermLength()) - thirtyDays);

      const advanceTimeNumber = Number(advanceTime.toString());

      await ethers.provider.send("evm_increaseTime", [advanceTimeNumber]);
      await ethers.provider.send("evm_mine");

      // Renew the tag as the new owner.
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).renewTag(tokenId))
        .to.emit(ETSLifeCycleControls, "TagRenewed")
        .withArgs(tokenId, accounts.RandomTwo.address);

      // check renew time has increased
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      let newRenewTime = await ETSLifeCycleControls.getLastRenewed(tokenId);

      expect(newRenewTime).to.be.equal(timestamp);
      // Check that newRenewTime is equal to lastRenewed + 1year + 1microsecond.
      expect(newRenewTime).to.be.equal(Number(lastRenewed) + Number(advanceTime) + 1 || Number(lastRenewed) + Number(advanceTime));
    });

    it("can be done after renewal period has passed", async function () {

      // Transfer tag away from platform.
      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );

      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastRenewed.add((await ETSLifeCycleControls.ownershipTermLength()) + thirtyDays);

      const advanceTimeNumber = Number(advanceTime.toString());

      await ethers.provider.send("evm_increaseTime", [advanceTimeNumber]);
      await ethers.provider.send("evm_mine");

      // Renew the tag as the new owner.
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).renewTag(tokenId))
        .to.emit(ETSLifeCycleControls, "TagRenewed")
        .withArgs(tokenId, accounts.RandomTwo.address);

      // check renew time has increased
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      let newRenewTime = await ETSLifeCycleControls.getLastRenewed(tokenId);

      expect(newRenewTime).to.be.equal(timestamp);
      // Check that newRenewTime is equal to lastRenewed + 1year + 1microsecond.
      expect(newRenewTime).to.be.equal(Number(lastRenewed) + Number(advanceTime) + 1 || Number(lastRenewed) + Number(advanceTime));
    });

  });

  describe("Recycling a tag", async function () {
    let lastRenewed, tokenId;

    beforeEach(async function () {
      const tag = "#BlockRocket";

      // RandomTwo account creates a tag.
      await ETS.connect(accounts.RandomTwo).createTag(tag, accounts.ETSPublisher.address);
      tokenId = await ETS.computeTagId(tag);

      // Transfer to RandomTwo (simulates sale).
      await ETS.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId
      );

    });

    it("will fail if token does not exist", async function () {
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).recycleTag(constants.Two)).to.be.revertedWith(
        "CTAG renew/recycle: Token not found",
      );
    });

    it("will fail if already owned by the platform", async function () {
      // Send back to platform.
      await ETS.connect(accounts.RandomTwo).transferFrom(
        accounts.RandomTwo.address,
        accounts.ETSPlatform.address,
        tokenId
      );
      await expect(ETSLifeCycleControls.connect(accounts.RandomTwo).recycleTag(tokenId)).to.be.revertedWith(
        "ETS: CTAG owned by platform",
      );
    });

    it("will fail if token not not eligible yet", async function () {
      // Advance current blocktime by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = (await ETSLifeCycleControls.ownershipTermLength()) - thirtyDays;
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Attempt to recycle by accounts.RandomTwo address, should fail.
      // Notice non-owner is connected.
      await expect(ETSLifeCycleControls.connect(accounts.RandomOne).recycleTag(tokenId)).to.be.revertedWith(
        "ETS: CTAG not eligible for recycling",
      );
    });

    it("will succeed once renewal period has passed", async function () {

      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastRenewed.add((await ETSLifeCycleControls.ownershipTermLength()) + thirtyDays);
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Now attempt to recycle tag as accountRandomOne address.
      // This is to simulate accountRandomTwo missing their window to renew
      // and accountRandomOne recycling the token.
      await expect(ETS.connect(accounts.RandomOne).recycleTag(tokenId))
        .to.emit(ETS, "TagRecycled")
        .withArgs(tokenId, accounts.RandomOne.address);

      // Recycling tag resets last transfer time to zero.
      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);

      assert(Number(lastRenewed) === 0);
      // platform now once again owns the token
      expect(await ETS.ownerOf(tokenId)).to.be.equal(accounts.ETSPlatform.address);
    });

    it("will increase platform balance and decrease owner balance", async function () {

      expect((await ETS.balanceOf(accounts.ETSPlatform.address)).toString()).to.be.equal("0");
      expect((await ETS.balanceOf(accounts.RandomTwo.address)).toString()).to.be.equal("1");

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      lastRenewed = await ETSLifeCycleControls.getLastRenewed(tokenId);
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastRenewed.add((await ETSLifeCycleControls.ownershipTermLength()) + thirtyDays);
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Recycle the tag as accounts.RandomOne.
      await expect(ETS.connect(accounts.RandomOne).recycleTag(tokenId))
        .to.emit(ETS, "TagRecycled")
        .withArgs(tokenId, accounts.RandomOne.address);

      // Flip balances.
      expect((await ETS.balanceOf(accounts.ETSPlatform.address)).toString()).to.be.equal("1");
      expect((await ETS.balanceOf(accounts.RandomTwo.address)).toString()).to.be.equal("0");
    });

  });
  
});