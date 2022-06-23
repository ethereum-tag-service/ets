# Ethereum Tag Service

Ethereum Tag Service is the community-owned incentivized cross-chain content tagging protocol for the decentralized web.

This repository uses Turborepo and [PNpm](https://pnpm.io/) as a package manager for the monorepo.

We are using `npm run` for commands. By default, `pnpm` doesn't run arbitrary `pre` and `post` hooks for user-defined scripts (such as prestart). More info on that [here](https://pnpm.io/cli/run#differences-with-npm-run).

- Website: [ets.xyz](https://ets.xyz)
- App: [app.ets.xyz](https://app.ets.xyz)
- Docs: [ets.xyz/docs](https://ets.xyz/docs)
- Twitter: [@etsxyz](https://twitter.com/etsxyz)
- Discord: ETS (soon)

## Quick Start

```bash
git clone https://github.com/ethereum-tag-service/ets.git
cd ets

pnpm install
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
npm site:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/site`.

<a name="app"></a>

### App

```bash
npm app:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/app`.

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`.

#### Translations

The `apps/app` app uses [next-translate](https://github.com/vinissimus/next-translate) for i18n.

Translation files are located in the `apps/app/locales` directory.

To create a new translation, you'll need to:

- Copy the `en` translation directory inside `apps/app/locales` to the desired language and update the strings to reflect the language.
- Update `apps/app/i18n.js` to include the new locale (update both the locales and formatters) and `react-timeago` language files or create a new one and import it if the language file does not exist

In order to access different translations of the app, you'll change the URL. For example, if we had Spanish setup (we have an example Spanish translation currently setup), we'd be able to access the Spanish app via [app.ets.xyz/es](https://app.ets.xyz/es). You can read more about internationalized routing in Next.js here: [nextjs.org/docs/advanced-features/i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing)

The Next.js [Link](https://nextjs.org/docs/api-reference/next/link) component automatically prepends the active locale to links.

<a name="docs"></a>

### Docs

```bash
npm docs:dev
```

This will start up the Next.js development server and your site will be available at: [http://localhost:3000/](http://localhost:3000/)

The App is built with Next.js and can be found in `apps/docs`.

<a name="ui"></a>

### UI

The UI package (`/packages/ui`) is a stub React component library shared by the `site`, `app`, and `docs` applications.

<a name="subgraph"></a>

### Subgraph

To develop using a local subgraph, you'll need to have [Docker](https://www.docker.com/products/docker-desktop) installed. Be sure you have already run `npm hardhat` and `npm hardhat:deploy` so your contracts are deployed to the local Hardhat network before running the following commands.

First, open up a new terminal and spin up a local Docker graph node container. It will automatically clean up any old data:

```bash
npm docker:start
```

In another terminal, generate your local subgraph.yaml (uses a script to parse hardhat config into a template):

```bash
npm graph:prepare-local
```

Next, create your local subgraph (only required to run once):

```bash
npm graph:create-local
```

Deploy your local subgraph:

```bash
npm graph:ship-local
```

Once you make changes to your subgraph in `packages/subgraph`, you can deploy your contracts and your subgraph in one go by running:

```bash
npm graph:deploy-and-graph
```

If you want to remove the Docker container, run:

```bash
npm docker:remove
```

<a name="contracts"></a>

### Contracts

Contracts are located in `packages/contracts`.

We use [Hardhat](https://hardhat.org/) as our Solidity smart contract development environment. Before using Hardhat, make a copy of `.env.example` in the project root named `.env`. The default settings in there should be enough to get you going. Next, start up Hardhat:

```bash
npm hardhat
```

Running `npm hardhat` spins up a Hardhat network instance that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
npm hardhat:deploy
```

This will deploy the contracts to the Hardhat network.

Or, if you would like to deploy and then watch the [contracts](#contracts) for changes and auto-deploy them to the local Hardhat network, you can just run:

```bash
npm hardhat:watch
```

Deployment and watching scripts are located in `packages/contracts/scripts` and `packages/contracts/deploy`.

#### Ethernal

We are big fans of using [Ethernal](https://doc.tryethernal.com/) to help with smart contract development. Think of Ethernal like Etherscan, but for your locally running Hardhat blockchain. We use it to quickly interact with our locally deployed contracts.

Once you have Ethernal setup, enable it for local ETS development by setting the following in your .env file:

```text
ETHERNAL_ENABLED=true
ETHERNAL_WORKSPACE=[you local workspace name]
```

Now when you run `npm hardhat:deploy` your contracts will be automatically verified in the Ethernal interface allowing you to directly interact with them.

Note: its a good idea when re-deploying contracts to first reset your Ethernal workspace by issuing the following command:

```txt
ethernal reset [workspace name]
```

Remember to use quotes around `workspace name` if it has spaces.
<a name="tests"></a>

### Tests

To run tests:

```bash
npm hardhat:test
```

<a name="deployments"></a>

### Deployments

To deploy contracts to Polygon Mumbai, run:

```bash
npm hardhat:deploy-mumbai
```

To deploy the subgraph:

```bash
npm graph:ship-mumbai
```

## Thanks

Thanks to Austin Griffith for [Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth).
