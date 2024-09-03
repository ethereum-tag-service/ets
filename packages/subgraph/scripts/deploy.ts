import { execSync } from "node:child_process";
import axios from "axios";
import * as minimist from "minimist";

import { main as generateYaml } from "./generate-yaml"; // Use import to import the main function

type DeploymentTarget = "localhost" | "testnet_production" | "arbitrumSepolia" | "baseSepolia";

interface DeploymentConfig {
  target: DeploymentTarget;
  studioName: string;
  isLocal: boolean;
}

const deploymentConfigs: Record<DeploymentTarget, DeploymentConfig> = {
  localhost: { target: "localhost", studioName: "ets-local", isLocal: true },
  testnet_production: { target: "testnet_production", studioName: "ets-testnet-production", isLocal: false },
  arbitrumSepolia: { target: "arbitrumSepolia", studioName: "ets-arbitrum-sepolia", isLocal: false },
  baseSepolia: { target: "baseSepolia", studioName: "ets-base-sepolia", isLocal: false },
};

function runCommand(command: string): void {
  console.info(`Executing: ${command}`);
  execSync(command, { stdio: "inherit" });
}

async function checkGraphIsRunning(deployment: DeploymentTarget): Promise<boolean> {
  if (deployment !== "localhost") {
    return true;
  }

  console.info("Checking if local Graph Node is running...");
  try {
    await axios.post("http://localhost:8020", {});
    console.info("Local Graph Node is running.");
    return true;
  } catch (_error) {
    console.error("Local Graph Node is not running or not ready.");
    console.error(
      'Please ensure Docker is running and then start the Graph Node using the command: "pnpm run-graph-node".',
    );
    console.error("After the Graph Node has started, you can rerun this deployment script.");
    return false;
  }
}

async function deployToEnvironment(config: DeploymentConfig): Promise<void> {
  console.info(`Starting deployment for ${config.target}...`);

  if (config.isLocal) {
    console.info("Checking local Graph Node...");
    if (!(await checkGraphIsRunning("localhost"))) {
      throw new Error("Local Graph Node is not running");
    }
  }

  console.info("Generating subgraph YAML...");
  await generateYaml(config.target); // Call the function loaded via require

  console.info("Generating code from schema...");
  runCommand("graph codegen --output-dir src/generated");

  if (config.isLocal) {
    console.info("Building subgraph...");
    runCommand("graph build");

    console.info("Removing existing subgraph (if any)...");
    runCommand(`graph remove --node http://localhost:8020/ ${config.studioName}`);

    console.info("Creating subgraph...");
    runCommand(`graph create --node http://localhost:8020/ ${config.studioName}`);

    console.info("Deploying subgraph to local node...");
    runCommand(
      `graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 ${config.studioName} --version-label dev`,
    );
  } else {
    console.info("Deploying subgraph to studio...");
    runCommand(`graph deploy --studio ${config.studioName}`);
  }

  console.info(`Deployment to ${config.target} completed successfully.`);
}

function validateTarget(target: string | undefined): asserts target is DeploymentTarget {
  if (!target) {
    throw new Error(
      `Missing deployment target. Usage: --target <target> or -t <target>. Valid targets are: ${Object.keys(deploymentConfigs).join(", ")}`,
    );
  }
  if (!Object.keys(deploymentConfigs).includes(target)) {
    throw new Error(
      `Invalid deployment target: '${target}'. Valid targets are: ${Object.keys(deploymentConfigs).join(", ")}`,
    );
  }
}

async function main(): Promise<void> {
  try {
    const argv = minimist(process.argv.slice(2));
    const target = argv.target || argv.t;

    validateTarget(target);

    await deployToEnvironment(deploymentConfigs[target]);

    console.info(`Deployment to ${target} completed successfully.`);
  } catch (error) {
    console.error("Deployment failed:");
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error("Stack trace:");
        console.error(error.stack);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    process.exit(1);
  }
}

main();
