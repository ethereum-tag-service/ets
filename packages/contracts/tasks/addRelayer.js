task(
  "addRelayer",
  'Add a relayer to the protocol. eg hardhat addRelayer --name "#Uniswap" --signer account3 --network localhost',
)
  .addParam("name", 'Relayer Name eg. "Uniswap"')
  .addParam(
    "signer",
    'Named wallet accounts. options are "account0", "account1", "account2", "account3", "account4", "account5". Defaults to "account0"',
    "account0",
  )
  .setAction(async (taskArgs) => {
    const { getAccounts } = require("./utils/getAccounts");

    // Load network configuration
    const networkConfig = require(`../src/chainConfig/${hre.network.name}.json`);
    const accounts = await getAccounts();

    // ABIs and Contract addresses from network configuration
    const ETSAccessControlsABI = networkConfig.contracts.ETSAccessControls.abi;
    const ETSAccessControlsAddress = networkConfig.contracts.ETSAccessControls.address;
    const ETSRelayerFactoryABI = networkConfig.contracts.ETSRelayerFactory.abi;
    const ETSRelayerFactoryAddress = networkConfig.contracts.ETSRelayerFactory.address;

    const etsAccessControls = new ethers.Contract(
      ETSAccessControlsAddress,
      ETSAccessControlsABI,
      accounts[taskArgs.signer],
    );

    const etsRelayerFactory = new ethers.Contract(
      ETSRelayerFactoryAddress,
      ETSRelayerFactoryABI,
      accounts[taskArgs.signer],
    );

    if ((await etsAccessControls.isRelayerByName(taskArgs.name)) === true) {
      console.info("Relayer name exists");
      return;
    }

    const tx = await etsRelayerFactory.addRelayer(taskArgs.name);
    console.info(`started txn ${tx.hash.toString()}`);
    await tx.wait();

    const relayerAddress = await etsAccessControls.getRelayerAddressFromName(taskArgs.name);
    console.info(`New relayer contract deployed at ${relayerAddress} by ${taskArgs.signer}`);
  });
