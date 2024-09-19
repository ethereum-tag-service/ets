const { ethers, upgrades } = require("hardhat");
const { setup } = require("./utils/setup.js");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({ deployments }) => {
  const { save, log } = deployments;
  const { factories, initSettings } = await setup();

  const etsAccessControlsAddress = (await deployments.get("ETSAccessControls")).address;
  const etsTokenAddress = (await deployments.get("ETSToken")).address;
  const etsTargetAddress = (await deployments.get("ETSTarget")).address;

  // Deploy ETS
  const deployment = await upgrades.deployProxy(
    factories.ETS,
    [
      etsAccessControlsAddress,
      etsTokenAddress,
      etsTargetAddress,
      ethers.parseUnits(initSettings.TAGGING_FEE, "ether"),
      initSettings.TAGGING_FEE_PLATFORM_PERCENTAGE,
      initSettings.TAGGING_FEE_RELAYER_PERCENTAGE,
    ],
    { kind: "uups", pollingInterval: 3000, timeout: 0 },
  );

  await deployment.waitForDeployment();
  const deploymentAddress = await deployment.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(deploymentAddress);

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    // Verify & Update network configuration file.
    await verify("ETS", deployment, implementationAddress, []);
  }

  await saveNetworkConfig("ETS", deployment, implementationAddress, false);

  // Add to deployments.
  const artifact = await deployments.getExtendedArtifact("ETS");
  const proxyDeployments = {
    address: deploymentAddress,
    ...artifact,
  };
  await save("ETS", proxyDeployments);

  log("====================================================");
  log(`ETS proxy deployed to -> ${deploymentAddress}`);
  log(`ETS implementation deployed to -> ${implementationAddress}`);
  log("====================================================");
};
module.exports.tags = ["ETS"];
module.exports.dependencies = ["ETSEnrichTarget"];
