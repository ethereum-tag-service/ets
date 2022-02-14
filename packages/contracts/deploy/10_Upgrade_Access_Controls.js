const { ethers, upgrades } = require("hardhat");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig, readNetworkConfig } = require("./utils/config.js");

module.exports = async ({
  getChainId,
  getNamedAccounts,
  deployments
}) => {
    const {log, save} = deployments;
    const networkConfig = readNetworkConfig();
    const chainId = await getChainId();
    const {ETSAdmin} = await getNamedAccounts();
    const ETSAccessControls = await ethers.getContractFactory("ETSAccessControls");
    let etsAccessControlsAddress;

    if (chainId == 31337) {
      let etsAccessControls = await deployments.get('ETSAccessControls');
      etsAccessControlsAddress = etsAccessControls.address
    } else {
      etsAccessControlsAddress = networkConfig[chainId].contracts['ETSAccessControls'].address;
    }

    const upgrade = await upgrades.upgradeProxy(
      etsAccessControlsAddress,
      ETSAccessControls,
    );
    await upgrade.deployTransaction.wait();
    implementation = await upgrades.erc1967.getImplementationAddress(upgrade.address);

    // Verify & Update network configuration file.
    await verify("ETSAccessControls", upgrade, implementation, []);
    await saveNetworkConfig("ETSAccessControls", upgrade, implementation, true);

    const artifact = await deployments.getExtendedArtifact('ETSAccessControls');
    let proxyDeployments = {
        address: upgrade.address,
        ...artifact
    }
    await save('ETSAccessControls', proxyDeployments);

    log("====================================================");
    log('ETSAccessControls upgraded proxy -> ' + upgrade.address);
    log('ETSAccessControls upgraded implementation -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['upgrade_all', 'upgrade_access_controls'];
