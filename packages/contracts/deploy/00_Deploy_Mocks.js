module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const {verify} = require("./utils/verify.js");
    const {saveNetworkConfig} = require("./utils/config.js");
    const { ETSAdmin } = await getNamedAccounts()
    const chainId = await getChainId()
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        const linkToken = await deploy('LinkToken', { from: ETSAdmin, log: true })
        const mockOracle = await deploy('MockOracle', {
            from: ETSAdmin,
            log: true,
            args: [linkToken.address]
        })

        await verify("LinkToken", linkToken);
        await verify("MockOracle", mockOracle);
        await saveNetworkConfig("LinkToken", linkToken, null, false);
        await saveNetworkConfig("MockOracle", mockOracle, null, false);

        log("Mocks Deployed!")
        log("====================================================")
        log("You are deploying to a local network, you'll need a local network running to interact")
        log("Please run `npx hardhat console` to interact with the deployed smart contracts!")
        log("====================================================")
    }
}
module.exports.tags = ['mocks'];
