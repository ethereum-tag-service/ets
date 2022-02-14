task("read-ensure", "Calls an API Consumer Contract to read data obtained from an external API")
    .addParam("contract", "The address of the API Consumer contract that you want to call")
    .setAction(async taskArgs => {

        const contractAddr = taskArgs.contract
        const networkId = network.name
        console.log("Reading data from ETSEnsure contract ", contractAddr, " on network ", networkId)
        const ETSEnsure = await ethers.getContractFactory("ETSEnsure")

        //Get signer information
        const accounts = await ethers.getSigners()
        const signer = accounts[0]

        //Create connection to API Consumer Contract and call the createRequestTo function
        const etsEnsure = new ethers.Contract(contractAddr, ETSEnsure.interface, signer)
        let result = await etsEnsure.ipfsHash()
        console.log('Data is: ', result)
        if (result == 0 && ['hardhat', 'localhost', 'ganache'].indexOf(network.name) == 0) {
            console.log("You'll either need to wait another minute, or fix something!")
        }
        if (['hardhat', 'localhost', 'ganache'].indexOf(network.name) >= 0) {
            console.log("You'll have to manually update the value since you're on a local chain!")
        }
    })

module.exports = {}
