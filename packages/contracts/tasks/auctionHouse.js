const { ethers } = require("ethers");
const _randomWords = require("random-words");

task("auctionhouse", "Create and interact with an auction")
  .addOptionalParam("settings", "List of current settings", true, types.boolean)
  .addOptionalParam(
    "action",
    "Options include: showactive, createauction, createbid, settleauction, togglepause, increasemax, setreserve",
    "",
    types.string,
  )
  .addOptionalParam("tag", "specify tag to be acted on", "", types.string)
  .addOptionalParam("id", "auction id", "", types.string)
  .addOptionalParam("bid", 'bid amount in ETH/MATIC. eg. "0.1"', "", types.string)
  .addOptionalParam("value", "Value to pass to setting.", "", types.string)
  .addOptionalParam(
    "signer",
    'Named wallet accounts. options are "account0", "account1", "account2", "account3", "account4", "account5". Defaults to "account0"',
    "account0",
  )
  .addOptionalParam("output", "The format for outputting auction details", "standard", types.string)
  .setAction(async (taskArgs, hre) => {
    if (taskArgs.action === "togglepause") {
      await hre.run("auctionhouse:togglepause");
    }

    if (taskArgs.action === "setreserve") {
      await hre.run("auctionhouse:setreserve", { reserve: taskArgs.value });
    }

    if (taskArgs.action === "setduration") {
      await hre.run("auctionhouse:setduration", { duration: taskArgs.value });
    }

    if (taskArgs.action === "settimebuffer") {
      await hre.run("auctionhouse:settimebuffer", { timebuffer: taskArgs.value });
    }

    if (taskArgs.action === "setmaxauctions") {
      await hre.run("auctionhouse:setmaxauctions", { maxauctions: taskArgs.value });
    }

    if (taskArgs.action === "settings") {
      await hre.run("auctionhouse:settings", { output: taskArgs.output });
    }

    if (taskArgs.action === "showlast") {
      await hre.run("auctionhouse:showlast", { output: taskArgs.output });
    }

    if (taskArgs.action === "status") {
      if (taskArgs.id || taskArgs.tag) {
        await hre.run("auctionhouse:auctionstatus", { id: taskArgs.id, tag: taskArgs.tag, output: taskArgs.output });
      } else {
        console.error("You must provide either an id or a tag for the status action.");
      }
    }

    if (taskArgs.action === "nextauction") {
      await hre.run("auctionhouse:nextauction");
    }

    if (taskArgs.action === "auction") {
      await hre.run("auctionhouse:createauction", { tag: taskArgs.tag });
    }

    if (taskArgs.action === "bid") {
      await hre.run("auctionhouse:createbid", {
        tag: taskArgs.tag,
        id: taskArgs.id,
        bid: taskArgs.bid,
        signer: taskArgs.signer,
      });
    }

    if (taskArgs.action === "settleauction") {
      await hre.run("auctionhouse:settleauction", { id: taskArgs.id, signer: taskArgs.signer });
    }
  });

subtask("auctionhouse:settings", "List auction settings")
  .addOptionalParam("output", "The format for outputting auction details", "standard", types.string)
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());

    paused = await contracts.etsAuctionHouse.paused();
    maxAuctions = await contracts.etsAuctionHouse.maxAuctions();
    activeAuctions = await contracts.etsAuctionHouse.getActiveCount();
    totalAuctions = await contracts.etsAuctionHouse.getTotalCount();
    reserve = await contracts.etsAuctionHouse.reservePrice();
    duration = await contracts.etsAuctionHouse.duration();
    timebuffer = await contracts.etsAuctionHouse.timeBuffer();
    bidIncrement = await contracts.etsAuctionHouse.minBidIncrementPercentage();

    const auctionSettings = {
      paused: paused,
      maxAuctions: ethers.toNumber(maxAuctions),
      activeAuctions: ethers.toNumber(activeAuctions),
      totalAuctions: ethers.toNumber(totalAuctions),
      reserve: ethers.formatEther(reserve),
      bidIncrement: ethers.toNumber(bidIncrement),
      duration: ethers.toNumber(duration),
      timebuffer: ethers.toNumber(timebuffer),
    };

    if (taskArgs.output === "return") {
      return auctionSettings;
    }
    console.info(auctionSettings);
  });

