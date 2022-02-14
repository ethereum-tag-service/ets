const { ethers, upgrades } = require("hardhat");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig, readNetworkConfig } = require("./utils/config.js");

module.exports = async ({
  getChainId,
  deployments
}) => {
    const {log, save} = deployments;
    const chainId = await getChainId();
    const networkConfig = readNetworkConfig();
    const ETSTag = await ethers.getContractFactory("ETSTag");
    let etsTagAddress;

    if (chainId == 31337) {
      let etsTag = await deployments.get('ETSTag');
      etsTagAddress = etsTag.address
    } else {
      etsTagAddress = networkConfig[chainId].contracts['ETSTag'].address;
    }

    const upgrade = await upgrades.upgradeProxy(etsTagAddress, ETSTag);
    await upgrade.deployTransaction.wait();
    const implementation = await upgrades.erc1967.getImplementationAddress(upgrade.address);

    // Verify & Update network configuration file.
    await verify("ETSTag", upgrade, implementation, []);
    await saveNetworkConfig("ETSTag", upgrade, implementation, true);

    const artifact = await deployments.getExtendedArtifact('ETSTag');
    let proxyDeployments = {
        address: upgrade.address,
        ...artifact
    }
    await save('ETSTag', proxyDeployments);

    log("====================================================");
    log('ETSTag upgraded proxy -> ' + upgrade.address);
    log('ETSTag upgraded implementation -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['upgrade_all', 'upgrade_ets_tag'];
