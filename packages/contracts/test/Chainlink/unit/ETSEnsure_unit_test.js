const { networkConfig, autoFundCheck, developmentChains } = require('../../../helper-hardhat-config')
const skipIf = require('mocha-skip-if')
const chai = require('chai')
const { expect } = require('chai')
const BN = require('bn.js')
const { getChainId } = require('hardhat')
// const {numToBytes32} = require("@chainlink/test-helpers/dist/src/helpers");
chai.use(require('chai-bn')(BN))

skip.if(!developmentChains.includes(network.name)).
  describe('ETSEnsure Unit Tests', async function () {

    let etsEnsure, linkToken, mockOracle

    beforeEach(async () => {
      const chainId = await getChainId()
      await deployments.fixture(['mocks', 'ets_ensure'])
      const LinkToken = await deployments.get('LinkToken')
      linkToken = await ethers.getContractAt('LinkToken', LinkToken.address)
      const networkName = networkConfig[chainId]['name']

      linkTokenAddress = linkToken.address
      additionalMessage = " --linkaddress " + linkTokenAddress

      const ETSEnsure = await deployments.get('ETSEnsure')
      etsEnsure = await ethers.getContractAt('ETSEnsure', ETSEnsure.address)

      if (await autoFundCheck(etsEnsure.address, networkName, linkTokenAddress, additionalMessage)) {
        await hre.run("fund-link", { contract: etsEnsure.address, linkaddress: linkTokenAddress })
      }

      const MockOracle = await deployments.get("MockOracle");
      mockOracle = await ethers.getContractAt("MockOracle", MockOracle.address);
    })

    afterEach(async () => {
      mockOracle.removeAllListeners()
    })

    it('Should successfully make an ETSEnsure request', async () => {
      const transaction = await etsEnsure.requestBytes()
      const tx_receipt = await transaction.wait()
      const requestId = tx_receipt.events[0].topics[1]

      console.log("requestId: ", requestId)
      expect(requestId).to.not.be.null
    })

    it("Should successfully make an ETSEnsure request and get a result", (done) => {
      mockOracle.once("OracleRequest",
        async (_specId, _sender, requestId, _payment, _cbAddress, _callbackFuncId, expiration, _dataVersion, _data) => {
          console.log("OracleRequest:", requestId, _data);
          // Mock the fulfillment of the request
          const callbackValue = "0xa36085F69e2889c224210F603D836748e7dC0088";
          await mockOracle.fulfillOracleRequest(requestId, callbackValue);
          // Now check the result
          const ipfsHash = await etsEnsure.ipfsHash()
          expect(ipfsHash).to.equal(callbackValue)
          done();
      });
      etsEnsure.requestBytes();
    })
})
