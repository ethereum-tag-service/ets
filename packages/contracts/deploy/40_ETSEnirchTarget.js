const { upgrades } = require("hardhat");
const { setup } = require("./utils/setup.js");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({ deployments }) => {
  const { save, log } = deployments;
  [accounts, factories, initSettings] = await setup();

  const etsAccessControlsAddress = (await deployments.get("ETSAccessControls")).address;
  const etsTargetAddress = (await deployments.get("ETSTarget")).address;

  // Deploy ETSEnrichTarget
  const deployment = await upgrades.deployProxy(
    factories.ETSEnrichTarget,
    [etsAccessControlsAddress, etsTargetAddress],
    { kind: "uups", pollingInterval: 3000, timeout: 0 },
  );
  await deployment.waitForDeployment();

  const deploymentAddress = await deployment.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(deploymentAddress);

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    // Verify & Update network configuration file.
    await verify("ETSEnrichTarget", deployment, implementationAddress, []);
  }

  await saveNetworkConfig("ETSEnrichTarget", deployment, implementationAddress, false);

  // Add to deployments.
  const artifact = await deployments.getExtendedArtifact("ETSEnrichTarget");
  const proxyDeployments = {
    address: deploymentAddress,
    ...artifact,
  };
  await save("ETSEnrichTarget", proxyDeployments);

  log("====================================================");
  log(`ETSEnrichTarget proxy deployed to -> ${deploymentAddress}`);
  log(`ETSEnrichTarget implementation deployed to -> ${implementationAddress}`);
  log("====================================================");
};
module.exports.tags = ["ETSEnrichTarget"];
module.exports.dependencies = ["ETSTarget"];
