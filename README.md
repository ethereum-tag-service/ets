# Ethereum Tag Service

Ethereum Tag Service is the community-owned incentivized cross-chain content tagging protocol for the decentralized web.

This repository uses Turborepo and [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager.

- Website: [ets.xyz](https://ets.xyz)
- App: [app.ets.xyz](https://app.ets.xyz)
- Docs: [ets.xyz/docs](https://ets.xyz/docs)
- Twitter: [@etsxyz](https://twitter.com/etsxyz)
- Discord: ETS (soon)

## Contracts

v0.0.1 Mumbai - [view on Polygonscan](https://mumbai.polygonscan.com/address/0x9eF10ACe338F8A9241b2C41D58aF1F6b8A0dc40C#readProxyContract)

```json
"ETS": {
  "address": "0x9eF10ACe338F8A9241b2C41D58aF1F6b8A0dc40C",
  "implementation": "0x70cD4eDB009F430BF77F11386cDD70eE66e7489C",
  "deploymentBlock": "0x17805b5",
  "upgradeBlock": "0x17a7165"
},
"ETSAccessControls": {
  "address": "0x3b730100763b729a979Ec318ff68a1a533C143AA",
  "implementation": "0x5AaA1Ab9F2616E280407dD36beAdF19A3D02B697",
  "deploymentBlock": "0x17805a7",
  "upgradeBlock": null
      },
"ETSTag": {
  "address": "0x8A4416d512b8e49458bB19acD458d0c8323e4DE3",
  "implementation": "0xa24BE44db1fbcabf52f6f7d397aE70123805D4F9",
  "deploymentBlock": "0x17805ac",
  "upgradeBlock": null
},
"ETSEnsure": {
  "address": "0x7C7E69f0e3d02072f7970e209424111A7De45fbD",
  "implementation": "0x3dAF07a80C4BFa1A566d77847B87D84EBa629DD8",
  "deploymentBlock": "0x179f9b3",
  "upgradeBlock": null
}
```

## Quick Start

```bash
git clone https://github.com/ethereum-tag-service/ets.git
cd ets

yarn install
```

Get started with:

- [Site](#site) (ets.xyz)
- [App](#app) (app.ets.xyz)
- [Docs](#docs) (ets.xyz/docs)
- [UI](#ui)
- [Subgraph](#subgraph)
- [Contracts](#contracts)
- [Tests](#tests)
- [Deployments](#deployments)

Other packages:

- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

<a name="site"></a>

### Site

```bash
yarn site:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/site`.

<a name="app"></a>

### App

```bash
yarn app:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/app`.

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`.

<a name="docs"></a>

### Docs

```bash
yarn docs:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/docs`.

<a name="ui"></a>

### UI

The UI package (`/packages/ui`) is a stub React component library shared by the `site`, `app`, and `docs` applications.

<a name="subgraph"></a>

### Subgraph

To develop using a local subgraph, you'll need to have [Docker](https://www.docker.com/products/docker-desktop) installed. Be sure you have already run `yarn hardhat` and `yarn hardhat:deploy` so your contracts are deployed to the local Hardhat network before running the following commands.

First, open up a new terminal and spin up a local Docker graph node container. It will automatically clean up any old data:

```bash
yarn docker:start
```

In another terminal, generate your local subgraph.yaml (uses a script to parse hardhat config into a template):

```bash
yarn graph:prepare-local
```

Next, create your local subgraph (only required to run once):

```bash
yarn graph:create-local
```

Deploy your local subgraph:

```bash
yarn graph:ship-local
```

Once you make changes to your subgraph in `packages/subgraph`, you can deploy your contracts and your subgraph in one go by running:

```bash
yarn graph:deploy-and-graph
```

If you want to remove the Docker container, run:

```bash
yarn docker:remove
```

<a name="contracts"></a>

### Contracts

Contracts are located in `packages/hardhat/contracts`.

We use [Hardhat](https://hardhat.org/) as our Solidity smart contract development environment. Before using Hardhat, make a copy of `.env.example` in the project root named `.env`. The default settings in there should be enough to get you going. Next, start up Hardhat:

```bash
yarn hardhat
```

Running `yarn hardhat` spins up a Hardhat network instance that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn hardhat:deploy
```

This will deploy the contracts to the Hardhat network.

Or, if you would like to deploy and then watch the [contracts](#contracts) for changes and auto-deploy them to the local Hardhat network, you can just run:

```bash
yarn hardhat:watch
```

Deployment and watching scripts are located in `packages/hardhat/scripts` and `packages/hardhat/deploy`.

#### Ethernal

We are big fans of using [Ethernal](https://doc.tryethernal.com/) to help with smart contract development. Think of Ethernal like Etherscan, but for your locally running Hardhat blockchain. We use it to quickly interact with our locally deployed contracts.

Once you have Ethernal setup, enable it for local ETS development by setting the following in your .env file:

```text
ETHERNAL_ENABLED=true
ETHERNAL_WORKSPACE=[you local workspace name]
```

Now when you run `yarn hardhat:deploy` your contracts will be automatically verified in the Ethernal interface allowing you to directly interact with them.

Note: its a good idea when re-deploying contracts to first reset your Ethernal workspace by issuing the following command:

```txt
ethernal reset [workspace name]
```

Remember to use quotes around `workspace name` if it has spaces.
<a name="tests"></a>

### Tests

To run tests:

```bash
yarn hardhat:test
```

<a name="deployments"></a>

### Deployments

To deploy contracts to Polygon Mumbai, run:

```bash
yarn hardhat:deploy-mumbai
```

To deploy the subgraph:

```bash
yarn graph:ship-mumbai
```

## Thanks

Thanks to Austin Griffith for [Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth).
