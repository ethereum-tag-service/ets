const { network, ethernal, run } = require("hardhat");
const networkName = network.name;
const chainId = network.config.chainId;

/**
 * Verify a contract on a block scanner.
 * @param {string} name Contract name.
 * @param {object} deployment Deployment artifact
 * @param {string} implementation Address of implementation contract when deploying proxy.
 * @param {array} args Constructor arguments for the verify function.
 *
 * For standard deployments, verify takes the deployed contract address. For upgradable contracts,
 * verify takes the implementation address (not the proxy). This is handled for standard deployments
 * by passing the deployed contract address in as the implementation argument.
 */
async function verify(name, deployment, implementation, args) {
  // If we are on hardhat local chain and ethernal is enabled.
  if (chainId === 31337) {
    if (ethernal && process.env.ETHERNAL_DISABLED === "false") {
      console.info(`Verifying ${name} on Ethernal`);
      try {
        await ethernal.push({
          name: name,
          // Ethernal always takes the deployment address.
          address: deployment.address,
        });
      } catch (err) {
        console.info("Verification failed", { name, chainId: chainId, address: deployment.address, args, err });
      }
    } else {
      console.info("Ethernal verification disabled. See repo README.md for enabling Ethernal.");
    }
  } else {
    try {
      console.info(`Verifying ${name}`);
      await run("verify:verify", {
        network: networkName,
        address: implementation,
        constructorArguments: args,
      });
    } catch (err) {
      console.info("Verification failed", {
        name,
        address: deployment.address,
        chainId: chainId,
        implementation,
        args,
        err,
      });
    }
  }
}

module.exports = { verify };
