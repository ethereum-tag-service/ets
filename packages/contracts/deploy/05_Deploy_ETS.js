const { ethers, upgrades } = require("hardhat");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig, readNetworkConfig } = require("./utils/config.js");

module.exports = async ({
  getChainId,
  deployments
}) => {
    const { save, log } = deployments;
    const networkConfig = readNetworkConfig();
    const chainId = await getChainId();
    const ETS = await ethers.getContractFactory("ETS");
    let etsAccessControlsAddress;
    let etsTagAddress;

    if (chainId == 31337) {
      let etsAccessControls = await deployments.get('ETSAccessControls');
      let etsTag = await deployments.get('ETSTag');
      etsAccessControlsAddress = etsAccessControls.address
      etsTagAddress = etsTag.address
    } else {
      etsAccessControlsAddress = networkConfig[chainId].contracts['ETSAccessControls'].address;
      etsTagAddress = networkConfig[chainId].contracts['ETSTag'].address;
    }

    // Deploy ETS core using OpenZeppelin upgrades plugin.
    const deployment = await upgrades.deployProxy(
      ETS,
      [etsAccessControlsAddress, etsTagAddress],
      { kind: "uups" },
    );
    await deployment.deployed();
    const implementation = await upgrades.erc1967.getImplementationAddress(deployment.address);

    // Verify & Update network configuration file.
    await verify("ETS", deployment, implementation, []);
    await saveNetworkConfig("ETS", deployment, implementation, false);

    // Add to hardhat-deploy deployments.
    artifact = await deployments.getExtendedArtifact('ETS');
    proxyDeployments = {
      address: deployment.address,
      ...artifact
    }
    await save('ETS', proxyDeployments);

    log("====================================================");
    log('ETS proxy deployed to -> ' + deployment.address);
    log('ETS implementation deployed to -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['ets'];
module.exports.dependencies = ['ets_tag', 'ets_access_controls']
