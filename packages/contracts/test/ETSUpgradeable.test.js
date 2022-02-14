const { expectEvent } = require("@openzeppelin/test-helpers");
const { ethers, upgrades, artifacts } = require("hardhat");
const { assert } = require("chai");

let factories, artifact, deployed, accounts;

before("get factories", async function () {
  artifact = {
    ETSAccessControlsUpgrade: await artifacts.readArtifactSync("ETSAccessControlsUpgrade"),
  };

  factories = {
    ETSAccessControls: await ethers.getContractFactory("ETSAccessControls"),
    ETSAccessControlsUpgrade: await ethers.getContractFactory("ETSAccessControlsUpgrade"),
    ETSTag: await ethers.getContractFactory("ETSTag"),
    ETSTagUpgrade: await ethers.getContractFactory("ETSTagUpgrade"),
    ETS: await ethers.getContractFactory("ETS"),
    ETSUpgrade: await ethers.getContractFactory("ETSUpgrade"),
  };

  // See namedAccounts section of hardhat.config.js
  const namedAccounts = await ethers.getNamedSigners();
  accounts = {
    ETSAdmin: namedAccounts["ETSAdmin"],
    ETSPublisher: namedAccounts["ETSPublisher"],
    ETSPlatform: namedAccounts["ETSPlatform"],
  };

  // Set deployed contract placeholders so they are shareable b/w tests.
  deployed = {
    ETSAccessControls: {},
    ETSTag: {},
    ETS: {},
  };
});

describe("ETSAccessControl", function () {
  it("is upgradeable", async function () {
    // Deploy the initial proxy contract.
    deployed.ETSAccessControls = await upgrades.deployProxy(factories.ETSAccessControls, { kind: "uups" });
    assert((await deployed.ETSAccessControls.isAdmin(accounts.ETSAdmin.address)) === true);

    // Upgrade the proxy.
    deployed.ETSAccessControls = await upgrades.upgradeProxy(
      deployed.ETSAccessControls.address,
      factories.ETSAccessControlsUpgrade,
    );

    const deployTxn = deployed.ETSAccessControls.deployTransaction.hash;
    await expectEvent.inTransaction(deployTxn, artifact.ETSAccessControlsUpgrade, "Upgraded");
    assert((await deployed.ETSAccessControls.isAdmin(accounts.ETSAdmin.address)) === true);
    assert((await deployed.ETSAccessControls.upgradeTest()) === true);
  });
});

describe("ETSTag", function () {
  it("is upgradeable", async function () {
    // Deploy the initial proxy contract.
    deployed.ETSTag = await upgrades.deployProxy(
      factories.ETSTag,
      [deployed.ETSAccessControls.address, accounts.ETSPlatform.address],
      { kind: "uups" },
    );

    assert((await deployed.ETSTag.name()) === "Ethereum Tag Service");
    assert((await deployed.ETSTag.symbol()) === "ETSTAG");

    // Upgrade the proxy.
    deployed.ETSTag = await upgrades.upgradeProxy(
      deployed.ETSTag.address,
      factories.ETSTagUpgrade,
    );

    const deployTxn = deployed.ETSTag.deployTransaction.hash;
    await expectEvent.inTransaction(deployTxn, artifact.ETSAccessControlsUpgrade, "Upgraded");
    assert((await deployed.ETSTag.name()) === "Ethereum Tag Service");
    assert((await deployed.ETSTag.symbol()) === "ETSTAG");
    assert((await deployed.ETSTag.upgradeTest()) === true);
  });
});

describe("ETS", function () {
  it("is upgradeable", async function () {
    // Deploy the initial proxy contract.
    deployed.ETS = await upgrades.deployProxy(
      factories.ETS,
      [deployed.ETSAccessControls.address, deployed.ETSTag.address],
      { kind: "uups" },
    );

    // Upgrade the proxy.
    deployed.ETS = await upgrades.upgradeProxy(
      deployed.ETS.address,
      factories.ETSUpgrade,
    );
    const deployTxn = deployed.ETS.deployTransaction.hash;
    await expectEvent.inTransaction(deployTxn, artifact.ETSAccessControlsUpgrade, "Upgraded");
    assert((await deployed.ETS.upgradeTest()) === true);
  });
});