subtask("auctionhouse:auctionstatus", "Shows status of a given tag auction id")
  .addParam("id", "Auction ID", null, types.string)
  .addParam("tag", "Tag to get auction status for", null, types.string)
  .addParam("output", "The format for outputting auction details", "standard", types.string)
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());

    let auctionId;
    if (taskArgs.id) {
      auctionId = taskArgs.id;
    } else if (taskArgs.tag) {
      const tagId = await contracts.etsToken.computeTagId(taskArgs.tag);
      const auction = await contracts.etsAuctionHouse.getAuctionForTokenId(tagId);
      auctionId = auction.auctionId;
    } else {
      console.error("Either an id or a tag must be provided.");
      return;
    }

    if (!(await contracts.etsAuctionHouse.auctionExists(auctionId))) {
      console.info("Auction not found for ID:", auctionId);
      return;
    }

    try {
      const auction = await contracts.etsAuctionHouse.getAuction(auctionId);
      const tag = await contracts.etsToken.getTagById(auction.tokenId);
      await displayAuctionDetails(auction, tag, taskArgs.output);
    } catch (error) {
      console.error("Error fetching auction or tag information:", error);
    }
  });

// Note this task only works if there is one active action at a time.
subtask("auctionhouse:showlast", "Shows status of most recently released auction")
  .addOptionalParam("output", "The format for outputting auction details", "standard", types.string)
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());

    // Released and unsettled auctions
    const releasedAuctions = await contracts.etsAuctionHouse.getActiveCount();
    const maxAuctions = await contracts.etsAuctionHouse.maxAuctions();

    console.info("Released auction count: ", Number(releasedAuctions));
    console.info("maxAuctions: ", Number(maxAuctions));

    const auctionId = await contracts.etsAuctionHouse.getTotalCount();

    if (!(await contracts.etsAuctionHouse.auctionExists(auctionId))) {
      console.info("Auction not found for ", auctionId);
      return;
    }

    try {
      const auction = await contracts.etsAuctionHouse.getAuction(auctionId);
      const latestBlock = (await hre.ethers.provider.getBlock()).timestamp;
      const _ended =
        ethers.toNumber(auction.startTime) > 0 && latestBlock > ethers.toNumber(auction.endTime) ? "Yes" : "No";
      const tag = await contracts.etsToken.getTagById(auction.tokenId);

      return await displayAuctionDetails(auction, tag, taskArgs.output);
    } catch (error) {
      console.error("Error fetching auction or tag information:", error);
    }
  });

subtask("auctionhouse:togglepause", "Pause/Unpause the auctionhouse.").setAction(async () => {
  ({ accounts, contracts } = await setup());

  if (await contracts.etsAuctionHouse.paused()) {
    await contracts.etsAuctionHouse.connect(accounts.account0).unpause();
    console.info("auctionhouse unpaused");
  } else {
    await contracts.etsAuctionHouse.connect(accounts.account0).pause();
    console.info("auctionhouse paused");
  }
});

subtask("auctionhouse:setreserve", "Sets reserve price for all actions (eg. min first bid)")
  .addParam("reserve", "Reserve price")
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());
    const reserveInWEI = ethers.parseUnits(taskArgs.reserve, "ether");
    await contracts.etsAuctionHouse.connect(accounts.account0).setReservePrice(reserveInWEI);
    console.info("Reserve set to: ", `${reserveInWEI} WEI (${taskArgs.reserve} ETH/MATIC)`);
  });

subtask("auctionhouse:setduration", "Sets duration of auction in seconds.")
  .addParam("duration", "Duration in seconds")
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());
    await contracts.etsAuctionHouse.connect(accounts.account0).setDuration(taskArgs.duration);
    console.info(`Auction duration set to: ${taskArgs.duration} seconds`);
  });

subtask("auctionhouse:settimebuffer", "Sets time window for a bid to extend auction in seconds.")
  .addParam("timebuffer", "Duration in seconds")
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());
    await contracts.etsAuctionHouse.connect(accounts.account0).setTimeBuffer(taskArgs.timebuffer);
    console.info(`Auction timebuffer set to: ${taskArgs.timebuffer} seconds`);
  });

