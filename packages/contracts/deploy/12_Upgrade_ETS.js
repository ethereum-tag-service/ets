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
    const ETS = await ethers.getContractFactory("ETS");
    let etsAddress;

    if (chainId == 31337) {
      let ets = await deployments.get('ETS');
      etsAddress = ets.address
    } else {
      etsAddress = networkConfig[chainId].contracts['ETS'].address;
    }

    const upgrade = await upgrades.upgradeProxy(etsAddress, ETS);
    await upgrade.deployTransaction.wait();
    const implementation = await upgrades.erc1967.getImplementationAddress(upgrade.address);

    // Verify & Update network configuration file.
    await verify("ETS", upgrade, implementation, []);
    await saveNetworkConfig("ETS", upgrade, implementation, true);

    const artifact = await deployments.getExtendedArtifact('ETS');
    let proxyDeployments = {
        address: upgrade.address,
        ...artifact
    }
    await save('ETS', proxyDeployments);

    log("====================================================");
    log('ETS upgraded proxy -> ' + upgrade.address);
    log('ETS upgraded implementation -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['upgrade_all', 'upgrade_ets'];
