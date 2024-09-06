#!/bin/bash

# Paths
SRC_DIR="./src"
UPGRADE_CONFIG_DIR="$SRC_DIR/upgradeConfig"
OUTPUT_FILE="$SRC_DIR/upgradeConfig.ts"

# Start of the TypeScript file content
echo "export const upgradeConfig: Record<string, string> = {" > "$OUTPUT_FILE"

# Iterate over each .json file in the upgradeConfig directory
for file in "$UPGRADE_CONFIG_DIR"/*.json; do
  # Extract the chain name from the filename
  chainName=$(basename "$file" .json)

  # Append the chain name and relative path to the TypeScript file content
  echo "  \"$chainName\": \"./upgradeConfig/$chainName.json\"," >> "$OUTPUT_FILE"
done

# End of the TypeScript file content
echo "};" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "upgradeConfig.ts has been generated successfully."