subtask("auctionhouse:setmaxauctions", "Sets maximum number of concurrent auctions.")
  .addParam("maxauctions", "Maximum Number of Concurrent Auctions")
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());
    await contracts.etsAuctionHouse.connect(accounts.account0).setMaxAuctions(taskArgs.maxauctions);
    console.info(`Max concurrent auctions set to ${taskArgs.maxauctions}`);
  });

subtask("auctionhouse:nextauction", "Creates next auction using ETS Oracle").setAction(async () => {
  ({ accounts, contracts } = await setup());
  const maxAuctions = await contracts.etsAuctionHouse.maxAuctions();
  const auctionCount = await contracts.etsAuctionHouse.getActiveCount();
  console.info("auctionCount", auctionCount);
  if (ethers.toNumber(auctionCount) >= maxAuctions) {
    console.info("No auction slots");
    return;
  }

  const txn = await contracts.etsAuctionHouse.createNextAuction();
  await txn.wait();

  // Waiting with visual indicator
  await waitForProcessing(8);
  await hre.run("auctionhouse:showlast");
});

subtask("auctionhouse:createauction", "Creates an auction given an existing CTAG string")
  .addParam("tag", "tag to be auctioned")
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());
    const maxAuctions = await contracts.etsAuctionHouse.maxAuctions();
    const auctionCount = await contracts.etsAuctionHouse.getActiveCount();

    if (ethers.toNumber(auctionCount) >= maxAuctions) {
      console.info("No auction slots");
      return;
    }

    const tagId = await contracts.etsToken.computeTagId(taskArgs.tag);
    const txn = await contracts.etsAuctionHouse.connect(accounts.account1).fulfillRequestCreateAuction(tagId);
    await txn.wait();

    await hre.run("auctionhouse:auctionstatus", { tag: taskArgs.tag });

    // printAuctionInfo(tagId);
  });

subtask("auctionhouse:createbid", "Creates a bid on a CTAG auction")
  .addOptionalParam("tag", "Tag to be bid on", null, types.string)
  .addOptionalParam("id", "Auction ID to bid on", null, types.string)
  .addParam("bid", "Bid amount", null, types.string)
  .addParam("signer", "Signer", "account2", types.string)
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    ({ accounts, contracts } = await setup());

    let auctionId;
    if (taskArgs.tag) {
      const tagId = await contracts.etsToken.computeTagId(taskArgs.tag);

      if (!(await contracts.etsAuctionHouse.auctionExistsForTokenId(tagId))) {
        console.info("Auction not found for ", taskArgs.tag);
        return;
      }

      const auction = await contracts.etsAuctionHouse.getAuctionForTokenId(tagId);
      auctionId = auction.id;
    } else if (taskArgs.id) {
      if (!(await contracts.etsAuctionHouse.auctionExists(taskArgs.id))) {
        console.info("Auction not found for ", taskArgs.id);
        return;
      }
      auctionId = taskArgs.id;
    } else {
      console.error("Either tag or auctionId must be provided.");
      return;
    }

    try {
      console.info("Bidding on auction: ", auctionId);
      const bidInWEI = ethers.parseUnits(taskArgs.bid, "ether");
      const txn = await contracts.etsAuctionHouse
        .connect(accounts[taskArgs.signer])
        .createBid(auctionId, { value: bidInWEI });
      await txn.wait();
      console.info("Successful bid: ");
      await hre.run("auctionhouse:auctionstatus", { id: auctionId.toString(), output: "object" });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return;
    }
  });

