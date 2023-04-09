task(
  "applyTags",
  'Tag a uri. eg: hh applyTags --tags "#USDC, #Solana" --uri "https://google.com" --recordType "bookmark" --relayer "Uniswap" --network localhost',
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
    const chainId = hre.network.config.chainId;
    const accounts = await getAccounts();
    const config = require("../config/config.json");

    // ABIs
    const etsAccessControlsABI = require("../abi/contracts/ETSAccessControls.sol/ETSAccessControls.json");
    const etsRelayerV1ABI = require("../abi/contracts/relayers/ETSRelayerV1.sol/ETSRelayerV1.json");
    const etsABI = require("../abi/contracts/ETS.sol/ETS.json");

    // Contract addresses
    const etsAccessControlsAddress = config[chainId].contracts.ETSAccessControls.address;
    const etsAddress = config[chainId].contracts.ETS.address;

    // Contract instances
    const etsAccessControls = new ethers.Contract(
      etsAccessControlsAddress,
      etsAccessControlsABI,
      accounts[taskArgs.signer],
    );
    const ets = new ethers.Contract(etsAddress, etsABI, accounts[taskArgs.signer]);

    // Check that Relayer that caller (signer) is using exists.
    let etsRelayerV1;
    const relayerAddress = await etsAccessControls.getRelayerAddressFromName(taskArgs.relayer);
    if ((await etsAccessControls.isRelayer(relayerAddress)) === false) {
      console.log(`"${taskArgs.relayer}" is not a relayer`);
      return;
    } else {
      etsRelayerV1 = new ethers.Contract(relayerAddress, etsRelayerV1ABI, accounts[taskArgs.signer]);
    }

    const tags = taskArgs.tags.replace(/\s+/g, "").split(","); // remove spaces & split on comma
    const targetURI = taskArgs.uri;
    const recordType = taskArgs.recordType;

    const tagParams = {
      "targetURI": targetURI,
      "tagStrings": tags,
      "recordType": recordType,
      "enrich": false,
    };

    const taggingRecordId = await ets.computeTaggingRecordIdFromRawInput(
      tagParams,
      relayerAddress,
      accounts[taskArgs.signer].address,
    );
    const existingRecord = await ets.taggingRecordExists(taggingRecordId);

    // Calculate tagging fees
    let taggingFee = 0;
    let result = await etsRelayerV1.computeTaggingFee(
      tagParams,
      0,
    );

    let { 0: fee, 1: actualTagCount } = result;
    taggingFee = fee;

    const tx = await etsRelayerV1.applyTags([tagParams], {
      value: taggingFee,
      // gasPrice: ethers.utils.parseUnits("10", "gwei"), // do we need this?
      // gasLimit: 5000000, // do we need this?
    });

    console.log(`started txn ${tx.hash.toString()}`);
    tx.wait();

    if (existingRecord) {
      console.log(`${actualTagCount} tag(s) appended to ${taggingRecordId}`);
    } else {
      console.log(`New tagging record created with ${actualTagCount} tag(s) and id: ${taggingRecordId}`);
    }
    console.log(`${taskArgs.signer} charged for ${actualTagCount} tags`);
  });
