
/**
 * Generate subgraph.yaml file automatically.
 *
 * Usage: ./generate-yaml.js --deployment [network]
 * Where [network] is the destination the subgraph.
 * See const networks for supported networks.
**/
const configFile = "./../hardhat/config/config.json";
const fs = require("fs-extra");
const Handlebars = require("handlebars");

// Custom map of network name to chainId. The graph doesn't have standard
// network names, so we have to build this up here.
const networks = {
  mainnet: {
    chainId: 1,
    name: "mainnet",
  },
  mumbai: {
    chainId: 80001,
    name: "mumbai",
  },
  localhost: {
    chainId: 31337,
    name: "mainnet", // Subgraph localhost uses "mainnet"
  },
};

const args = process.argv.slice(2);
const network = args[1];

if (!network) {
  console.error(`missing --deployment [network] argument`);
  return;
}

if (!networks[network]) {
  console.log(`target network ${network} not known`);
  return;
}

let config;
try {
  config = JSON.parse(fs.readFileSync(configFile).toString());
} catch (err) {
  if (err.code === "ENOENT") {
    console.log("Config not found!");
  } else {
    throw err;
  }
}

const chainId = networks[network].chainId;

const contractsInfo = {
  contracts: config.networks[chainId].contracts,
  network: networks[network].name,
};
const template = Handlebars.compile(fs.readFileSync("./templates/subgraph.yaml").toString());
const result = template(contractsInfo);
fs.writeFileSync("./subgraph.yaml", result);

console.log(network + " configuration file written to /subgraph/subgraph.yaml");
 