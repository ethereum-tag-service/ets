const { ethers, upgrades } = require("hardhat");
const { setup } = require("./utils/setup.js");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({ deployments }) => {
  const { save, log } = deployments;
  const { factories, initSettings } = await setup();

  const wmatic = await factories.WMATIC.deploy();
  await wmatic.waitForDeployment();
  await saveNetworkConfig("WMATIC", wmatic, null, false);
  const wmaticAddress = await wmatic.getAddress();
  const etsAccessControlsAddress = (await deployments.get("ETSAccessControls")).address;
  const etsTokenAddress = (await deployments.get("ETSToken")).address;

  log("====================================================");
  log(`WMATIC deployed to -> ${wmaticAddress}`);
  log("====================================================");

  // Deploy ETS core using OpenZeppelin upgrades plugin.
  const deployment = await upgrades.deployProxy(
    factories.ETSAuctionHouse,
    [
      etsTokenAddress,
      etsAccessControlsAddress,
      wmaticAddress,
      initSettings.MAX_AUCTIONS,
      initSettings.TIME_BUFFER,
      ethers.parseEther(initSettings.RESERVE_PRICE),
      initSettings.MIN_INCREMENT_BID_PERCENTAGE,
      initSettings.DURATION,
      initSettings.RELAYER_PERCENTAGE,
      initSettings.PLATFORM_PERCENTAGE,
    ],
    { kind: "uups", pollingInterval: 3000, timeout: 0 },
  );
  await deployment.waitForDeployment();

  const deploymentAddress = await deployment.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(deploymentAddress);

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    // Verify & Update network configuration file.
    await verify("ETSAuctionHouse", deployment, implementationAddress, []);
  }

  await saveNetworkConfig("ETSAuctionHouse", deployment, implementationAddress, false);

  // Add to hardhat-deploy deployments.
  artifact = await deployments.getExtendedArtifact("ETSAuctionHouse");
  proxyDeployments = {
    address: deploymentAddress,
    ...artifact,
  };
  await save("ETSAuctionHouse", proxyDeployments);

  log("====================================================");
  log(`ETSAuctionHouse proxy deployed to -> ${deploymentAddress}`);
  log(`ETSAuctionHouse implementation deployed to -> ${implementationAddress}`);
  log("====================================================");
};

module.exports.tags = ["ETSAuctionHouse"];
module.exports.dependencies = ["ETSToken"];
