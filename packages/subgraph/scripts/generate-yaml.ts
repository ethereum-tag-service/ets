import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as Handlebars from "handlebars";

// Define types
type DeploymentTarget = "localhost" | "testnet_production" | "arbitrumSepolia" | "baseSepolia";

interface NetworkConfig {
  name: string;
  configPath: string;
  upgradesConfigPath: string;
  abis: Record<string, string>;
  config?: any;
  upgradesConfig?: any;
}

interface OpenzeppelinAbis {
  Ownable: string;
  Pausable: string;
  UUPSUpgradeable: string;
  Initializable: string;
}

// Constants
const VALID_TARGETS: DeploymentTarget[] = ["localhost", "testnet_production", "arbitrumSepolia", "baseSepolia"];

const OPENZEPPELIN_ABIS: OpenzeppelinAbis = {
  Ownable: "./../contracts/abi/@openzeppelin/contracts/access/Ownable.sol/Ownable.json",
  Pausable: "./../contracts/abi/@openzeppelin/contracts/security/Pausable.sol/Pausable.json",
  UUPSUpgradeable:
    "./../contracts/abi/@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol/UUPSUpgradeable.json",
  Initializable:
    "./../contracts/abi/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol/Initializable.json",
};

// Helper functions
const getNetworkConfig = (target: DeploymentTarget): NetworkConfig => {
  const baseConfig: Omit<NetworkConfig, "name"> = {
    configPath: `./../contracts/export/chainConfig/${target}.json`,
    upgradesConfigPath: `./../contracts/export/upgradeConfig/${target}.json`,
    abis: [
      "ETS",
      "ETSAccessControls",
      "ETSAuctionHouse",
      "ETSEnrichTarget",
      "ETSRelayerFactory",
      "ETSRelayerV1",
      "ETSTarget",
      "ETSToken",
    ].reduce(
      (acc, contract) => {
        acc[contract] = `./../contracts/deployments/${target}/${contract}.json`;
        return acc;
      },
      {} as Record<string, string>,
    ),
  };

  const targetConfigs: Record<DeploymentTarget, { name: string }> = {
    localhost: { name: "mainnet" },
    testnet_production: { name: "arbitrum-sepolia" },
    arbitrumSepolia: { name: "arbitrum-sepolia" },
    baseSepolia: { name: "base-sepolia" },
  };

  return { ...baseConfig, ...targetConfigs[target] };
};

const validateTarget: (target: string | undefined) => asserts target is DeploymentTarget = (target) => {
  if (!target) {
    throw new Error(
      `Error: You must provide a target in the form --target [target]. Possible targets are: ${VALID_TARGETS.join(", ")}`,
    );
  }
  if (!VALID_TARGETS.includes(target as DeploymentTarget)) {
    throw new Error(`Error: Invalid target "${target}". Possible targets are: ${VALID_TARGETS.join(", ")}`);
  }
};

// Main function
export async function main(providedTarget?: string): Promise<void> {
  let target: DeploymentTarget;

  if (providedTarget) {
    validateTarget(providedTarget);
    target = providedTarget;
  } else {
    const args: string[] = process.argv.slice(2);
    const targetIndex: number = args.indexOf("--target");
    const cmdTarget = args[targetIndex + 1];
    validateTarget(cmdTarget);
    target = cmdTarget;
  }

  const networkConfig: NetworkConfig = getNetworkConfig(target);

  try {
    const configContent = await fs.readFile(networkConfig.configPath, "utf8");
    networkConfig.config = JSON.parse(configContent);
    const upgradesConfigContent = await fs.readFile(networkConfig.upgradesConfigPath, "utf8");
    networkConfig.upgradesConfig = JSON.parse(upgradesConfigContent);
  } catch (err) {
    console.error(`Error loading files for network ${target}:`, (err as Error).message);
    process.exit(1);
  }

  const templatePath = path.join(__dirname, "../templates/subgraph.yaml.mustache");
  const templateContent = await fs.readFile(templatePath, "utf8");
  const template = Handlebars.compile(templateContent);

  const result = template({ ...networkConfig, openzeppelin: OPENZEPPELIN_ABIS });

  const outputPath = path.join(__dirname, "../subgraph.yaml");
  await fs.writeFile(outputPath, result);
  console.info(`${target} configuration file written to ${outputPath}`);
}

// Run the main function if this file is being executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error("An unexpected error occurred:", error);
    process.exit(1);
  });
}
