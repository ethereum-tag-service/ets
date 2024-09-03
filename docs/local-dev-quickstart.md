# Local development quickstart

This guide will get you up and running with the full ETS stack running locally, including contracts, subgraph, auction oracle and the ETS Explorer for visualizing ETS data.

First, make a fork of the main ETS repository located at <https://github.com/ethereum-tag-service/ets>

Clone your forked repository to your local system, eg.

```bash
git clone git@github.com:mhpaler/ets.git ets
```

Install ETS

```bash
cd ets
pnpm install
```

Make a copy of `.env.example` in the project root named `.env`.
The default settings in there should be enough to get you going.

The following should all be run from the project root.

## Contracts

Open a tab in your terminal and start the local Hardhat blockchain

```bash
pnpm hardhat:start
```

Open another tab and compile and deploy the contracts

```bash
pnpm hardhat:deploy
```

note addresses for all locally deployed contracts are saved to `config/config.json`

## Subgraph

```bash
👉 Start Docker desktop 👈
```

Next, open another terminal tab and run the following (still from the project root) to start your local graph node:

```bash
pnpm graph:node-start
```

Next, open another terminal tab and run the following to generate & deploy the ets subgraph to the local node:

```bash
pnpm graph:deploy-local
```

If everything is successful, the deployment url of your local subgraph will be printed out, which you can copy and paste into a browser to use the local subgraph explorer. Your query end-point will also be printed out.

## ETS Explorer App

To easily visualize data written locally, you'll probably find the ETS Explorer App useful. This is the same explorer running at [app.ets.xyz](https://app.ets.xyz).

If you wish run the explorer locally, with it reading and writing from your local stack, set the .env variables as follows:

```bash
NETWORK="localhost"
NEXT_PUBLIC_ETS_ENVIRONMENT="development"
```

Open another tab in your terminal, still in the project root and run:

```bash
pnpm run dev
```

If you're lucky and everything fired up, at this point you are ready to begin interacting with ETS. Head to the [JavaScript client quickstart](./js-client-quickstart.md) to begin.

### Running explorer locally, read/write from Testnet

If you wish run the explorer locally, but have it interact with the ETS testnet contracts & corresponding subgraph, use the following environment variables before running `pnpm run dev`

```bash
NETWORK="arbitrumSepolia"
NEXT_PUBLIC_ETS_ENVIRONMENT="stage"
```

If you intend to write blockchain records on to the ETS testnet contracts, you'll need to fill out the following `.env` variables:

```bash
MNEMONIC_TESTNET=
NEXT_PUBLIC_ALCHEMY_KEY=
```

For more detailed rundown of the dev stack, please see our [Development Stack Overview (todo)](./dev-stack.md).

## Deployment

### Quickstart

Configure hardhat.config.js to meet your needs, then from within the contracts root, run

```bash
# for localhost
pnpm hardhat:deploy

# for testnet
pnpm hardhat:deploy-testnet-stage

# Or calling hardhat directly, from within packages/contracts
hardhat deploy --tags deployAll --network localhost
```

If you are deploying to an EVM chain that has contract verification (eg. Mainnet, Polygon) and would like the contracts to be verified set the following environment variable:

```bash
VERIFY_ON_DEPLOY=true
```

### Deployment details

ETS deployment scripts rely heavily on [Hardhat Deploy](https://www.npmjs.com/package/hardhat-deploy) and [Open Zeppelin Upgrades](https://www.npmjs.com/package/@openzeppelin/hardhat-upgrades) plugins.

For granularity, each contract is deployed with a different script. Settings common or reused
between scripts are in `setup.js`.

Order of deployment is important. This is controlled by the `tag` and a `dependency` features
provided by hardhat-deploy. Deployment begins by passing the `deployAll` tag to hardhat-deploy (see
`deploy.js`). `deployAll` it claims as dependency the last script to be deployed (ETSTargetTagger).
ETSTargetTagger.js in turn sets its dependency (ETS). This dependency chain continues until it
reaches the last dependency (ETSAccessControls) at which point the contracts start deploying from
the last dependency (ETSAccessControls) to the first (ETSTargetTagger).

Once everything is deployed, the final configuration settings in `deploy.js` are executed.

We use [Ethernal](https://doc.tryethernal.com/) as a rapid development tool. If you have Ethernal
enabled, fill out the following in your `.env file` and each contract will be verified as it's
deployed to Ethernal:

```text
ETHERNAL_EMAIL=
ETHERNAL_PASSWORD=
ETHERNAL_DISABLED=false
ETHERNAL_WORKSPACE=
```

Setting `ETHERNAL_DISABLED=false` for on chain deployments will attempt to verify the contracts
using the verify task provided by [hardhat-etherscan](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan). For more details see `utils/verify.js`
