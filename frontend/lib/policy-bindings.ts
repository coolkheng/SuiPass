// src/lib/policy-bindings.ts - Utilities for interacting with the Seal policy Move module
//
// Provides known package and module IDs, and helper functions to build or execute transactions involving policies.
import { Transaction } from '@mysten/sui/transactions';

export const POLICY_PACKAGE_ID = process.env.NEXT_PUBLIC_POLICY_PACKAGE_ID || process.env.POLICY_PACKAGE_ID || ''; 
// ^ Package ID where seal_policy::policy module is published (to be set after publishing the Move package)
export const POLICY_MODULE = 'policy';

// Build a transaction block to create a new Policy object on-chain.
export function txCreatePolicy(name: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${POLICY_PACKAGE_ID}::${POLICY_MODULE}::create_policy`,
    arguments: [tx.pure(new TextEncoder().encode(name), 'vector<u8>')]
  });
  return tx;
}

// Build a transaction to add a member to an existing Policy.
export function txAddPolicyMember(policyId: string, memberAddress: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${POLICY_PACKAGE_ID}::${POLICY_MODULE}::add_member`,
    arguments: [
      tx.object(policyId),
      tx.pure(memberAddress, 'address')
    ]
  });
  return tx;
}

// Build a transaction to publish a blob reference (attach Walrus blob ID to the policy).
export function txPublishBlob(policyId: string, blobId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${POLICY_PACKAGE_ID}::${POLICY_MODULE}::publish_blob`,
    arguments: [
      tx.object(policyId),
      tx.pure(new TextEncoder().encode(blobId), 'vector<u8>')
    ]
  });
  return tx;
}

// Build a transaction block for Seal approval (used internally by secure retrieval).
export function txSealApprove(idBytes: Uint8Array, policyId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${POLICY_PACKAGE_ID}::${POLICY_MODULE}::seal_approve`,
    arguments: [
      tx.pure(Array.from(idBytes), 'vector<u8>'),
      tx.object(policyId)
    ]
  });
  return tx;
}

// Note: The above functions create Transaction objects for usage with @mysten/sui's signer interfaces.
// For example, to execute, one might do: `await signer.signAndExecuteTransaction({ transaction: tx })`.
