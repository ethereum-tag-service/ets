#!/bin/bash

# Paths
SRC_DIR="./src"
CHAIN_CONFIG_DIR="$SRC_DIR/chainConfig"
OUTPUT_FILE="$SRC_DIR/chainConfig.ts"

# Start of the TypeScript file content
echo "export const chainConfig: Record<string, string> = {" > "$OUTPUT_FILE"

# Iterate over each .json file in the chainConfig directory
for file in "$CHAIN_CONFIG_DIR"/*.json; do
  # Extract the chain name from the filename
  chainName=$(basename "$file" .json)

  # Read the JSON content to extract chainId
  chainId=$(jq -r '.chainId' "$file")

  # Append the chainId and relative path to the TypeScript file content
  echo "  \"$chainId\": \"./chainConfig/$chainName.json\"," >> "$OUTPUT_FILE"
done

# End of the TypeScript file content
echo "};" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "chainConfig.ts has been generated successfully."
