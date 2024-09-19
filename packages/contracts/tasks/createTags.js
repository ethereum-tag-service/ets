const { ethers } = require("ethers");

task("createTags", "Create CTAGs")
  .addParam("tags", 'Hashtags separated by commas. eg. --tags "#USDC, #Solana"')
  .addParam("relayer", "Relayer name.")
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
    const ETSTokenABI = networkConfig.contracts.ETSToken.abi;
    const ETSTokenAddress = networkConfig.contracts.ETSToken.address;
    const ETSAccessControlsABI = networkConfig.contracts.ETSAccessControls.abi;
    const ETSAccessControlsAddress = networkConfig.contracts.ETSAccessControls.address;
    const ETSRelayerV1ABI = networkConfig.contracts.ETSRelayerV1.abi;

    // Contract instances
    const etsAccessControls = new hre.ethers.Contract(
      ETSAccessControlsAddress,
      ETSAccessControlsABI,
      accounts[taskArgs.signer],
    );

    const etsToken = new hre.ethers.Contract(ETSTokenAddress, ETSTokenABI, accounts[taskArgs.signer]);

    // Check that caller is using a valid relayer.
    let etsRelayerV1;
    const relayerAddress = await etsAccessControls.getRelayerAddressFromName(taskArgs.relayer);
    if ((await etsAccessControls.isRelayer(relayerAddress)) === false) {
      console.info(`"${taskArgs.relayer}" is not a relayer`);
      return;
    }
    etsRelayerV1 = new ethers.Contract(relayerAddress, ETSRelayerV1ABI, accounts[taskArgs.signer]);

    const tags = taskArgs.tags.replace(/\s+/g, "").split(","); // remove spaces & split on comma
    const tagsToMint = [];

    for (let i = 0; i < tags.length; i++) {
      const tagId = await etsToken.computeTagId(tags[i]); // creating a deterministic hash
      if (await etsToken.tagExistsById(tagId)) {
        console.info(`${tags[i]} already exists`);
      } else {
        tagsToMint.push(tags[i]);
      }
    }

    if (tagsToMint.length > 0) {
      console.info(`Minting CTAGs "${tagsToMint.toString()}"`);
      const tx = await etsRelayerV1.getOrCreateTagIds(tagsToMint);
      await tx.wait();

      for (let i = 0; i < tagsToMint.length; i++) {
        const tagId = await etsToken.computeTagId(tags[i]);
        if (await etsToken.tagExistsById(tagId)) {
          console.info(`"${tagsToMint[i]}" minted by ${taskArgs.signer} with id ${tagId}`);
        }
      }
    }
  });
