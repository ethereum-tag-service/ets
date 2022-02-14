const { ethers } = require("hardhat");

module.exports = async ({
  getNamedAccounts,
  deployments
}) => {
    const {ETSAdmin, ETSPublisher} = await getNamedAccounts();

    const ETSAccessControls = await deployments.get("ETSAccessControls");
    const ETS = await deployments.get("ETS");
    const ETSEnsure = await deployments.get("ETSEnsure");

    const etsAccessControls = await ethers.getContractAt("ETSAccessControls", ETSAccessControls.address);
    const ets = await ethers.getContractAt("ETS", ETS.address);

    const smartContractRole = await etsAccessControls.SMART_CONTRACT_ROLE();
    await etsAccessControls.grantRole( smartContractRole, ETSAdmin, { from: ETSAdmin } );
    console.log(`Smart contract role granted to ${ETSAdmin}`);

    await etsAccessControls.grantRole(ethers.utils.id("PUBLISHER"), ETSPublisher);
    console.log(`Publisher role granted to ${ETSPublisher}`);
    
    await ets.updateETSEnsure(ETSEnsure.address);
    console.log(`ets.ETSEnsure contract set to ${ETSEnsure.address}`);

};

module.exports.tags = ['ets_deploy'];
module.exports.dependencies = ['ets_ensure']
