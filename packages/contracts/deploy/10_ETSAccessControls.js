const { upgrades } = require("hardhat");
const { setup } = require("./utils/setup.js");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({ deployments }) => {
  const { save, log } = deployments;
  [accounts, factories, initSettings] = await setup();

  // Deploy ETS Access Controls.
  const deployment = await upgrades.deployProxy(factories.ETSAccessControls, [accounts.ETSPlatform.address], {
    kind: "uups",
    pollingInterval: 3000,
    timeout: 0,
  });

  await deployment.waitForDeployment();
  const deploymentAddress = await deployment.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(deploymentAddress);

  if (process.env.VERIFY_ON_DEPLOY === "true") {
    // Verify & Update network configuration file.
    try {
      await verify("ETSAccessControls", deployment, implementationAddress, []);
    } catch (error) {
      console.error("Error verifying ETSAccessControls:", error);
    }
  }

  try {
    console.info("saving Network Config");
    await saveNetworkConfig("ETSAccessControls", deployment, implementationAddress, false);
  } catch (error) {
    console.error("Error saving ETSAccessControls network configuration:", error);
  }

  // Add to hardhat-deploy deployments.
  const artifact = await deployments.getExtendedArtifact("ETSAccessControls");
  const proxyDeployments = {
    address: deploymentAddress,
    ...artifact,
  };
  await save("ETSAccessControls", proxyDeployments);

  log("====================================================");
  log(`ETSAccessControls proxy deployed to -> ${deploymentAddress}`);
  log(`ETSAccessControls implementationAddress deployed to -> ${implementationAddress}`);
  log("====================================================");
};

module.exports.tags = ["ETSAccessControls"];
