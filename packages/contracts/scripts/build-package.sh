#!/bin/bash

# Assuming this script runs from /packages/contracts
echo "Running wagmi generate..."

# See /wagmi.config.js for more details
# Create /src/contracts.ts which contains exported constants
# referencing per-chain contract addresses & ABIs
wagmi generate

# Clean the dist directory
echo "Cleaning the dist directory..."
pnpm run clean

# Compile TypeScript files
echo "Compiling TypeScript files..."
tsup src  --config tsup.config.ts --format cjs,esm --dts --outDir dist --target es2020

cp -R contracts/interfaces dist/interfaces
cp -R contracts/relayers/interfaces dist/interfaces/relayers

echo "Package build completed successfully!"
