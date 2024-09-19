const { upgrades } = require("hardhat");
const { setup } = require("./utils/setup.js");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({ deployments }) => {
  const { save, log } = deployments;
  const { factories } = await setup();

  const etsAccessControlsAddress = (await deployments.get("ETSAccessControls")).address;

  // Deploy ETSTarget
  const deployment = await upgrades.deployProxy(factories.ETSTarget, [etsAccessControlsAddress], {
    kind: "uups",
    pollingInterval: 3000,
    timeout: 0,
  });

  await deployment.waitForDeployment();

  const deploymentAddress = await deployment.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(deploymentAddress);

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    // Verify & Update network configuration file.
    await verify("ETSTarget", deployment, implementationAddress, []);
  }

  await saveNetworkConfig("ETSTarget", deployment, implementationAddress, false);

  // Add to deployments.
  const artifact = await deployments.getExtendedArtifact("ETSTarget");
  const proxyDeployments = {
    address: deploymentAddress,
    ...artifact,
  };
  await save("ETSTarget", proxyDeployments);

  log("====================================================");
  log(`ETSTarget proxy deployed to -> ${deploymentAddress}`);
  log(`ETSTarget implementation deployed to -> ${implementationAddress}`);
  log("====================================================");
};
module.exports.tags = ["ETSTarget"];
module.exports.dependencies = ["ETSAuctionHouse"];
