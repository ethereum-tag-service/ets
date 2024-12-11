const { setup } = require("./setup.js");
const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

// Auction settings
// initSettings.TIME_BUFFER = 10 * 60; // 10 minutes
// initSettings.RESERVE_PRICE = 200; // 200 WEI
// initSettings.MIN_INCREMENT_BID_PERCENTAGE = 5;
// DURATION = 30 * 60; // 30 minutes
// RELAYER_PERCENTAGE = 20;
// CREATOR_PERCENTAGE = 40;
// PLATFORM_PERCENTAGE = 40;

describe("ETS Auction House Tests", () => {
  // we create a setup function that can be called by every test and setup variable for easy to read tests
  beforeEach("Setup test", async () => {
    [accounts, contracts, initSettings] = await setup();

    await contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).unpause();
    // Mint a tag by random user. ETS is Relayer, retained by platform.
    etsOwnedTag = "#LOVE";
    await contracts.ETS.connect(accounts.ETSPlatform).createTag(etsOwnedTag, accounts.RandomTwo.address);
    etsOwnedTagId = await contracts.ETSToken.computeTagId(etsOwnedTag);
    etsOwnedTagId = etsOwnedTagId.toString();

    etsOwnedTag2 = "#HATE";
    await contracts.ETS.connect(accounts.ETSPlatform).createTag(etsOwnedTag2, accounts.RandomTwo.address);
    etsOwnedTagId2 = await contracts.ETSToken.computeTagId(etsOwnedTag2);
    etsOwnedTagId2 = etsOwnedTagId2.toString();

    // Mint a tag and transfer away from platform.
    userOwnedTag = "#Incredible";
    await contracts.ETS.connect(accounts.ETSPlatform).createTag(userOwnedTag, accounts.RandomTwo.address);
    userOwnedTagId = await contracts.ETSToken.computeTagId(userOwnedTag);
    userOwnedTagId = userOwnedTagId.toString();

    await contracts.ETSToken.connect(accounts.ETSPlatform).transferFrom(
      accounts.ETSPlatform.address,
      accounts.RandomTwo.address,
      userOwnedTagId,
    );
  });

  describe("Valid test setup", async () => {
    it("should have the right stuff", async () => {
      expect(await contracts.ETSToken.name()).to.be.equal("Ethereum Tag Service");
      expect(await contracts.ETSToken.symbol()).to.be.equal("CTAG");
      expect(await contracts.ETSToken.tagExistsById(etsOwnedTagId)).to.be.equal(true);
      const owner = await contracts.ETSToken.ownerOf(userOwnedTagId);
      assert(owner === accounts.RandomTwo.address);
      const maxAuctions = await contracts.ETSAuctionHouse.maxAuctions();
      const activeAuctions = await contracts.ETSAuctionHouse.getActiveCount();
      const totalAuctions = await contracts.ETSAuctionHouse.getTotalCount();
      assert(maxAuctions === BigInt(1));
      assert(activeAuctions === BigInt(0));
      assert(totalAuctions === BigInt(0));
    });

    it("should revert if a second initialization is attempted", async () => {
      const tx = contracts.ETSAuctionHouse.initialize(
        await contracts.ETSToken.getAddress(),
        await contracts.ETSAccessControls.getAddress(),
        await contracts.WMATIC.getAddress(),
        initSettings.MAX_AUCTIONS,
        initSettings.TIME_BUFFER,
        initSettings.RESERVE_PRICE,
        initSettings.MIN_INCREMENT_BID_PERCENTAGE,
        initSettings.DURATION,
        initSettings.RELAYER_PERCENTAGE,
        initSettings.PLATFORM_PERCENTAGE,
      );
      await expect(tx).to.be.revertedWith("Initializable: contract is already initialized");
    });
  });

  describe("Only administrators", async () => {
    it("can pause & unpause the auction", async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).pause()).to.be.revertedWith(
        "Caller must be administrator",
      );

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).pause())
        .to.emit(contracts.ETSAuctionHouse, "Paused")
        .withArgs(accounts.ETSAdmin.address);

      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).unpause()).to.be.revertedWith(
        "Caller must be administrator",
      );

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).unpause())
        .to.emit(contracts.ETSAuctionHouse, "Unpaused")
        .withArgs(accounts.ETSAdmin.address);
    });

    it("can set max auctions", async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).setMaxAuctions(1000)).to.be.revertedWith(
        "Caller must be administrator",
      );

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).setMaxAuctions(1000))
        .to.emit(contracts.ETSAuctionHouse, "AuctionsMaxSet")
        .withArgs(1000);
    });

    it("can set the reserve price", async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).setReservePrice(1000)).to.be.revertedWith(
        "Caller must be administrator",
      );

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).setReservePrice(1000))
        .to.emit(contracts.ETSAuctionHouse, "AuctionReservePriceSet")
        .withArgs(1000);
    });

    it("can set the auction proceed percentages", async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).setProceedPercentages(25, 25),
      ).to.be.revertedWith("Caller must be administrator");

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).setProceedPercentages(25, 25))
        .to.emit(contracts.ETSAuctionHouse, "AuctionProceedPercentagesSet")
        .withArgs(25, 25, 50);
    });

    it("can set the auction time buffer", async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).setTimeBuffer(10)).to.be.revertedWith(
        "Caller must be administrator",
      );

      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).setTimeBuffer(10))
        .to.emit(contracts.ETSAuctionHouse, "AuctionTimeBufferSet")
        .withArgs(10);
    });
  });

  describe("Creating auctions", async () => {
    it("should revert when auction house is paused", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).pause();
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).createNextAuction()).to.be.revertedWith(
        "Pausable: paused",
      );
    });

    it("should revert when no slots are available", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).setMaxAuctions(0);
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).createNextAuction()).to.be.revertedWith(
        "No open auction slots",
      );
    });

    it('should emit "RequestCreateAuction"', async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).createNextAuction()).to.emit(
        contracts.ETSAuctionHouse,
        "RequestCreateAuction",
      );
    });

    it("should revert when fulfillRequestCreateAuction is not called by AuctionOracle", async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).fulfillRequestCreateAuction(etsOwnedTagId),
      ).to.be.revertedWith("Caller not auction oracle");
    });

    it('should emit "AuctionCreated"', async () => {
      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId))
        .to.emit(contracts.ETSAuctionHouse, "AuctionCreated")
        .withArgs(1, etsOwnedTagId, 1);
    });

    it("should increment the activeActions and auctionId counter", async () => {
      let activeAuctions = await contracts.ETSAuctionHouse.getActiveCount();
      let totalAuctions = await contracts.ETSAuctionHouse.getTotalCount();
      assert(activeAuctions === BigInt(0));
      assert(totalAuctions === BigInt(0));

      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);

      activeAuctions = await contracts.ETSAuctionHouse.getActiveCount();
      totalAuctions = await contracts.ETSAuctionHouse.getTotalCount();
      assert(activeAuctions === BigInt(1));
      assert(totalAuctions === BigInt(1));
    });

    it("should revert when max auctions is met", async () => {
      const maxAuctions = await contracts.ETSAuctionHouse.maxAuctions();
      assert(maxAuctions === BigInt(1));

      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId2),
      ).to.be.revertedWith("No open auction slots");
    });

    it("should revert when if active token auction exists", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).setMaxAuctions(2);
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId),
      ).to.be.revertedWith("Auction exists");
    });

    it("should revert if platform doesn't own token", async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(userOwnedTagId),
      ).to.be.revertedWith("CTAG not owned by ETS");
    });

    it("should revert if token doesn't exist", async () => {
      const badTokenId = await contracts.ETSToken.computeTagId("#badTokenId");
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(badTokenId),
      ).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Re-auctioning a tag", async () => {
    beforeEach(async () => {
      // Create an auction.
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);

      // Create bid
      const bid = ethers.parseUnits(initSettings.RESERVE_PRICE, "ether");
      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, { value: bid });

      // end auction.
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);

      // settle auction
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1);
      assert((await contracts.ETSToken.ownerOf(etsOwnedTagId)) === accounts.RandomTwo.address);

      // expire token
      lastRenewed = await contracts.ETSToken.getLastRenewed(etsOwnedTagId);

      // Advance current time by 30 days more than ownershipTermLength (2 years).
      const thirtyDays = 30 * 24 * 60 * 60;
      let advanceTime = lastRenewed + ((await contracts.ETSToken.ownershipTermLength()) + BigInt(thirtyDays));
      advanceTime = Number(advanceTime.toString());
      await ethers.provider.send("evm_increaseTime", [advanceTime]);
      await ethers.provider.send("evm_mine");

      expect((await contracts.ETSToken.tagOwnershipTermExpired(etsOwnedTagId)) === true);
    });

    it('should revert with "CTAG not owned by ETS" if token has not been recycled.', async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(userOwnedTagId),
      ).to.be.revertedWith("CTAG not owned by ETS");
    });

    it('should emit "AuctionCreated" with correct auction numbers.', async () => {
      // Recycle the token. Any wallet can recycle.
      await expect(contracts.ETSToken.connect(accounts.RandomOne).recycleTag(etsOwnedTagId))
        .to.emit(contracts.ETSToken, "TagRecycled")
        .withArgs(etsOwnedTagId, accounts.RandomOne.address);

      // Recycling tag resets last transfer time to zero.
      lastRenewed = await contracts.ETSToken.getLastRenewed(etsOwnedTagId);

      assert(Number(lastRenewed) === 0);
      // platform now once again owns the token
      expect(await contracts.ETSToken.ownerOf(etsOwnedTagId)).to.be.equal(accounts.ETSPlatform.address);

      // Create new auction.
      await expect(contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId))
        .to.emit(contracts.ETSAuctionHouse, "AuctionCreated")
        .withArgs(2, etsOwnedTagId, 2);
    });
  });

  describe("Bidding on active auction", async () => {
    beforeEach(async () => {
      // Create an auction.
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);
    });

    it("should revert if auction house is paused", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).pause();
      const bid = initSettings.RESERVE_PRICE + 10;
      // First bid.
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(etsOwnedTagId, { value: bid }),
      ).to.be.revertedWith("Pausable: paused");
    });

    it('should revert with "Auction not found" if bid is on non-existent auction', async () => {
      // First bid.
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(etsOwnedTagId2, {
          value: initSettings.RESERVE_PRICE,
        }),
      ).to.be.revertedWith("Auction not found");
    });

    it("should revert if bid doesn't meet reserve price", async () => {
      const less_than_reserve = initSettings.RESERVE_PRICE - initSettings.RESERVE_PRICE / 2;
      const bid = ethers.parseUnits(less_than_reserve.toString(), "ether");
      // First bid.
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, { value: bid }),
      ).to.be.revertedWith("Must send at least reservePrice");
    });

    it("should revert if bid doesn't meet min bid increment", async () => {
      let auction = await contracts.ETSAuctionHouse.getAuction(1);

      // Reserve Price is set in ETH/MATIC units. eg. 0.5 MATIC
      let bid = ethers.parseUnits(initSettings.RESERVE_PRICE, "ether");

      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, { value: bid });

      auction = await contracts.ETSAuctionHouse.getAuction(1);

      bid =
        auction.amount +
        auction.amount *
          ((BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE) -
            BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE) / BigInt(2)) /
            BigInt(100));

      // Bid Value should be in WEI, so convert low_bid integer to BigInt.
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, { value: bid }),
      ).to.be.revertedWith("Bid too low");
    });

    it("should emit an `AuctionBid` event on successful bids", async () => {
      // First bid.
      let bid = ethers.parseUnits(initSettings.RESERVE_PRICE, "ether");

      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, {
          value: bid,
        }),
      )
        .to.emit(contracts.ETSAuctionHouse, "AuctionBid")
        .withArgs(1, accounts.RandomTwo.address, bid, false);

      // Second bid
      const auction = await contracts.ETSAuctionHouse.getAuction(1);

      // Convert the entire calculation to BigInt to avoid precision issues
      bid = auction.amount + (auction.amount * BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE)) / BigInt(100);

      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
          value: bid,
        }),
      )
        .to.emit(contracts.ETSAuctionHouse, "AuctionBid")
        .withArgs(1, accounts.RandomOne.address, bid, false);
    });

    it("should return funds to previous bidder on good bid", async () => {
      // RandomOne Bids First bid.
      const bid1 = ethers.parseUnits(initSettings.RESERVE_PRICE, "ether");
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: bid1,
      });
      const RandomOnePostBidBalance = await ethers.provider.getBalance(accounts.RandomOne.address);

      // RandomTwo successfully increments the bid.
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      const bid2 = auction.amount + (auction.amount * BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE)) / BigInt(100);

      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, {
        value: bid2,
      });

      // RandomOne is successfully refunded their original bid.
      const RandomOnePostRefundBalance = await ethers.provider.getBalance(accounts.RandomOne.address);
      expect(RandomOnePostRefundBalance === RandomOnePostBidBalance + bid1);
    });

    it("should cap the maximum bid griefing cost at 30K gas + the cost to wrap and transfer WMATIC", async () => {
      const maliciousBidder = await (
        await (await ethers.getContractFactory("MaliciousBidder")).deploy()
      ).waitForDeployment();
      const maliciousBid = await maliciousBidder
        .connect(accounts.RandomOne)
        .bid(await contracts.ETSAuctionHouse.getAddress(), 1, {
          value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
        });
      await maliciousBid.wait();

      const bid = ethers.parseUnits((initSettings.RESERVE_PRICE * 4).toString(), "ether");
      const tx = await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, {
        value: bid,
        gasLimit: 1_000_000,
      });
      const result = await tx.wait();

      expect(Number(result.gasUsed)) < Number(200_000);
      expect(await contracts.WMATIC.balanceOf(await maliciousBidder.getAddress())) === initSettings.RESERVE_PRICE;
    });

    it("should emit an `AuctionExtended` event if the auction end time is within the time buffer", async () => {
      // RandomOne Bids
      // const randomOneBid = initSettings.RESERVE_PRICE * 2;
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });

      const auction = await contracts.ETSAuctionHouse.getAuction(1);

      // Advance blockchain to current end time less 5 minutes.
      await ethers.provider.send("evm_setNextBlockTimestamp", [
        Number(auction.endTime - BigInt(initSettings.TIME_BUFFER) / BigInt(2)),
      ]);

      // Place a bid that will extend the auction.
      const bid_increment =
        auction.amount + (auction.amount * BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE)) / BigInt(100);

      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomTwo).createBid(1, {
          value: bid_increment,
        }),
      )
        .to.emit(contracts.ETSAuctionHouse, "AuctionExtended")
        .withArgs(1, auction.endTime + BigInt(initSettings.TIME_BUFFER) / BigInt(2));
    });
  });

  describe("Bidding on ended, but not settled auction", async () => {
    beforeEach(async () => {
      // Create an auction.
      const _bid = ethers.parseEther(initSettings.RESERVE_PRICE);

      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });

      // Advance the blockchain one minute past auction end time.
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);
    });

    it('should revert with "Auction ended"', async () => {
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      const bid_increment =
        auction.amount + (auction.amount * BigInt(initSettings.MIN_INCREMENT_BID_PERCENTAGE)) / BigInt(100);

      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
          value: bid_increment,
        }),
      ).to.be.revertedWith("Auction ended");
    });
  });

  describe("Settling an auction via settleCurrentAndCreateNewAuction()", async () => {
    beforeEach(async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(etsOwnedTagId);
    });

    it('should revert with "Pausable: paused" if auction house is paused', async () => {
      await contracts.ETSAuctionHouse.connect(accounts.ETSAdmin).pause();
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1),
      ).to.be.revertedWith("Pausable: paused");
    });

    it('should revert with "Auction not found" if auction doesn\'t exist', async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(2),
      ).to.be.revertedWith("Auction not found");
    });

    it('should revert with "Auction has not begun" if auction exists but has hasn\'t started', async () => {
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1),
      ).to.be.revertedWith("Auction has not begun");
    });

    it("should revert with \"Auction hasn't completed\" if auction hasn't ended", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1),
      ).to.be.revertedWith("Auction has not ended");
    });

    it('should emit "AuctionSettled" when successfully settled', async () => {
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);

      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1)).to.emit(
        contracts.ETSAuctionHouse,
        "AuctionSettled",
      );
    });

    it("can be settled by anyone", async () => {
      // RandomOne is high bidder
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);

      // settled by RandomTwo
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomTwo).settleCurrentAndCreateNewAuction(1)).to.emit(
        contracts.ETSAuctionHouse,
        "AuctionSettled",
      );
    });

    it('initiates request to create next auction (emits "RequestCreateAuction")', async () => {
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);

      // settled by RandomTwo
      await expect(contracts.ETSAuctionHouse.connect(accounts.RandomTwo).settleCurrentAndCreateNewAuction(1)).to.emit(
        contracts.ETSAuctionHouse,
        "RequestCreateAuction",
      );
    });

    it('should revert with "Auction already settled" when already settled', async () => {
      // RandomOne is high bidder
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);

      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).settleCurrentAndCreateNewAuction(1);
      await expect(
        contracts.ETSAuctionHouse.connect(accounts.RandomOne).settleCurrentAndCreateNewAuction(1),
      ).to.be.revertedWith("Auction already settled");
    });

    it("should send CTAG token to winning bidder", async () => {
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });
      const auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);
      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).settleCurrentAndCreateNewAuction(1);

      assert((await contracts.ETSToken.ownerOf(etsOwnedTagId)) === auction.bidder);
    });
  });

  describe("Auction Proceeds", async () => {
    beforeEach(async () => {
      // RandomTwo sets up as a relayer (they own a tag already from overall test setup):
      await contracts.ETSRelayerFactory.connect(accounts.RandomTwo).addRelayer("RandomTwo Relayer");
      relayerAddress = await contracts.ETSAccessControls.getRelayerAddressFromName("RandomTwo Relayer");
      etsRelayerV1ABI = require("../abi/contracts/relayers/ETSRelayerV1.sol/ETSRelayerV1.json");
      randomTwoRelayer = new ethers.Contract(relayerAddress, etsRelayerV1ABI, accounts.RandomTwo);

      relayerPreAuctionAccrued = await contracts.ETSAuctionHouse.accrued(relayerAddress);
      creatorPreAuctionAccrued = await contracts.ETSAuctionHouse.accrued(accounts.Creator.address);
      platformPreAuctionAccrued = await contracts.ETSAuctionHouse.accrued(accounts.ETSPlatform.address);

      // "Creator" creates a CTAG using RandomTwo Owned Relayer.
      tagString = "#AUCTIONPROCEEDS";
      tagId = await contracts.ETSToken.computeTagId(tagString);
      await randomTwoRelayer.connect(accounts.Creator).getOrCreateTagIds([tagString]);

      // Create new auction for tagId
      await contracts.ETSAuctionHouse.connect(accounts.ETSPlatform).fulfillRequestCreateAuction(tagId);

      // RandomOne bids & wins the auction
      await contracts.ETSAuctionHouse.connect(accounts.RandomOne).createBid(1, {
        value: ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"),
      });

      auction = await contracts.ETSAuctionHouse.getAuction(1);
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(auction.endTime + BigInt(60))]);
      await contracts.ETSAuctionHouse.connect(accounts.RandomTwo).settleCurrentAndCreateNewAuction(1);
    });

    it("should be held in the auction house", async () => {
      const totalProceeds = auction.amount;
      const auctionHouseBalance = await contracts.ETSAuctionHouse.getBalance();
      expect(auctionHouseBalance === totalProceeds);
    });

    it("should accrue correctly to actors", async () => {
      const winner = auction.bidder;
      const totalProceeds = auction.amount;

      expect(winner).to.equal(accounts.RandomOne.address);
      expect(totalProceeds === ethers.parseUnits(initSettings.RESERVE_PRICE, "ether"));

      const relayerProceeds =
        (totalProceeds * BigInt(await contracts.ETSAuctionHouse.relayerPercentage())) / BigInt(100);
      const creatorProceeds =
        (totalProceeds * BigInt(await contracts.ETSAuctionHouse.creatorPercentage())) / BigInt(100);

      relayerPostAuctionAccrued = await contracts.ETSAuctionHouse.accrued(relayerAddress);
      creatorPostAuctionAccrued = await contracts.ETSAuctionHouse.accrued(accounts.Creator.address);
      platformPostAuctionAccrued = await contracts.ETSAuctionHouse.accrued(accounts.ETSPlatform.address);

      expect(relayerPostAuctionAccrued === relayerPreAuctionAccrued + relayerProceeds);
      expect(creatorPostAuctionAccrued === creatorPreAuctionAccrued + creatorProceeds);
      expect(
        platformPostAuctionAccrued ===
          platformPreAuctionAccrued + (totalProceeds - (relayerProceeds + creatorProceeds)),
      );
    });

    it("can be drawn down to creator", async () => {
      creatorAccrued = await contracts.ETSAuctionHouse.accrued(accounts.Creator.address);
      expect(await contracts.ETSAuctionHouse.totalDue(accounts.Creator.address)).to.equal(creatorAccrued);

      await expect(contracts.ETSAuctionHouse.connect(accounts.Creator).drawDown(accounts.Creator.address))
        .to.emit(contracts.ETSAuctionHouse, "AuctionProceedsWithdrawn")
        .withArgs(accounts.Creator.address, creatorAccrued);

      expect(await contracts.ETSAuctionHouse.totalDue(accounts.Creator.address)).to.equal(0);
      expect(await contracts.ETSAuctionHouse.paid(accounts.Creator.address)).to.equal(creatorAccrued);
    });

    it("can be drawn down to relayer", async () => {
      relayerAccrued = await contracts.ETSAuctionHouse.accrued(relayerAddress);
      expect(await contracts.ETSAuctionHouse.totalDue(relayerAddress)).to.equal(relayerAccrued);

      await expect(contracts.ETSAuctionHouse.connect(accounts.Creator).drawDown(relayerAddress))
        .to.emit(contracts.ETSAuctionHouse, "AuctionProceedsWithdrawn")
        .withArgs(relayerAddress, relayerAccrued);

      expect(await contracts.ETSAuctionHouse.totalDue(relayerAddress)).to.equal(0);
      expect(await contracts.ETSAuctionHouse.paid(relayerAddress)).to.equal(relayerAccrued);
    });

    it("can be drawn down to platform", async () => {
      platformAccrued = await contracts.ETSAuctionHouse.accrued(accounts.ETSPlatform.address);
      expect(await contracts.ETSAuctionHouse.totalDue(accounts.ETSPlatform.address)).to.equal(platformAccrued);

      await expect(contracts.ETSAuctionHouse.connect(accounts.Creator).drawDown(accounts.ETSPlatform.address))
        .to.emit(contracts.ETSAuctionHouse, "AuctionProceedsWithdrawn")
        .withArgs(accounts.ETSPlatform.address, platformAccrued);

      expect(await contracts.ETSAuctionHouse.totalDue(accounts.ETSPlatform.address)).to.equal(0);
      expect(await contracts.ETSAuctionHouse.paid(accounts.ETSPlatform.address)).to.equal(platformAccrued);
    });
  });
});
