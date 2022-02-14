const { ethers, upgrades } = require("hardhat");
const { expect, assert } = require("chai");
const { BigNumber, constants } = ethers;

let accounts, factories, ETSAccessControls, ETSTag;

describe("ETSTag Tests", function () {
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
      ETSTag: await ethers.getContractFactory("ETSTag"),
      ETS: await ethers.getContractFactory("ETS"),
    };

    // Deploy the initial proxy contract.
    ETSAccessControls = await upgrades.deployProxy(factories.ETSAccessControls, { kind: "uups" });
    assert((await ETSAccessControls.isAdmin(accounts.ETSAdmin.address)) === true);

    await ETSAccessControls.grantRole(
      await ETSAccessControls.SMART_CONTRACT_ROLE(),
      accounts.ETSAdmin.address,
      { from: accounts.ETSAdmin.address },
    );

    // add a publisher to the protocol
    await ETSAccessControls.grantRole(ethers.utils.id("PUBLISHER"), accounts.ETSPublisher.address);

    // Deploy the initial proxy contract.
    ETSTag = await upgrades.deployProxy(
      factories.ETSTag,
      [ETSAccessControls.address, accounts.ETSPlatform.address],
      { kind: "uups" },
    );
  });

  describe("Validate setup", async function () {
    it("should have name and symbol", async function () {
      expect(await ETSTag.name()).to.be.equal("Ethereum Tag Service");
      expect(await ETSTag.symbol()).to.be.equal("ETSTAG");
      expect(await ETSTag.platform()).to.be.equal(accounts.ETSPlatform.address);
    });
    it("should have default configs", async function () {
      expect(await ETSTag.ownershipTermLength()).to.be.equal("63072000");
    });
  });

  describe("Minting tags", async function () {
    describe("Validation", function () {
      const RandomTwoTag = "asupersupersupersupersuperlongasstag";

      it("should revert if exists (case-insensitive)", async function () {
        await ETSTag.connect(accounts.ETSPublisher).mint(
          "#blockrocket",
          accounts.ETSPublisher.address,
          accounts.Creator.address,
        );

        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            "#BlockRocket",
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith("ERC721: token already minted");
      });

      it("should revert if tag does not meet min length requirements", async function () {
        const tagMinStringLength = await ETSTag.tagMinStringLength();

        const shortTag = "#" + RandomTwoTag.substring(0, tagMinStringLength - 2);
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            shortTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith(`Invalid format: tag does not meet min/max length requirements`);
      });

      it("should revert if tag exceeds max length requirements", async function () {
        const tagMaxStringLength = await ETSTag.tagMaxStringLength();
        const longTag = "#" + RandomTwoTag.substring(0, tagMaxStringLength);
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            longTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith(`Invalid format: tag does not meet min/max length requirements`);
      });

      it("should revert if tag has an invalid character", async function () {
        const invalidTag = "#x_art";
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            invalidTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith("Invalid character found: tag may only contain characters A-Z, a-z, 0-9 and #");
      });

      it("should revert if does not start with #", async function () {
        const invalidTag = "ART";
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            invalidTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith("Must start with #");
      });

      it("should revert if tag present after first char", async function () {
        const invalidTag = "#Hash#";
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            invalidTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith("Invalid character found: tag may only contain characters A-Z, a-z, 0-9 and #");
      });

      it("should revert if the tag does not have a single alpha char", async function () {
        const invalidTag = "#420";
        await expect(
          ETSTag.connect(accounts.ETSPublisher).mint(
            invalidTag,
            accounts.ETSPublisher.address,
            accounts.Creator.address,
          ),
        ).to.be.revertedWith("Invalid format: tag must contain at least 1 alphabetic character.");
      });

      it("should allow a mix of upper and lowercase characters", async function () {
        await ETSTag.connect(accounts.ETSPublisher).mint(
          "#Awesome123",
          accounts.ETSPublisher.address,
          accounts.Creator.address,
        );
      });
    });

    it("should mint", async function () {
      expect(await ETSTag.tokenPointer()).to.be.equal("0");

      const tag = "#BlockRocket";
      const lowerTag = "#blockrocket";

      await ETSTag.connect(accounts.RandomTwo).mint(
        tag,
        accounts.ETSPublisher.address,
        accounts.Creator.address,
      );

      expect(await ETSTag.tokenPointer()).to.be.equal("1");
      expect(await ETSTag.tagToTokenId(lowerTag)).to.be.equal("1");
      expect(await ETSTag.exists(BigNumber.from("1"))).to.be.true;

      const tagData = await ETSTag.tokenIdToTag("1");
      expect(tagData.displayVersion.toLowerCase()).to.be.equal(lowerTag);
      expect(tagData.displayVersion).to.be.equal(tag);
      expect(tagData.originalPublisher).to.be.equal(accounts.ETSPublisher.address);
      expect(tagData.creator).to.be.equal(accounts.Creator.address);
    });

    it("should mint from owner without fee", async function () {
      await ETSTag.connect(accounts.ETSPlatform);

      expect(await ETSTag.tokenPointer()).to.be.equal("0");

      await ETSTag.mint("#blockrocket", accounts.ETSPublisher.address, accounts.Creator.address);

      expect(await ETSTag.tokenPointer()).to.be.equal("1");
      expect(await ETSTag.tagToTokenId("#blockrocket")).to.be.equal("1");
      const tagData = await ETSTag.tokenIdToTag("1");

      expect(tagData.displayVersion.toLowerCase()).to.be.equal("#blockrocket");
      expect(tagData.originalPublisher).to.be.equal(accounts.ETSPublisher.address);
    });

    it("should revert if the publisher is not whitelisted", async function () {
      await expect(
        ETSTag.connect(accounts.ETSPlatform).mint(
          "#blockrocket",
          accounts.RandomTwo.address,
          accounts.Creator.address,
        ),
      ).to.be.revertedWith("Mint: The publisher must be whitelisted");
    });
  });

  describe("Platform", async function () {
    it("should be able to set platform as owner", async function () {
      expect(await ETSTag.platform()).to.be.equal(accounts.ETSPlatform.address);

      await ETSTag.connect(accounts.ETSAdmin).setPlatform(accounts.RandomOne.address);

      expect(await ETSTag.platform()).to.be.equal(accounts.RandomOne.address);
    });

    it("should revert if not owner", async function () {
      await expect(ETSTag.connect(accounts.Buyer).setPlatform(accounts.RandomOne.address)).to.be.revertedWith(
        "Caller must have administrator access",
      );
    });

    it("should update access controls", async function () {
      await ETSTag.connect(accounts.ETSAdmin).updateAccessControls(accounts.RandomTwo.address);
      expect(await ETSTag.accessControls()).to.be.equal(accounts.RandomTwo.address);

      await expect(ETSTag.connect(accounts.RandomTwo).updateAccessControls(accounts.RandomTwo.address)).to.be
        .reverted;
    });

    it("should revert when updating access controls to zero address", async function () {
      await expect(
        ETSTag.connect(accounts.ETSAdmin).updateAccessControls(constants.AddressZero),
      ).to.be.revertedWith("ETSTag.updateAccessControls: Cannot be zero");
    });
  });

  describe("Metadata", async function () {
    it("should return tokenUri", async function () {
      const tokenId = constants.One;
      await ETSTag.connect(accounts.RandomTwo).mint(
        "#BlockRocket",
        accounts.ETSPublisher.address,
        accounts.Creator.address,
      );

      expect(await ETSTag.tokenURI(tokenId)).to.be.equal("https://api.hashtag-protocol.io/1");

      await ETSTag.connect(accounts.ETSAdmin).setBaseURI("hashtag.io/");

      expect(await ETSTag.tokenURI(tokenId)).to.be.equal(`hashtag.io/${tokenId}`);
    });
  });

  describe("renewing a tag", async function () {
    let lastTransferTime;
    const tokenId = constants.One;
    beforeEach(async function () {
      await ETSTag.connect(accounts.RandomTwo).mint(
        "#BlockRocket",
        accounts.ETSPublisher.address,
        accounts.Creator.address,
      );

      // This sets the last transfer time for all tests to now
      // accounts.ETSPlatform is owner of new tags.
      await ETSTag.connect(accounts.ETSPlatform).renewTag(tokenId);
      lastTransferTime = await ETSTag.tokenIdToLastTransferTime(tokenId);
    });

    it("will fail if not the owner", async function () {
      await expect(ETSTag.connect(accounts.RandomTwo).renewTag(tokenId)).to.be.revertedWith(
        "renewTag: Invalid sender",
      );
    });

    it("will fail if token does not exist", async function () {
      await expect(ETSTag.connect(accounts.RandomTwo).renewTag(constants.Two)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token",
      );
    });

    it("can be reset before renewal period has passed", async function () {
      const lastRenewTime = Number(lastTransferTime.toString());

      let blockNum = await ethers.provider.getBlockNumber();
      let block = await ethers.provider.getBlock(blockNum);
      let timestamp = block.timestamp;

      // Verify current block timestamp and last renewTime are equal.
      expect(timestamp).to.be.equal(lastRenewTime);

      // Advance current time by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add((await ETSTag.ownershipTermLength()) - thirtyDays);

      advanceTime = Number(advanceTime.toString());

      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Renew the tag again.
      await expect(ETSTag.connect(accounts.ETSPlatform).renewTag(tokenId))
        .to.emit(ETSTag, "TagRenewed")
        .withArgs(tokenId, accounts.ETSPlatform.address);

      // check timestamp has increased
      blockNum = await ethers.provider.getBlockNumber();
      block = await ethers.provider.getBlock(blockNum);
      timestamp = block.timestamp;

      let newRenewTime = await ETSTag.tokenIdToLastTransferTime(tokenId);

      newRenewTime = Number(newRenewTime.toString());
      expect(newRenewTime).to.be.equal(timestamp);
      // Check that newRenewTime is equal to lastRenewTime + 1year + 1microsecond.
      expect(newRenewTime).to.be.equal(lastRenewTime + advanceTime + 1 || lastRenewTime + advanceTime);
    });

    it("once reset, last transfer time reset", async function () {
      // increase by 2 years and 30 days
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add((await ETSTag.ownershipTermLength()) + thirtyDays);
      advanceTime = Number(advanceTime.toString());
      // Advance current block time by ownership length (2 years) + 1 day.
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");
      // Renew the HASHTAG token.
      await expect(ETSTag.connect(accounts.ETSPlatform).renewTag(tokenId))
        .to.emit(ETSTag, "TagRenewed")
        .withArgs(tokenId, accounts.ETSPlatform.address);
      let newRenewTime = await ETSTag.tokenIdToLastTransferTime(tokenId);
      newRenewTime = Number(newRenewTime.toString());
      const lastRenewTime = Number(lastTransferTime.toString());
      // There seems to be a 1 microsecond variance depending on whether test is
      // run locally or up on Github using test runner. Probably a better way to deal with this...
      expect(newRenewTime).to.be.equal(lastRenewTime + advanceTime + 1 || lastRenewTime + advanceTime);
    });
  });
  //
  describe("Admin functions", async function () {
    it("should be able to set max tag length as admin", async function () {
      expect(await ETSAccessControls.isAdmin(accounts.ETSAdmin.address)).to.be.equal(true);

      const currentMaxLength = await ETSTag.tagMaxStringLength();
      expect(currentMaxLength).to.be.equal(32);

      await ETSTag.connect(accounts.ETSAdmin).setTagMaxStringLength(64);

      const newMaxLength = await ETSTag.tagMaxStringLength();
      expect(newMaxLength).to.be.equal(64);
    });

    it("should revert if setting max tag length if not admin", async function () {
      await expect(ETSTag.connect(accounts.Buyer).setTagMaxStringLength(55)).to.be.revertedWith(
        "Caller must have administrator access",
      );
    });
  });

  describe("Recycling a tag", async function () {
    let lastTransferTime;
    const tokenId = constants.One;
    beforeEach(async function () {
      await ETSTag.connect(accounts.RandomTwo).mint(
        "#BlockRocket",
        accounts.ETSPublisher.address,
        accounts.Creator.address,
      );

      // This sets the last transfer time for all tests to now
      // accounts.ETSPlatform is owner of new tags.
      await ETSTag.connect(accounts.ETSPlatform).renewTag(tokenId);
      lastTransferTime = await ETSTag.tokenIdToLastTransferTime(tokenId);
    });

    it("will fail if token does not exist", async function () {
      await expect(ETSTag.connect(accounts.RandomTwo).recycleTag(constants.Two)).to.be.revertedWith(
        "recycleTag: Invalid token ID",
      );
    });

    it("will fail if already owned by the platform", async function () {
      await expect(ETSTag.connect(accounts.ETSPlatform).recycleTag(tokenId)).to.be.revertedWith(
        "recycleTag: Tag already owned by the platform",
      );
    });

    it("will fail if token not not eligible yet", async function () {
      // Transfer the token to a accounts.RandomTwo owner.
      await ETSTag.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId,
      );

      // Advance current blocktime by 30 days less than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = (await ETSTag.ownershipTermLength()) - thirtyDays;
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Attempt to recycle by accounts.RandomTwo address, should fail.
      await expect(ETSTag.connect(accounts.RandomTwo).recycleTag(tokenId)).to.be.revertedWith(
        "recycleTag: Token not eligible for recycling yet",
      );
    });

    it("will succeed once renewal period has passed", async function () {
      // Transfer HASHTAG to accounts.RandomTwo address, simulating ownership.
      await ETSTag.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId,
      );

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add((await ETSTag.ownershipTermLength()) + thirtyDays);
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Now attempt to recycle tag as accountRandomOne address.
      // This is to simulate owner missing their window to recycle
      // and accountRandomOne perspective owner wanting to recycle the token.
      await expect(ETSTag.connect(accounts.RandomOne).recycleTag(tokenId))
        .to.emit(ETSTag, "TagRecycled")
        .withArgs(tokenId, accounts.RandomOne.address);

      // check timestamp has increased
      const newTransferTime = await ETSTag.tokenIdToLastTransferTime(tokenId);

      expect(Number(BigNumber.from(newTransferTime))).to.be.greaterThan(Number(lastTransferTime.toString()));
      // platform now once again owns the token
      expect(await ETSTag.ownerOf(tokenId)).to.be.equal(accounts.ETSPlatform.address);
    });

    it("when being recycled to the platform, the platforms balance increases and the owners balance decreases", async function () {
      expect((await ETSTag.balanceOf(accounts.ETSPlatform.address)).toString()).to.be.equal("1");

      // Transfer HASHTAG to accounts.RandomTwo address.
      await ETSTag.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.RandomTwo.address,
        tokenId,
      );

      expect((await ETSTag.balanceOf(accounts.ETSPlatform.address)).toString()).to.be.equal("0");
      expect((await ETSTag.balanceOf(accounts.RandomTwo.address)).toString()).to.be.equal("1");

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastTransferTime.add((await ETSTag.ownershipTermLength()) + thirtyDays);
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      // Recycle the tag as current owner.
      await expect(ETSTag.connect(accounts.RandomTwo).recycleTag(tokenId))
        .to.emit(ETSTag, "TagRecycled")
        .withArgs(tokenId, accounts.RandomTwo.address);

      // Check that transfer time has increased
      const newTransferTime = await ETSTag.tokenIdToLastTransferTime(tokenId);
      expect(Number(BigNumber.from(newTransferTime))).to.be.greaterThan(Number(lastTransferTime.toString()));

      // both balances back to zero
      expect((await ETSTag.balanceOf(accounts.ETSPlatform.address)).toString()).to.be.equal("1");
      expect((await ETSTag.balanceOf(accounts.RandomTwo.address)).toString()).to.be.equal("0");
    });
  });
});