subtask(
  "auctionhouse:settleauction",
  "Settles a CTAG auction for a given tag, triggers oracle to release next auction.",
)
  .addParam("id", "Auction ID to bid on", null, types.string)
  .addParam("signer", "signer", "account2") // ETS Platform
  .setAction(async (taskArgs) => {
    ({ accounts, contracts } = await setup());

    let auction;
    if (taskArgs.id) {
      if (!(await contracts.etsAuctionHouse.auctionExists(taskArgs.id))) {
        console.info("Auction not found for ", taskArgs.id);
        return;
      }
      auction = await contracts.etsAuctionHouse.getAuction(taskArgs.id);
    }

    if (auction.startTime === 0) {
      console.info("Auction hasn't started yet");
      return;
    }

    if (auction.settled) {
      console.info("Auction already settled");
      return;
    }

    const latestBlock = (await hre.ethers.provider.getBlock()).timestamp;
    const auctionEndTime = ethers.toNumber(auction.endTime);

    if (auctionEndTime > latestBlock) {
      // Calculate the wait time in seconds
      const waitTimeInSeconds = auctionEndTime - latestBlock;

      // Display the wait time
      console.info(`Waiting for auction to end. Estimated wait time: ${waitTimeInSeconds} seconds`);

      // Call waitForProcessing with the calculated wait time
      await waitForProcessing(waitTimeInSeconds);
    }

    console.info("Settling auction: ", auction.auctionId.toString());
    const txn = await contracts.etsAuctionHouse.settleCurrentAndCreateNewAuction(auction.auctionId);
    await txn.wait();
    await hre.run("auctionhouse:auctionstatus", { id: auction.auctionId.toString(), output: "object" });
  });

async function waitForProcessing(waitTime = 5) {
  process.stdout.write("Waiting for process to complete");
  for (let i = 0; i < waitTime; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    process.stdout.write(".");
  }
  console.info("\nDone waiting.");
}

// Define a function to display auction details
async function displayAuctionDetails(auction, tag, output = "standard") {
  const latestBlock = (await hre.ethers.provider.getBlock()).timestamp;
  const ended = !!(ethers.toNumber(auction.startTime) > 0 && latestBlock > ethers.toNumber(auction.endTime));
  const started = auction.startTime > 0;

  const auctionDetails = {
    auctionId: ethers.toNumber(auction.auctionId),
    tag: tag.display,
    reservePrice: ethers.formatEther(auction.reservePrice),
    currentHighBid: ethers.formatEther(auction.amount),
    startTime: ethers.toNumber(auction.startTime),
    endTime: ethers.toNumber(auction.endTime),
    currentTime: latestBlock,
    bidder: auction.bidder,
    auctioneer: auction.auctioneer,
    started: started,
    ended: ended,
    settled: auction.settled,
  };

  if (output === "standard") {
    console.info("=================================================");
    console.info("    Auction Details for", tag.display);
    console.info("-------------------------------------------------");
    for (const [key, value] of Object.entries(auctionDetails)) {
      console.info(`      ${key}: ${value}`);
    }
    console.info("=================================================");
  } else if (output === "object") {
    console.info("Current Auction: ", auctionDetails);
  } else if (output === "return") {
    return auctionDetails;
  } else {
    throw new Error('Unsupported output format. Options are "standard", "object" or "return"');
  }
}

const setup = async () => {
  const { getAccounts } = require("./utils/getAccounts");

  // Load network configuration
  const networkConfig = require(`../src/chainConfig/${hre.network.name}.json`);
  const accounts = await getAccounts();

  // ABIs and Contract addresses from network configuration
  const ETSAccessControlsABI = networkConfig.contracts.ETSAccessControls.abi;
  const ETSAccessControlsAddress = networkConfig.contracts.ETSAccessControls.address;
  const ETSAuctionHouseABI = networkConfig.contracts.ETSAuctionHouse.abi;
  const ETSAuctionHouseAddress = networkConfig.contracts.ETSAuctionHouse.address;
  const ETSTokenABI = networkConfig.contracts.ETSToken.abi;
  const ETSTokenAddress = networkConfig.contracts.ETSToken.address;
  const ETSRelayerV1ABI = networkConfig.contracts.ETSRelayerV1.abi;

  const etsAccessControls = new hre.ethers.Contract(ETSAccessControlsAddress, ETSAccessControlsABI, accounts.account0);
  const etsAuctionHouse = new hre.ethers.Contract(ETSAuctionHouseAddress, ETSAuctionHouseABI, accounts.account0);
  const etsToken = new hre.ethers.Contract(ETSTokenAddress, ETSTokenABI, accounts.account0);
  const relayerAddress = await etsAccessControls.getRelayerAddressFromName("ETSRelayer");
  const etsRelayer = new hre.ethers.Contract(relayerAddress, ETSRelayerV1ABI, accounts.account0);

  return {
    accounts,
    contracts: {
      etsToken,
      etsRelayer,
      etsAuctionHouse,
    },
  };
};

exports.setup = setup;
