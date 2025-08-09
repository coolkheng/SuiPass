#!/bin/bash
# scripts/create_policy.sh
# Usage: . scripts/create_policy.sh "<Policy Name>"
# Creates a new Policy object on-chain by calling the create_policy entry function.
# Requires that POLICY_PACKAGE_ID is set in .env or passed as env var.
POLICY_NAME=${1:-"New Policy"}
if [ -z "$POLICY_PACKAGE_ID" ]; then
  echo "Please set POLICY_PACKAGE_ID to the published package ID."
  exit 1
fi
sui client call --package $POLICY_PACKAGE_ID \
  --module policy --function create_policy \
  --args \""$(echo -n "$POLICY_NAME" | xxd -p -u | tr -d '\n')"\" \
  --gas-budget 10000
echo "Policy created: check transaction output for the new Policy object ID and update project allowlist_id in DB."
