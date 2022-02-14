const { expectEvent } = require("@openzeppelin/test-helpers");

const { ethers, upgrades, artifacts } = require("hardhat");
const { expect, assert } = require("chai");

const { utils, constants } = ethers;

let accounts, factories, artifact, ETSAccessControls, ETSTag, ETS, ERC721Mock;
let taggingFee, platformPercentage, publisherPercentage, taggerPercentage;

describe("ETS", function () {
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
      Tagger: unnamedAccounts[4],
    };

    factories = {
      ETSAccessControls: await ethers.getContractFactory("ETSAccessControls"),
      ETSTag: await ethers.getContractFactory("ETSTag"),
      ETS: await ethers.getContractFactory("ETS"),
      ERC721BurnableMock: await ethers.getContractFactory("ERC721BurnableMock"),
    };

    artifact = {
      ETS: await artifacts.readArtifactSync("ETS"),
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

    ETS = await upgrades.deployProxy(
      factories.ETS,
      [ETSAccessControls.address, ETSTag.address],
      { kind: "uups" },
    );

    ERC721Mock = await factories.ERC721BurnableMock.deploy("NFT", "NFT");
    await ERC721Mock.deployed();

    // Fetch tags fee
    taggingFee = await ETS.taggingFee();
    taggingFee = taggingFee.toString();

    platformPercentage = await ETS.platformPercentage();
    platformPercentage = platformPercentage.toString();

    publisherPercentage = await ETS.publisherPercentage();
    publisherPercentage = publisherPercentage.toString();

    taggerPercentage = await ETS.remainingPercentage();
    taggerPercentage = taggerPercentage.toString();

    // Set permitted target NFT chain id.
    await ETS.setPermittedNftChainId(constants.One, true);

    // Mint a HASHTAG token for tagging.
    await ETSTag.mint("#kittypower", accounts.ETSPublisher.address, accounts.Tagger.address);
    //await ETSTag.hashtagToTokenId("#kittypower");

    // Mint two target nfts.
    const nftOneId = constants.One;
    const nftTwoId = constants.Two;
    await ERC721Mock.mint(accounts.RandomOne.address, nftOneId); //#1
    await ERC721Mock.mint(accounts.RandomOne.address, nftTwoId); //#2
  });

  describe("Validate setup", function () {
    describe("Initial state", async function () {
      it("should have total tags of zero", async function () {
        expect(await ETS.taggingCounter()).to.be.equal("0");
      });

      it("should have Eth mainnet (chain id 1) permitted", async function () {
        expect((await ETS.getPermittedNftChainId(1)) == true);
      });

      it("should have Polygon mainnet (chain id 137) not permitted", async function () {
        expect((await ETS.getPermittedNftChainId(137)) == false);
      });
    });
  });

  describe("Only addresses with Admin access", async function () {
    it("can set tag fee", async function () {
      expect(await ETS.taggingFee()).to.be.equal(taggingFee);
      await ETS.connect(accounts.ETSAdmin).setTaggingFee(utils.parseEther("1"));
      expect(await ETS.taggingFee()).to.be.equal(utils.parseEther("1"));

      await expect(ETS.connect(accounts.RandomTwo).setTaggingFee(utils.parseEther("1"))).to.be.reverted;
    });

    it("should update access controls", async function () {
      await ETS.connect(accounts.ETSAdmin).updateAccessControls(accounts.RandomTwo.address);
      expect(await ETS.accessControls()).to.be.equal(accounts.RandomTwo.address);

      await expect(ETS.connect(accounts.RandomTwo).updateAccessControls(accounts.RandomTwo.address))
        .to.be.reverted;
    });

    it("should revert when updating access controls to zero address", async function () {
      await expect(
        ETS.connect(accounts.ETSAdmin).updateAccessControls(constants.AddressZero),
      ).to.be.revertedWith("ETS.updateAccessControls: Cannot be zero");
    });
  });

  describe("Tagging", async function () {
    it("should be able to mint and tag", async function () {
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;

      // Try tagging with a new tag.
      const receipt = await ETS.connect(accounts.Tagger).tag(
        "#macbook",
        ERC721Mock.address,
        targetNftId,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      await expectEvent.inTransaction(receipt.hash, artifact.ETS, "TargetTagged", {
        taggingId: constants.One,
      });

      expect(await ETS.taggingCounter()).to.be.equal(1);

      const {
        _etsTagId,
        _nftContract,
        _nftId,
        _tagger,
        _timestamp,
        _publisher,
        _nftChainId,
      } = await ETS.getTaggingRecord(constants.One);

      // The newly minted ETSTAG should have id = 2
      // because ETSTAG #1 was minted in the setup script.
      expect(_etsTagId).to.be.equal(constants.Two);
      expect(_nftContract).to.be.equal(ERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accounts.Tagger.address);
      expect(_timestamp).to.exist;
      expect(Number(_timestamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accounts.ETSPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // Check accrued values
      // Only one tag event happened, so it's tagging fee/participant %
      expect(await ETS.accrued(accounts.ETSPublisher.address)).to.be.equal(
        taggingFee * (publisherPercentage / 100),
      );
      expect(await ETS.accrued(accounts.ETSPlatform.address)).to.be.equal(
        taggingFee * (platformPercentage / 100),
      );
      expect(await ETS.accrued(accounts.Tagger.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );
    });

    it("should be able to tag a cryptokittie with #kittypower (pre-auction of #kittypower)", async function () {
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;
      const tagId = constants.One; // the id of the tagging event.

      const receipt = await ETS.connect(accounts.Tagger).tag(
        "#kittypower",
        ERC721Mock.address,
        targetNftId,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      await expectEvent.inTransaction(receipt.hash, artifact.ETS, "TargetTagged", {
        taggingId: constants.One,
      });

      expect(await ETS.taggingCounter()).to.be.equal(1);

      const {
        _etsTagId,
        _nftContract,
        _nftId,
        _tagger,
        _timestamp,
        _publisher,
        _nftChainId,
      } = await ETS.getTaggingRecord(tagId);

      expect(_etsTagId).to.be.equal(constants.One);
      expect(_nftContract).to.be.equal(ERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accounts.Tagger.address);
      expect(_timestamp).to.exist;
      expect(Number(_timestamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accounts.ETSPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await ETS.accrued(accounts.ETSPublisher.address)).to.be.equal(
        taggingFee * (publisherPercentage / 100),
      );
      expect(await ETS.accrued(accounts.ETSPlatform.address)).to.be.equal(
        taggingFee * (platformPercentage / 100),
      );
      expect(await ETS.accrued(accounts.Tagger.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );
    });

    it("should be able to tag a Polygon NFT with #kittycat (pre-auction of #kittycat)", async function () {
      // Attempt to tag this actual Matic NFT
      // https://opensea.io/assets/matic/0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3/9268
      const targetNftAddress = utils.getAddress("0xd5a5ddd6f4e7d839db2978e8a4ee9923ac088cb3");
      const targetNftId = "9368";
      const matic = "137";

      // Permit tagging of assets on chain id 137.
      await ETS.connect(accounts.ETSAdmin).setPermittedNftChainId(matic, true);
      expect((await ETS.getPermittedNftChainId(matic)) == true);

      const receipt = await ETS.connect(accounts.Tagger).tag(
        "#kittypower",
        targetNftAddress,
        targetNftId,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        matic,
        { value: taggingFee },
      );

      await expectEvent.inTransaction(receipt.hash, artifact.ETS, "TargetTagged", {
        taggingId: constants.One,
      });
    });

    it("should be able to tag a cryptokittie on mainnet with #kittypower (pre and post auction of #kittypower)", async function () {
      const targetNftChainId = constants.One;
      const targetNftId = constants.One;

      // Tag pre auction and make sure that accrued values are correct
      await ETS.connect(accounts.Tagger).tag(
        "#kittypower",
        ERC721Mock.address,
        targetNftId,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      expect(await ETS.taggingCounter()).to.be.equal(1);

      const {
        _etsTagId,
        _nftContract,
        _nftId,
        _tagger,
        _timestamp,
        _publisher,
        _nftChainId,
      } = await ETS.getTaggingRecord(constants.One);

      expect(_etsTagId).to.be.equal(constants.One);
      expect(_nftContract).to.be.equal(ERC721Mock.address);
      expect(_nftId).to.be.equal(targetNftId);
      expect(_tagger).to.be.equal(accounts.Tagger.address);
      expect(_timestamp).to.exist;
      expect(Number(_timestamp.toString())).to.be.gt(0);
      expect(_publisher).to.be.equal(accounts.ETSPublisher.address);
      expect(_nftChainId).to.be.equal(targetNftChainId);

      // check accrued values
      expect(await ETS.accrued(accounts.ETSPublisher.address)).to.be.equal(
        taggingFee * (publisherPercentage / 100),
      );
      expect(await ETS.accrued(accounts.ETSPlatform.address)).to.be.equal(
        taggingFee * (platformPercentage / 100),
      );
      expect(await ETS.accrued(accounts.Tagger.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );
    });

    it("should be able to tag a cryptokittie on mainnet with #kittycat (pre and post auction of #kittycat)", async function () {
      // Tag pre auction and make sure that accrued values are correct
      const targetNftId = constants.One;
      const targetNftChainId = constants.One;

      // Tag targetNft #1.
      await ETS.connect(accounts.Tagger).tag(
        "#kittypower",
        ERC721Mock.address,
        targetNftId,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      expect(await ETS.taggingCounter()).to.be.equal(1);

      // check accrued values
      expect(await ETS.accrued(accounts.ETSPublisher.address)).to.be.equal(
        taggingFee * (publisherPercentage / 100),
      );
      expect(await ETS.accrued(accounts.ETSPlatform.address)).to.be.equal(
        taggingFee * (platformPercentage / 100),
      );
      expect(await ETS.accrued(accounts.Tagger.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );

      // Transfer #kittypower to accountBuyer. Simulates purchase.
      await ETSTag.connect(accounts.ETSPlatform).transferFrom(
        accounts.ETSPlatform.address,
        accounts.Buyer.address,
        constants.One,
      );

      // Tag targetNFT #2 with #kittypower.
      const targetNftTwo = constants.Two;
      await ETS.connect(accounts.Tagger).tag(
        "#kittypower",
        ERC721Mock.address,
        targetNftTwo,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      expect(await ETS.taggingCounter()).to.be.equal(2);

      // Now check accrued for all players. Publisher 2x tags, Platform 2x tags,
      // accounts.Tagger and accountBuyer 1x tag each.
      expect(await ETS.totalDue(accounts.ETSPublisher.address)).to.be.equal(
        2 * (taggingFee * (publisherPercentage / 100)),
      );
      expect(await ETS.totalDue(accounts.ETSPlatform.address)).to.be.equal(
        2 * (taggingFee * (platformPercentage / 100)),
      );
      expect(await ETS.totalDue(accounts.Tagger.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );
      expect(await ETS.totalDue(accounts.Buyer.address)).to.be.equal(
        taggingFee * (taggerPercentage / 100),
      );
    });

    it("mints new tag when it does not exist", async function () {
      const targetNftChainId = constants.One;
      const targetNftId = constants.One;

      const receipt = await ETS.connect(accounts.ETSPublisher).tag(
        "#unknowntag", // Non-existent tag
        ERC721Mock.address,
        constants.One,
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        targetNftChainId,
        { value: taggingFee },
      );

      await expectEvent.inTransaction(receipt.hash, artifact.ETS, "TargetTagged", {
        taggingId: constants.One,
      });
    });

    it("Reverts when new tag is invalid.", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.tag(
          "#bad hashtag",
          ETSTag.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Invalid character found: tag may only contain characters A-Z, a-z, 0-9 and #");
    });

    it("Reverts when target NFT is ETSTAG token.", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.tag(
          "#kittypower",
          ETSTag.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tagging other tags is not permitted");
    });

    it("Reverts when missing tagging fee during mint and tag.", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.mintAndTag(
          "#hello",
          ERC721Mock.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Mint and tag: You must send the tag fee");
    });

    it("Reverts when missing tagging fee during tagging", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.tag(
          "#kittypower",
          ERC721Mock.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          targetNftChainId,
        ),
      ).to.be.revertedWith("Tag: You must send the fee");
    });

    it("Reverts when non-whitelisted publisher attempts mint and tag", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.mintAndTag(
          "#hullo",
          ERC721Mock.address,
          constants.One,
          accounts.RandomOne.address, // Non publisher account.
          accounts.Tagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Mint and tag: The publisher must be whitelisted");
    });

    it("Reverts when non-whitelisted publisher attempts tagging", async function () {
      const targetNftChainId = constants.One;

      await expect(
        ETS.tag(
          "#kittypower",
          ERC721Mock.address,
          constants.One,
          accounts.RandomOne.address,
          accounts.Tagger.address,
          targetNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: The publisher must be whitelisted");
    });

    it("Reverts when target chain id is not permitted when mint and tagging", async function () {
      const nonPermittedNftChainId = 5;

      await expect(
        ETS.mintAndTag(
          "#hullo",
          ERC721Mock.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          nonPermittedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Mint and tag: Tagging target chain not permitted");
    });

    it("Reverts when target chain id is not permitted during tagging", async function () {
      const nonPermittedNftChainId = 5;

      await expect(
        ETS.tag(
          "#kittypower",
          ERC721Mock.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          nonPermittedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });

    it("Reverts when previously permitted target chain id is no longer permitted", async function () {
      const revertedNftChainId = 1;

      await ETS.connect(accounts.ETSAdmin).setPermittedNftChainId(revertedNftChainId, false);
      expect((await ETS.getPermittedNftChainId(revertedNftChainId)) == false);

      await expect(
        ETS.tag(
          "#kittypower",
          ERC721Mock.address,
          constants.One,
          accounts.ETSPublisher.address,
          accounts.Tagger.address,
          revertedNftChainId,
          { value: taggingFee },
        ),
      ).to.be.revertedWith("Tag: Tagging target chain not permitted");
    });
  });

  describe("Drawing down", async function () {
    beforeEach(async function () {
      await ETS.connect(accounts.Tagger).tag(
        "#macbook",
        ERC721Mock.address, // Target nft contract
        constants.One, // Target nft id
        accounts.ETSPublisher.address,
        accounts.Tagger.address,
        constants.One, // Target chain id.
        { value: taggingFee },
      );
    });

    it("Can draw down on behalf of the platform", async function () {
      // Account A can draw down accumulated funds of
      // Account B to wallet of Account B.

      const platformBalanceBefore = await accounts.ETSPlatform.getBalance();

      // accountRandomOne is triggering the drawdown of ETH accrued in
      // accounts.ETSPlatform.
      await ETS.connect(accounts.RandomOne).drawDown(accounts.ETSPlatform.address);
      const platformBalanceAfter = await accounts.ETSPlatform.getBalance();

      // In this case we are expecting the value drawn down to be the
      // platform percentage cut of one tagging event.
      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(taggingFee * (platformPercentage / 100));
    });

    it("Can draw down as the platform", async function () {
      const platformBalanceBefore = await accounts.ETSPlatform.getBalance();
      await ETS.connect(accounts.RandomOne).drawDown(accounts.ETSPlatform.address);
      const platformBalanceAfter = await accounts.ETSPlatform.getBalance();
      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(taggingFee * (platformPercentage / 100));
    });

    it("Does nothing after a double draw down", async function () {
      const platformBalanceBefore = await accounts.ETSPlatform.getBalance();
      await ETS.connect(accounts.RandomOne).drawDown(accounts.ETSPlatform.address);
      const platformBalanceAfter = await accounts.ETSPlatform.getBalance();

      expect(platformBalanceAfter.sub(platformBalanceBefore)).to.be.equal(taggingFee * (platformPercentage / 100));

      const balanceBeforeSecondDraw = await accounts.ETSPlatform.getBalance();
      await ETS.connect(accounts.RandomOne).drawDown(accounts.ETSPlatform.address);
      const balanceAfterSecondDraw = await accounts.ETSPlatform.getBalance();

      expect(balanceAfterSecondDraw.sub(balanceBeforeSecondDraw)).to.be.equal("0");
    });
  });

  describe("Updating percentages", async function () {
    it("Reverts if not admin", async function () {
      await expect(ETS.connect(accounts.Tagger).updatePercentages(10, 10)).to.be.revertedWith(
        "Caller must be admin",
      );
    });

    it("Reverts if greater than 100", async function () {
      await expect(ETS.connect(accounts.ETSAdmin).updatePercentages(90, 11)).to.be.revertedWith(
        "ETS.updatePercentages: percentages must not be over 100",
      );
    });

    it("With correct credentials can update percentages", async function () {
      await ETS.connect(accounts.ETSAdmin).updatePercentages(30, 20);

      expect(await ETS.platformPercentage()).to.be.equal(30);
      expect(await ETS.publisherPercentage()).to.be.equal(20);
      expect(await ETS.remainingPercentage()).to.be.equal(50);
    });

    
  });
});
