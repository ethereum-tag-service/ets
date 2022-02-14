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
    const ETSEnsure = await ethers.getContractFactory("ETSEnsure");
    let etsAccessControlsAddress;
    let etsAddress;

    if (chainId == 31337) {
      let etsAccessControls = await deployments.get('ETSAccessControls');
      let ets = await deployments.get('ETS');
      etsAccessControlsAddress = etsAccessControls.address
      etsAddress = ets.address
    } else {
      etsAccessControlsAddress = networkConfig[chainId].contracts['ETSAccessControls'].address;
      etsAddress = networkConfig[chainId].contracts['ETS'].address;
    }

    // Deploy ETS core using OpenZeppelin upgrades plugin.
    const deployment = await upgrades.deployProxy(
      ETSEnsure,
      [etsAccessControlsAddress, etsAddress],
      { kind: "uups" },
    );
    await deployment.deployed();

    const implementation = await upgrades.erc1967.getImplementationAddress(deployment.address);

    // Verify & Update network configuration file.
    await verify("ETSEnsure", deployment, implementation, []);
    await saveNetworkConfig("ETSEnsure", deployment, implementation, false);

    // Add to hardhat-deploy deployments.
    artifact = await deployments.getExtendedArtifact('ETSEnsure');
    proxyDeployments = {
      address: deployment.address,
      ...artifact
    }
    await save('ETSEnsure', proxyDeployments);

    log("====================================================");
    log('ETSEnsure proxy deployed to -> ' + deployment.address);
    log('ETSEnsure implementation deployed to -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['ets_ensure'];
module.exports.dependencies = ['ets']
