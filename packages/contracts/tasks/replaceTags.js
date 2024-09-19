task(
  "replaceTags",
  'Replace tags in a tagging record. eg: hh replaceTags --tags "#USDC, #Solana" --uri "https://google.com" --network localhost',
)
  .addParam("uri", 'URI being tagged eg. --uri "https://google.com"')
  .addParam("tags", 'Hashtags separated by commas. eg. --tags "#USDC, #Solana"')
  .addParam("recordType", 'Arbitrary record type identifier. eg. "bookmark"', "bookmark")
  .addParam("relayer", "Relayer name")
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
    const etsAccessControlsABI = networkConfig.contracts.ETSAccessControls.abi;
    const etsAccessControlsAddress = networkConfig.contracts.ETSAccessControls.address;
    const etsABI = networkConfig.contracts.ETS.abi;
    const etsAddress = networkConfig.contracts.ETS.address;
    const etsRelayerV1ABI = networkConfig.contracts.ETSRelayerV1.abi;

    // Contract instances
    const etsAccessControls = new hre.ethers.Contract(
      etsAccessControlsAddress,
      etsAccessControlsABI,
      accounts[taskArgs.signer],
    );
    const ets = new hre.ethers.Contract(etsAddress, etsABI, accounts[taskArgs.signer]);

    // Check that Relayer that caller (signer) is using exists.
    const relayerAddress = await etsAccessControls.getRelayerAddressFromName(taskArgs.relayer);
    if ((await etsAccessControls.isRelayer(relayerAddress)) === false) {
      console.info(`"${taskArgs.relayer}" is not a relayer`);
      return;
    }
    const etsRelayerV1 = new ethers.Contract(relayerAddress, etsRelayerV1ABI, accounts[taskArgs.signer]);

    const tags = taskArgs.tags.replace(/\s+/g, "").split(","); // remove spaces & split on comma
    const targetURI = taskArgs.uri;
    const recordType = taskArgs.recordType;

    const tagParams = {
      targetURI: targetURI,
      tagStrings: tags,
      recordType: recordType,
    };

    const taggingRecordId = await ets.computeTaggingRecordIdFromRawInput(
      tagParams,
      relayerAddress,
      accounts[taskArgs.signer].address,
    );
    const existingRecord = await ets.taggingRecordExists(taggingRecordId);
    if (!existingRecord) {
      console.info("Tagging record not found");
      return;
    }

    // Calculate tagging fees
    let taggingFee = 0;
    const result = await etsRelayerV1.computeTaggingFee(
      tagParams,
      1, // 1 = replace
    );

    const { 0: fee, 1: actualTagCount } = result;
    taggingFee = fee;

    const tx = await etsRelayerV1.replaceTags([tagParams], {
      value: taggingFee,
      // gasPrice: ethers.utils.parseUnits("10", "gwei"), // do we need this?
      // gasLimit: 5000000, // do we need this?
    });
    console.info(`started txn ${tx.hash.toString()}`);
    tx.wait();
    console.info(`${actualTagCount} tag(s) replaced in ${taggingRecordId}`);
    console.info(`${taskArgs.signer} charged for ${actualTagCount} tags`);
  });
