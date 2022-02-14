let { networkConfig, getNetworkIdFromName } = require('../../helper-hardhat-config')

task("request-ensure", "Calls an API Consumer Contract to request external data")
    .addParam("contract", "The address of the API Consumer contract that you want to call")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        let networkId = await getNetworkIdFromName(network.name)
        console.log("Calling ETSEnsure contract ", contractAddr, " on network ", network.name)
        const ETSEnsure = await ethers.getContractFactory("ETSEnsure")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const etsEnsureContract = new ethers.Contract(contractAddr, ETSEnsure.interface, signer)
        var result = await etsEnsureContract.requestBytes()
        console.log('Contract ', contractAddr, ' external data request successfully called. Transaction Hash: ', result.hash)
        console.log("Run the following to read the returned result:")
        console.log("npx hardhat read-ensure --contract " + contractAddr + " --network " + network.name)
    })
module.exports = {}
