const axios = require("axios");
const randomWords = require("random-words");

task("testdata", "Create ETS test data on the targeted chain")
  .addOptionalParam("action", "Options include: createTag, createTaggingRecord", "", types.string)
  .addOptionalParam("qty", "Specify quantity to be created", "1", types.integer)
  .addOptionalParam("signers", "Number of different signers", "1", types.integer)
  .setAction(async (taskArgs, hre) => {
    if (taskArgs.action === "createTag") {
      await hre.run("testdata:createTag", { qty: taskArgs.qty, signers: taskArgs.signers });
    }

    if (taskArgs.action === "createTaggingRecords") {
      await hre.run("testdata:createTaggingRecords", { qty: taskArgs.qty, signers: taskArgs.signers });
    }

    if (taskArgs.action === "createAuctions") {
      await hre.run("testdata:createAuctions", { qty: taskArgs.qty, signers: taskArgs.signers });
    }
  });

subtask("testdata:createTag", "Creates a random CTAG from a random account.")
  .addParam("qty", "Number of CTAGs to mint")
  .addParam("signers", "Number of signers, taken from getNamedAccounts()")
  .setAction(async (taskArgs) => {
    const namedAccounts = await getNamedAccounts();
    const qty = taskArgs.qty;
    const signersCount = Number.parseInt(taskArgs.signers); // Parse the signers count
    // Ensure signersCount is within the range of available namedAccounts
    const effectiveSignersCount = Math.min(signersCount, namedAccounts.length);

    for (let i = 1; i <= qty; i++) {
      //const tags = Array.from({ length: tagsPerRecord }, (_, index) => `#tag${i * tagsPerRecord + index}`);
      await run("createTags", {
        relayer: "ETSRelayer",
        signer: namedAccounts[i % effectiveSignersCount], // Rotate through the specified number of signers starting from account3
        tags: `#${randomWords()}`,
        network: hre.network.name,
      });
    }
  });

subtask("testdata:createTaggingRecords", "Creates random tagging records")
  .addParam("qty", "Number of CTAGs to mint")
  .addParam("signers", "Number of signers, taken from getNamedAccounts()")
  .setAction(async (taskArgs) => {
    const namedAccounts = await getNamedAccounts();
    const qty = taskArgs.qty;
    const signersCount = Number.parseInt(taskArgs.signers); // Parse the signers count
    // Ensure signersCount is within the range of available namedAccounts
    const effectiveSignersCount = Math.min(signersCount, namedAccounts.length);

    for (let i = 1; i <= qty; i++) {
      // Generate an array of 1-4 random words
      const tagsCount = Math.floor(Math.random() * 4) + 1; // Random number between 1 and 4
      const randomWordsArray = Array.from({ length: tagsCount }, () => randomWords());

      // Create tags with "#" prefix for tagging
      const tags = randomWordsArray.map((word) => `#${word}`).join(",");

      // Create a search query without "#" prefix
      const query = randomWordsArray.join(" ");

      let imageUrl = await searchUnsplashImage(query);
      if (imageUrl) {
        console.info("Search query: ", query);
        console.info(`Image URL: ${imageUrl}`);
      } else {
        console.info("Fetch random image");
        imageUrl = getRandomImage();
        continue; // Skip this iteration if no image was found
      }

      await run("applyTags", {
        relayer: "ETSRelayer",
        signer: namedAccounts[i % effectiveSignersCount], // Rotate through the specified number of signers starting from account3
        tags: tags,
        uri: imageUrl,
        recordType: "bookmark",
        network: hre.network.name,
      });

      // Delay for 2 sec.
      await waitForProcessing(2);
    }
  });

