// src/lib/secure-store.service.ts - High-level service combining Seal encryption and Walrus storage
//
// This service orchestrates the encryption and storage workflow and the retrieval and decryption workflow.
import { getWalrusClient, walrusWriteBlob, walrusReadBlob } from './walrus.client';
import { getSealClient, sealEncrypt, sealDecrypt, initSessionKey } from './seal.client';
import { Ed25519Keypair, fromB64 } from '@mysten/sui/keypairs/ed25519'; // for server-side signing

// Determine if running in Node/server context (for server-side keypair usage)
const isServer = typeof window === 'undefined';

// Load server keypair if provided (for backend operations like writing to Walrus)
let serverKeypair: Ed25519Keypair | null = null;
if (isServer && process.env.KEYPAIR) {
  try {
    const secretKeyBytes = fromB64(process.env.KEYPAIR);
    serverKeypair = Ed25519Keypair.fromSecretKey(secretKeyBytes);
  } catch (e) {
    console.error('Failed to load server KEYPAIR from env - ensure it is base64-encoded:', e);
  }
}

// Encrypt and store content securely.
// - packageId: Move package ID of the Seal policy module (hex string).
// - policyObjectId: object ID of the Policy (allowlist) to control access.
// - plaintext: Buffer or Uint8Array of data to encrypt.
export async function secureStoreContent(packageId: string, policyObjectId: string, plaintext: Uint8Array): Promise<{ secretId: string, blobId: string }> {
  // 1. Encrypt the plaintext using Seal (client-side encryption)
  const { encryptedBytes } = await sealEncrypt(packageId, policyObjectId, plaintext);
  // 2. Store the encrypted blob on Walrus
  // If a server keypair is available (running on backend), use it to sign the storage tx.
  // Otherwise, this function should be called on the server where serverKeypair exists, or ensure the signer is provided.
  if (!serverKeypair) {
    throw new Error('No signer available for Walrus storage. Ensure KEYPAIR is configured on server.');
  }
  const writeResult = await walrusWriteBlob(encryptedBytes, serverKeypair);
  // Optionally, we could call the policy.publish_blob on-chain to attach the blobId to the policy (for on-chain indexing).
  // That would require a transaction by the policy owner; skipping here for simplicity.
  const secretId = writeResult.objectId;  // use Walrus object ID as secret identifier
  const blobId = writeResult.blobId;
  // In a real app, you'd also store metadata (e.g., secret name) and secretId/blobId mapping in a database.
  return { secretId, blobId };
}

// Retrieve and decrypt secure content.
// - packageId: Move package ID of the Seal policy module (hex string).
// - policyObjectId: object ID of the Policy that controls access.
// - blobId: Walrus blobId identifying the encrypted content in storage.
// - sessionKey: an active SessionKey for the user (with appropriate package access).
export async function secureRetrieveContent(packageId: string, policyObjectId: string, blobId: string, sessionKey: import('@mysten/seal').SessionKey): Promise<Uint8Array> {
  // 1. Read the encrypted blob from Walrus storage
  const encryptedBytes = await walrusReadBlob(blobId);
  // 2. Decrypt the blob using Seal (client-side decryption)
  const decryptedBytes = await sealDecrypt(packageId, policyObjectId, encryptedBytes, sessionKey);
  return decryptedBytes;
}

// Utility: Initialize a SessionKey for a user address, using either the user's wallet (if front-end) or server key (if test context).
export async function getSessionKeyForUser(userAddress: string, packageId: string): Promise<import('@mysten/seal').SessionKey> {
  // If we have serverKeypair (e.g., testing scenario where we control user key), we can initSessionKey with it.
  if (serverKeypair) {
    return await initSessionKey(userAddress, packageId, 10, serverKeypair);
  }
  // Otherwise, on the front-end, we expect the user to sign via wallet; initSessionKey will create a SessionKey without signature.
  const sessionKey = await initSessionKey(userAddress, packageId, 10);
  // IMPORTANT: On front-end, you must prompt the user to sign the SessionKey's personal message:
  // const message = sessionKey.getPersonalMessage();
  // const signature = await wallet.signPersonalMessage({ message });
  // sessionKey.setPersonalMessageSignature(signature);
  // (The above is handled in useSecureContent hook with the user's wallet.)
  return sessionKey;
}
