const { ethers, network } = require("hardhat");
const { setup } = require("./utils/setup.js");

module.exports = async ({ deployments }) => {
  [accounts, factories, initSettings] = await setup();

  const etsAccessControls = await deployments.get("ETSAccessControls");
  const ETSAccessControls = await ethers.getContractAt("ETSAccessControls", etsAccessControls.address);
  const etsToken = await deployments.get("ETSToken");
  const ETSToken = await ethers.getContractAt("ETSToken", etsToken.address);
  const etsAuctionHouse = await deployments.get("ETSAuctionHouse");
  const _ETSAuctionHouse = await ethers.getContractAt("ETSAuctionHouse", etsAuctionHouse.address);
  const etsTarget = await deployments.get("ETSTarget");
  const ETSTarget = await ethers.getContractAt("ETSTarget", etsTarget.address);
  const etsEnrichTarget = await deployments.get("ETSEnrichTarget");
  const _ETSEnrichTarget = await ethers.getContractAt("ETSEnrichTarget", etsEnrichTarget.address);
  const ets = await deployments.get("ETS");
  const _ETS = await ethers.getContractAt("ETS", ets.address);
  const etsRelayerFactory = await deployments.get("ETSRelayerFactory");
  const ETSRelayerFactory = await ethers.getContractAt("ETSRelayerFactory", etsRelayerFactory.address);

  console.info("============ CONFIGURE ROLES & APPROVALS ============");
  console.info("See /packages/contracts/deploy/deploy.js for settings.");

  let hardhat_automine; // = await network.provider.send("hardhat_getAutomine");
  if (network.config.chainId === 31337) {
    hardhat_automine = await network.provider.send("hardhat_getAutomine");

    // if automine is off, enable it to apply these settings faster.
    if (hardhat_automine === false) {
      await network.provider.send("evm_setAutomine", [true]);
      console.info("Hardhat automine set to", await network.provider.send("hardhat_getAutomine"));
    }
  }

  // Allows relayer admin role to grant relayer factory role.
  await ETSAccessControls.setRoleAdmin(
    await ETSAccessControls.RELAYER_FACTORY_ROLE(),
    await ETSAccessControls.RELAYER_ADMIN_ROLE(),
  );

  // Allows relayer factory role to grant relayer role.
  await ETSAccessControls.setRoleAdmin(
    await ETSAccessControls.RELAYER_ROLE(),
    await ETSAccessControls.RELAYER_FACTORY_ROLE(),
  );

  await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), accounts.ETSAdmin.address);
  await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), accounts.ETSPlatform.address);

  await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), etsAccessControls.address);
  await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_ADMIN_ROLE(), etsToken.address);

  // Set auction oracle roles.
  await ETSAccessControls.grantRole(await ETSAccessControls.AUCTION_ORACLE_ROLE(), accounts.ETSPlatform.address);
  await ETSAccessControls.grantRole(await ETSAccessControls.AUCTION_ORACLE_ROLE(), accounts.ETSOracle.address);
  await ETSAccessControls.grantRole(await ETSAccessControls.SMART_CONTRACT_ROLE(), accounts.ETSAdmin.address);

  await ETSTarget.connect(accounts.ETSPlatform).setEnrichTarget(etsEnrichTarget.address);

  // Approve auction house contract to move tokens owned by platform.
  await ETSToken.connect(accounts.ETSPlatform).setApprovalForAll(etsAuctionHouse.address, true);

  // Set ETS Core on ETSToken.
  await ETSToken.connect(accounts.ETSPlatform).setETSCore(ets.address);

  // Grant RELAYER_FACTORY_ROLE to ETSRelayerFactory so it can deploy relayer contracts.
  await ETSAccessControls.grantRole(await ETSAccessControls.RELAYER_FACTORY_ROLE(), etsRelayerFactory.address);

  // Add a relayer proxy for use in tests. Note: ETSPlatform not required to own CTAG to add relayer.
  await ETSRelayerFactory.connect(accounts.ETSPlatform).addRelayer("ETSRelayer");

  // This turns automine off, so hardhat blockchain mines sequentially.
  if (network.config.chainId === 31337) {
    // Disable automine if it was originally disabled.
    if (hardhat_automine === false && (await network.provider.send("hardhat_getAutomine"))) {
      await network.provider.send("evm_setAutomine", [false]);
      console.info("Hardhat automine set to", await network.provider.send("hardhat_getAutomine"));
    }
  }
};

//module.exports.dependencies = ["ETSRelayerFactory"];
//module.exports.tags = ["deployAll"];
