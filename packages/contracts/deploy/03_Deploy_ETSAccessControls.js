const { ethers, upgrades } = require("hardhat");
const { verify } = require("./utils/verify.js");
const { saveNetworkConfig } = require("./utils/config.js");

module.exports = async ({
  getNamedAccounts,
  deployments
}) => {
    const { save, log } = deployments;
    const {ETSAdmin, ETSPublisher} = await getNamedAccounts();
    const ETSAccessControls = await ethers.getContractFactory("ETSAccessControls");

    // Deploy ETS Access Controls.
    const deployment = await upgrades.deployProxy(ETSAccessControls, { kind: "uups" });
    await deployment.deployed();
    const implementation = await upgrades.erc1967.getImplementationAddress(deployment.address);

    // Verify & Update network configuration file.
    await verify("ETSAccessControls", deployment, implementation, []);
    await saveNetworkConfig("ETSAccessControls", deployment, implementation, false);

    // Add to hardhat-deploy deployments.
    let artifact = await deployments.getExtendedArtifact('ETSAccessControls');
    let proxyDeployments = {
        address: deployment.address,
        ...artifact
    }
    await save('ETSAccessControls', proxyDeployments);

    // Initialize some application level settings.
    // TODO: consider moving this into it's own script?
    await deployment.grantRole(
      await deployment.SMART_CONTRACT_ROLE(),
      ETSAdmin,
      {
        from: ETSAdmin,
      },
    );
    // add a publisher to the protocol
    // await deployment.grantRole(ethers.utils.id("PUBLISHER"), ETSPublisher);

    log("====================================================");
    log('ETSAccessControls proxy deployed to -> ' + deployment.address);
    log('ETSAccessControls implementation deployed to -> ' + implementation);
    log("====================================================");
};

module.exports.tags = ['ets_access_controls'];
//module.exports.dependencies = ['api']
