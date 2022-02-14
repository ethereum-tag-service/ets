// Import dependencies available in the autotask environment
import { ethers } from 'ethers';
import { DefenderRelayProvider } from 'defender-relay-client/lib/ethers';
import { DefenderRelaySigner } from 'defender-relay-client/lib/ethers';

// Import ABIs which will be embedded into the generated js
import ETSAbi from '@ets/contracts/abi/contracts/core/ETS.sol/ETS.json';
import ETSAccessControlsAbi from '@ets/contracts/abi/contracts/core/ETSAccessControls.sol/ETSAccessControls.json';
import ETSEnsureAbi from '@ets/contracts/abi/contracts/core/ETSEnsure.sol/ETSEnsure.json';
import networkConfig from '@ets/contracts/config/config';

//import { ETSAbi } from "@ets/contracts";
// console.log(ETSAbi);

const axios = require('axios');

export async function main(signer, targetId) {

  console.log(abi.ets);

  // Address of ETS on mumbai.
  const ETSAddress = networkConfig[80001].contracts['ETS'].address;

  const ets = new ethers.Contract(ETSAddress, ETSAbi, signer);

  console.log("Using contracts on Mumbai:");
  console.log("ETS: ", ETSAddress);
  console.log("ETSEnsure: ", await ets.etsEnsure());
  console.log("AccessControls: ", await ets.accessControls());

  const etsAccessControls = new ethers.Contract(await ets.accessControls(), ETSAccessControlsAbi, signer);
  const etsEnsure = new ethers.Contract(await ets.etsEnsure(), ETSEnsureAbi, signer);
  const relayer = await signer.getAddress();

  // Check that relayer is whitelisted as a publisher on ETS.
  if (!await etsAccessControls.isPublisher(relayer)) {
    throw `Relayer ${relayer} is not a whitelisted publisher.`;
  }

  // struct Target {
  //   string targetType;
  //   string targetURI;
  //   uint created;
  //   uint lastEnsured;
  //   uint status;
  //   string ipfsHash;
  // }
  // Fetch the target record from the targetId.
  const target = await ets.targets(targetId);

  // Construct our ensure api Url using targetType & targetURI.
  // eg. https://ipfsapiets.herokuapp.com/api/v1/nft/0x8ee9a60cb5c0e7db414031856cb9e0f1f05988d1/3061/1
  const parts = ["https://ipfsapiets.herokuapp.com/api/v1", target[0], target[1]];
  let apiEndpoint = parts.join("/").replace(/\|/g , "/");
  apiEndpoint = apiEndpoint.toString();

  console.log(`fetching from ${apiEndpoint}`);
  // Fetch target metadata from the ensure api.
  let res = await axios({
    method: "GET",
    url: apiEndpoint,
  });

  let ipfsHash, status;
  if (res.status == 200) {
    ipfsHash = res.data.IpfsHash;
    status = res.status;
  } else {
    status = res.status;
  };

  console.log(`fulfill with: ${targetId} | ${ipfsHash} | ${status}`);
  // Pass data back to the blockchain.
  // fulfillEnsureTarget(uint256 targetId, string calldata ipfsHash, uint status)
  const txn = await etsEnsure.fulfillEnsureTarget(targetId, ipfsHash, status);
  console.log(`Added ipfsHash ${ipfsHash} to targetId ${targetId}`);

}

// Entrypoint for the Autotask
export async function handler(event) {

  // Pull in alchemy node api key from Defender secrets store.
  //const { alchemyMumbai } = event.secrets;
  //const provider = new ethers.providers.AlchemyProvider(network="maticmum", alchemyMumbai);
  let targetId;
  if (event.targetId) {
    targetId = event.targetId;
  } else {
    targetId = event.request.body.matchReasons[0].params.targetId;
  }

  // Uncomment to use the native defender provider, instead of Alchemy or Infura.
  const provider = new DefenderRelayProvider(event);
  const signer = new DefenderRelaySigner(event, provider, { speed: 'fast' });
  return main(signer, targetId);
}

// Set things up to run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  require('dotenv').config();

  // First, pull in relayer credentials from .env.
  // When running locally, this code will actually use the relayer
  // created up on OZD using the Key & Secret given to us when creating
  // a relayer up there.
  const { 
    API_KEY: apiKey,
    API_SECRET: apiSecret,
  } = process.env;

  // For local testing, use an existing targetId from Mumbai.
  const targetId = "97023098820522728963627118417100062339680255841042467736697149048076665812973";

  handler({apiKey, apiSecret, targetId})
    .then(() => process.exit(0))
    .catch((error) => { console.error(error); process.exit(1); });
}
