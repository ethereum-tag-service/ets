const { ethers, upgrades } = require("hardhat");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig, readNetworkConfig } = require("./utils/config.js");
// const { networkConfig } = require('./../helper-hardhat-config');

module.exports = async ({
  getChainId,
  getNamedAccounts,
  deployments
}) => {
    const { save, log } = deployments;
    const {ETSPlatform} = await getNamedAccounts();
    const networkConfig = readNetworkConfig();
    const chainId = await getChainId();
    const ETSTag = await ethers.getContractFactory("ETSTag");
    let etsAccessControlsAddress;

    if (chainId == 31337) {
      let etsAccessControls = await deployments.get('ETSAccessControls');
      etsAccessControlsAddress = etsAccessControls.address;
    } else {
      etsAccessControlsAddress = networkConfig[chainId].contracts['ETSAccessControls'].address;
    }

    // Deploy ETSTag
    const deployment = await upgrades.deployProxy(
      ETSTag,
      [etsAccessControlsAddress, ETSPlatform],
      { kind: "uups" },
    );
    await deployment.deployed();
    const implementation = await upgrades.erc1967.getImplementationAddress(deployment.address);

    // Verify & Update network configuration file.
    await verify("ETSTag", deployment, implementation, []);
    await saveNetworkConfig("ETSTag", deployment, implementation, false);

    // Add to deployments.
    let artifact = await deployments.getExtendedArtifact('ETSTag');
    let proxyDeployments = {
      address: deployment.address,
      ...artifact
    }
    await save('ETSTag', proxyDeployments);

    log("====================================================");
    log('ETSTag proxy deployed to -> ' + deployment.address);
    log('ETSTag implementation deployed to -> ' + implementation);
    log("====================================================");

};
module.exports.tags = ['ets_tag'];
module.exports.dependencies = ['ets_access_controls']
