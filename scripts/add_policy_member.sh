#!/bin/bash
# scripts/add_policy_member.sh
# Usage: . scripts/add_policy_member.sh <PolicyObjectID> <MemberAddress>
# Adds a member address to the allowlist of a Policy.
POLICY_OBJECT_ID=$1
MEMBER_ADDRESS=$2
if [ -z "$POLICY_OBJECT_ID" ] || [ -z "$MEMBER_ADDRESS" ]; then
  echo "Usage: add_policy_member.sh <PolicyObjectID> <MemberAddress>"
  exit 1
fi
sui client call --package $POLICY_PACKAGE_ID \
  --module policy --function add_member \
  --args $POLICY_OBJECT_ID $MEMBER_ADDRESS \
  --gas-budget 10000
echo "Added member $MEMBER_ADDRESS to policy $POLICY_OBJECT_ID"
