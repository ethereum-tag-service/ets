const { ethers, getNamedAccounts } = require("hardhat");

async function setup() {
  // Get the named accounts
  const { ETSAdmin, ETSPlatform, ETSOracle } = await getNamedAccounts();

  // Get the signers for these accounts
  const ETSAdminSigner = await ethers.getSigner(ETSAdmin);
  const ETSPlatformSigner = await ethers.getSigner(ETSPlatform);
  const ETSOracleSigner = await ethers.getSigner(ETSOracle);

  const accounts = {
    ETSAdmin: ETSAdminSigner,
    ETSPlatform: ETSPlatformSigner,
    ETSOracle: ETSOracleSigner,
  };

  const initSettings = {
    // Token
    TAG_MIN_STRING_LENGTH: 2,
    TAG_MAX_STRING_LENGTH: 32,
    OWNERSHIP_TERM_LENGTH: 730,
    // Auction
    MAX_AUCTIONS: 1,
    TIME_BUFFER: 600, // 600 secs / 10 minutes
    RESERVE_PRICE: "0.00032", // $1.00
    MIN_INCREMENT_BID_PERCENTAGE: 5,
    DURATION: 30 * 60, // 30 minutes
    RELAYER_PERCENTAGE: 20,
    CREATOR_PERCENTAGE: 40,
    PLATFORM_PERCENTAGE: 40,
    // ETS core (Tagging records)
    TAGGING_FEE: "0.0000032", // Approx $0.01
    TAGGING_FEE_PLATFORM_PERCENTAGE: 20,
    TAGGING_FEE_RELAYER_PERCENTAGE: 30,
  };

  const factories = {
    AirnodeRrpV0Proxy: await ethers.getContractFactory("AirnodeRrpV0Proxy"),
    WETH: await ethers.getContractFactory("WETH"),
    ETSAccessControls: await ethers.getContractFactory("ETSAccessControls"),
    ETSToken: await ethers.getContractFactory("ETSToken"),
    ETSAuctionHouse: await ethers.getContractFactory("ETSAuctionHouse"),
    ETSTarget: await ethers.getContractFactory("ETSTarget"),
    ETSEnrichTarget: await ethers.getContractFactory("ETSEnrichTarget"),
    ETS: await ethers.getContractFactory("ETS"),
    ETSRelayer: await ethers.getContractFactory("ETSRelayer"),
    ETSRelayerFactory: await ethers.getContractFactory("ETSRelayerFactory"),
  };

  // Return an object instead of an array
  return {
    accounts,
    factories,
    initSettings,
  };
}

module.exports = { setup };
