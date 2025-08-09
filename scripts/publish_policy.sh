#!/bin/bash
# scripts/publish_policy.sh
# Usage: . scripts/publish_policy.sh 
# Publishes the Move package for the Seal policy to the Sui network (Testnet by default).
# Ensure `sui` CLI is installed and configured with an active address that has SUI for gas.
# Also ensure the Move.toml and sources are built (sui move build).
set -e
PACKAGE_PATH="move/seal_policy"
# Build Move bytecode
sui move build --skip-fetch-latest-git-deps --path $PACKAGE_PATH
# Publish package (adjust gas budget as needed)
sui client publish --path $PACKAGE_PATH --gas-budget 50000
echo "Package published. Note the Package ID above and update POLICY_PACKAGE_ID in .env."
