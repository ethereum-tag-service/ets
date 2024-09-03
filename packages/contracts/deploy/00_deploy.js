module.exports = async () => {
  console.info("Starting deployment process...");
  // The actual deployments are handled by individual scripts
};

module.exports.tags = ["deployAll"];
// PostDeployment is the last dependency in the deployment process.
// see deploy/99_postDeployment.js
module.exports.dependencies = ["PostDeployment"];
