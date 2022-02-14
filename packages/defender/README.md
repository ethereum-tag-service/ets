# Defender Autotask example using Rollup

This folder shows how to code an Autotask with package dependencies not available in the Autotasks runtime, by generating a bundle using [Rollup](https://rollupjs.org/) that includes all dependencies, along with imported ABIs so they don't have to be copied into the script. This example uses typescript, but is also applicable to javascript.

## Setup

Develop your scripts within the src/ folder. When ready to compile for adding to Defender run the following from the root of the Defender package.

```
yarn rollup -c -i src/[filenae].[js|ts] -o dist/[filename].js
```

note: The Rollup package compiles typescript as plain .js.

## Running Locally

You can run the scripts locally, instead of in an Autotask, via a Defender Relayer. Create a Defender Relayer on mainnet, write down the API key and secret, and create a `.env` file in this folder with the following content:

```
API_KEY=yourapikey
API_SECRET=yourapisecret
```
