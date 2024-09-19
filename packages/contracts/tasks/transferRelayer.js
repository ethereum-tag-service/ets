task("transferRelayer", "Transfers relayer to a new owner")
  .addParam("relayer", "Relayer name.")
  .addParam("to", "New owner address.", "0x0000000000000000000000000000000000000000")
  .addParam(
    "signer",
    'Named wallet accounts. options are "account0", "account1", "account2", "account3", "account4", "account5". Defaults to "account0"',
    "account0",
  )
  .setAction(async (taskArgs) => {
    const { getAccounts } = require("./utils/getAccounts");
    const accounts = await getAccounts();

    // Load network configuration
    const networkConfig = require(`../src/chainConfig/${hre.network.name}.json`);

    // ABIs and Contract addresses from network configuration
    const ETSAccessControlsABI = networkConfig.contracts.ETSAccessControls.abi;
    const ETSAccessControlsAddress = networkConfig.contracts.ETSAccessControls.address;

    // Contract instances
    const etsAccessControls = new hre.ethers.Contract(
      ETSAccessControlsAddress,
      ETSAccessControlsABI,
      accounts[taskArgs.signer],
    );

    // Check that caller is using a valid relayer.
    let etsRelayerV1;
    const relayerAddress = await etsAccessControls.getRelayerAddressFromName(taskArgs.relayer);
    if ((await etsAccessControls.isRelayerByAddress(relayerAddress)) === false) {
      console.info(`"${taskArgs.relayer}" is not a relayer`);
      return;
    }

    if (accounts[taskArgs.signer].address !== (await etsRelayerV1.getOwner())) {
      console.info(`${taskArgs.signer} is not the owner of "${taskArgs.relayer}" relayer contract`);
      return;
    }

    if (!(await etsRelayerV1.paused())) {
      console.info("Relayer must be paused before transferring");
      return;
    }

    const tx = await etsRelayerV1.changeOwner(taskArgs.to);
    await tx.wait();

    if ((await etsRelayerV1.getOwner()) === taskArgs.to) {
      console.info(`Relayer transferred to ${taskArgs.to}`);
    }
  });
