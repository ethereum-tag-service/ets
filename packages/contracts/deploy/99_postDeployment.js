const { ethers, network } = require("hardhat");
const { setup } = require("./utils/setup.js");

module.exports = async ({ deployments }) => {
  console.info("============ STARTING POST-DEPLOYMENT CONFIGURATION ============");

  let accounts;
  try {
    const setupResult = await setup();
    accounts = setupResult.accounts;
    console.info("Setup completed successfully");
    console.info("ETSAdmin address:", accounts.ETSAdmin.address);
    console.info("ETSPlatform address:", accounts.ETSPlatform.address);
    console.info("ETSOracle address:", accounts.ETSOracle.address);
  } catch (error) {
    console.error("Error during setup:", error);
    throw error;
  }

  try {
    const etsAccessControls = await deployments.get("ETSAccessControls");
    console.info("ETSAccessControls address:", etsAccessControls.address);
    const ETSAccessControls = await ethers.getContractAt("ETSAccessControls", etsAccessControls.address);

    const etsTokenDeployment = await deployments.get("ETSToken");
    console.info("ETSToken address:", etsTokenDeployment.address);
    const ETSToken = await ethers.getContractAt("ETSToken", etsTokenDeployment.address);

    const etsAuctionHouse = await deployments.get("ETSAuctionHouse");
    console.info("ETSAuctionHouse address:", etsAuctionHouse.address);

    const etsTarget = await deployments.get("ETSTarget");
    console.info("ETSTarget address:", etsTarget.address);
    const ETSTarget = await ethers.getContractAt("ETSTarget", etsTarget.address);

    const etsEnrichTarget = await deployments.get("ETSEnrichTarget");
    console.info("ETSEnrichTarget address:", etsEnrichTarget.address);

    const ets = await deployments.get("ETS");
    console.info("ETS address:", ets.address);

    const etsRelayerFactory = await deployments.get("ETSRelayerFactory");
    console.info("ETSRelayerFactory address:", etsRelayerFactory.address);
    const ETSRelayerFactory = await ethers.getContractAt("ETSRelayerFactory", etsRelayerFactory.address);

    console.info("============ CONFIGURE ROLES & APPROVALS ============");
    console.info("See /packages/contracts/deploy/deploy.js for settings.");

    let hardhat_automine;
    if (network.config.chainId === 31337) {
      hardhat_automine = await network.provider.send("hardhat_getAutomine");
      console.info("Initial Hardhat automine setting:", hardhat_automine);

      if (hardhat_automine === false) {
        await network.provider.send("evm_setAutomine", [true]);
        console.info("Hardhat automine set to", await network.provider.send("hardhat_getAutomine"));
      }
    }

    console.info("Configuring role admins...");
    await ETSAccessControls.setRoleAdmin(
      await ETSAccessControls.RELAYER_FACTORY_ROLE(),
      await ETSAccessControls.RELAYER_ADMIN_ROLE(),
    );
    await ETSAccessControls.setRoleAdmin(
      await ETSAccessControls.RELAYER_ROLE(),
      await ETSAccessControls.RELAYER_FACTORY_ROLE(),
    );

    console.info("Granting roles...");
    await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), accounts.ETSAdmin.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), accounts.ETSPlatform.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), etsAccessControls.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), etsTokenDeployment.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.AUCTION_ORACLE_ROLE(), accounts.ETSPlatform.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.AUCTION_ORACLE_ROLE(), accounts.ETSOracle.address);
    await ETSAccessControls.grantRole(await ETSAccessControls.SMART_CONTRACT_ROLE(), accounts.ETSAdmin.address);

    console.info("Setting EnrichTarget...");
    await ETSTarget.connect(accounts.ETSPlatform).setEnrichTarget(etsEnrichTarget.address);

    console.info("Approving auction house...");
    await ETSToken.connect(accounts.ETSPlatform).setApprovalForAll(etsAuctionHouse.address, true);

    console.info("Setting ETS Core on ETSToken...");
    await ETSToken.connect(accounts.ETSPlatform).setETSCore(ets.address);

    console.info("Granting RELAYER_FACTORY_ROLE to ETSRelayerFactory...");
    await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_FACTORY_ROLE(), etsRelayerFactory.address);

    console.info("Adding relayer proxy for tests...");
    await ETSRelayerFactory.connect(accounts.ETSPlatform).addRelayer("ETSRelayer");

    if (network.config.chainId === 31337) {
      if (hardhat_automine === false && (await network.provider.send("hardhat_getAutomine"))) {
        await network.provider.send("evm_setAutomine", [false]);
        console.info("Hardhat automine set back to", await network.provider.send("hardhat_getAutomine"));
      }
    }

    console.info("============ POST-DEPLOYMENT CONFIGURATION COMPLETED ============");
  } catch (error) {
    console.error("Error during post-deployment configuration:", error);
    console.error("Error stack trace:", error.stack);
    throw error;
  }
};

module.exports.dependencies = ["ETSRelayerFactory"];
module.exports.tags = ["deployAll"];