subtask("testdata:createAuctions", "Creates, bids on and settles auctions. Assumes existence of tags.")
  .addParam("qty", "Number of auctions")
  .addParam("signers", "Number of signers, taken from getNamedAccounts()")
  .setAction(async (taskArgs) => {
    const namedAccounts = await getNamedAccounts();
    const qty = taskArgs.qty;
    const signersCount = Number.parseInt(taskArgs.signers); // Parse the signers count from taskArgs

    // Adjust the range to include only the specified number of signers starting from the first account
    const adjustedNamedAccounts = namedAccounts.slice(0, signersCount);

    let previousAuctionId;

    // Retrieve overall auction settings
    const auctionSettings = await hre.run("auctionhouse:settings", {
      output: "return",
      network: hre.network.name,
    });

    if (auctionSettings.paused) {
      console.info("Enabling auction");
      await hre.run("auctionhouse:togglepause", {
        network: hre.network.name,
      });
      await waitForProcessing(3);
    }

    // Convert the string to a floating-point number
    const reserveAmount = Number.parseFloat(auctionSettings.reserve);

    // Check if the converted number is greater than 0.1
    if (reserveAmount > 0.1) {
      console.info("Setting auction reserve to 0.1");
      await hre.run("auctionhouse:setreserve", {
        reserve: "0.1",
        network: hre.network.name,
      });
      await waitForProcessing(3);
    }

    if (auctionSettings.duration > 10) {
      console.info("Setting auction duration to 10 seconds.");
      await hre.run("auctionhouse:setduration", {
        duration: "10",
        network: hre.network.name,
      });
      await waitForProcessing(3);
    }

    if (auctionSettings.timebuffer > 10) {
      console.info("Setting timebuffer to 10 seconds.");
      await hre.run("auctionhouse:settimebuffer", {
        timebuffer: "10",
        network: hre.network.name,
      });
      await waitForProcessing(3);
    }

    if (auctionSettings.totalAuctions === 0) {
      // kick off the first auction.
      previousAuctionId = 0;
      console.info(`Launching first action on ${hre.network.name}`);
      console.info("Note: task will error out if no tags exist.");
      await hre.run("auctionhouse:nextauction", {
        network: hre.network.name,
      });
    } else {
      const initialAuctionDetails = await hre.run("auctionhouse:showlast", {
        output: "return",
        network: hre.network.name,
      });
      previousAuctionId = initialAuctionDetails.auctionId - 1;
      console.info("previousAuctionId: ", previousAuctionId);
    }

    for (let i = 1; i <= qty; i++) {
      // Get the current Auction Details.
      const auctionDetails = await hre.run("auctionhouse:showlast", {
        output: "return",
        network: hre.network.name,
      }); // Get the current auction details.

      // Check if a new auction has started
      if (auctionDetails.auctionId !== previousAuctionId) {
        console.info("-------------------------------------");
        console.info(`Creating test auction ${i} of ${qty}`);
        console.info("-------------------------------------");
        console.info("Auction Details:");
        console.info(auctionDetails);
        console.info("=====================================");

        previousAuctionId = auctionDetails.auctionId;

        if (!auctionDetails.ended) {
          // cast bids on the current auction.
          // Ensure first bid meets or exceeds reserve price
          let lastBid = BigInt(ethers.parseUnits(auctionDetails.currentHighBid, "ether"));
          const reservePrice = BigInt(ethers.parseUnits(auctionDetails.reservePrice, "ether"));
          if (lastBid < reservePrice) {
            lastBid = reservePrice;
          }
          // Cast 1 to 10 bids on from a randomly chose account.
          // Generate random number of bids between 1 and 10
          const numberOfBids = Math.floor(Math.random() * 10) + 1;
          console.info(`Notice: ${numberOfBids} bids are about to commence.`);

          for (let bidCount = 0; bidCount < numberOfBids; bidCount++) {
            const bidIncrement = (lastBid * BigInt(auctionSettings.bidIncrement)) / BigInt(100); // Assuming bidIncrement is 5%
            const nextBid = lastBid + bidIncrement;

            console.info(`Executing bid ${bidCount + 1} of ${numberOfBids}`);

            // Select a random signer from the adjusted range
            const randomIndex = Math.floor(Math.random() * adjustedNamedAccounts.length);
            const signer = adjustedNamedAccounts[randomIndex];

            // Place bid
            await hre.run("auctionhouse:createbid", {
              id: auctionDetails.auctionId.toString(),
              bid: ethers.formatEther(nextBid.toString()), // Convert BigInt to string and format as Ether
              signer: signer,
              network: hre.network.name,
            });

            // Wait for two seconds after each bid
            await waitForProcessing(2);
            lastBid = nextBid;
          }
        }

        if (!auctionDetails.settled) {
          await hre.run("auctionhouse:settleauction", {
            id: auctionDetails.auctionId.toString(),
            network: hre.network.name,
          });

          await waitForProcessing(7);
        }
      } else {
        console.info("Waiting for new auction to start...");
        await waitForProcessing(5); // Shorter pause before checking again
      }
    }
  });

async function waitForProcessing(waitTime = 5) {
  process.stdout.write("Waiting for process to complete");
  for (let i = 0; i < waitTime; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
    process.stdout.write(".");
  }
  console.info("\nDone waiting.");
}

async function getNamedAccounts() {
  return ["account3", "account4", "account5", "account6", "account7", "account8", "account9", "account10"];
}

async function getRandomImage() {
  const accessKey = "9mD4DxGuJvw7IWqJQhIxe0FKAZsIA63Pt4_xgVCau_Y"; // Replace with your Unsplash Access Key
  const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

  try {
    const response = await axios.get(url);
    return response.data.urls.regular; // Get the regular-sized image URL
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

async function searchUnsplashImage(query) {
  const accessKey = "9mD4DxGuJvw7IWqJQhIxe0FKAZsIA63Pt4_xgVCau_Y"; // Replace with your Unsplash Access Key
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}`;

  try {
    const response = await axios.get(url);
    const photos = response.data.results;

    if (photos.length > 0) {
      // Return the URL of the first image in the search results
      return photos[0].urls.regular;
    }
    console.info("No images found for query:", query);
    return null;
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return null;
  }
}
