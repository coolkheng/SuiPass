// src/lib/seal.client.ts - Seal SDK integration
//
// Provides functions to initialize Seal client, handle encryption and decryption using Seal.
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { SealClient, SessionKey, EncryptedObject } from '@mysten/seal';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'; // Sui JS utilities for keys (if needed)
import { fromHEX } from '@mysten/bcs';          // Utility to convert hex string to Uint8Array

// Load configuration from environment (with defaults for Testnet)
const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl('testnet');
const SEAL_THRESHOLD = Number(process.env.NEXT_PUBLIC_SEAL_THRESHOLD || process.env.SEAL_THRESHOLD || 2);
// Optional override for key servers (if provided in env, otherwise use allowlisted defaults)
const CUSTOM_SERVER_IDS = process.env.SEAL_KEY_SERVER_IDS ? process.env.SEAL_KEY_SERVER_IDS.split(',').map(id => id.trim()) : null;
const CUSTOM_SERVER_URLS = process.env.SEAL_KEY_SERVER_URLS ? process.env.SEAL_KEY_SERVER_URLS.split(',').map(url => url.trim()) : null;

// Create a Sui RPC client (used by Seal client and for building transactions)
export const suiClient = new SuiClient({ url: RPC_URL });

// Initialize Seal client with configured key servers and threshold
// By default, uses allowlisted official key servers for the given network (Testnet/Mainnet)
export function initSealClient(): SealClient {
  // Determine key server object IDs to use
  let serverConfigs;
  if (CUSTOM_SERVER_IDS && CUSTOM_SERVER_URLS && CUSTOM_SERVER_IDS.length === CUSTOM_SERVER_URLS.length) {
    // Use custom key server list from env
    serverConfigs = CUSTOM_SERVER_IDS.map((id, idx) => ({
      objectId: id,
      weight: 1,
      // Note: Seal SDK will retrieve URL from on-chain KeyServer object; custom URL provided for verification
      url: CUSTOM_SERVER_URLS[idx]
    }));
  } else {
    // Use default testnet key servers
    serverConfigs = [
      { objectId: '0x8c140b0f4e5d2f7c70d65bc8c1d406785e9e86faf2d5d896ab19b856b9320e03', weight: 1 },
      { objectId: '0xaca4d1c1f1bf12a621ea97e15b2f7c1614b4d6bd9c9a9ffe9d2498f4dfa90e75', weight: 1 }
    ];
  }
  // Create Seal client instance
  const sealClient = new SealClient({
    suiClient,
    keyServerObjectIds: serverConfigs.map(config => config.objectId),
    threshold: SEAL_THRESHOLD
  });
  return sealClient;
}

// Global Seal client instance (initialized on first use)
let sealClientSingleton: SealClient | null = null;
export function getSealClient(): SealClient {
  // TODO: Fix compatibility with SuiClient from @mysten/sui.js
  throw new Error('Seal client temporarily disabled due to package compatibility issues');
  /*
  if (!sealClientSingleton) {
    sealClientSingleton = initSealClient();
  }
  return sealClientSingleton;
  */
}

// Encrypt data using Seal for a given policy object (allowlist).
// packageIdHex: hex string of the published policy Move package
// policyObjectIdHex: hex string of the Policy object ID to tie encryption to (defines access control).
// data: Uint8Array or Buffer of plaintext to encrypt.
export async function sealEncrypt(packageIdHex: string, policyObjectIdHex: string, data: Uint8Array): Promise<{ encryptedBytes: Uint8Array, key: Uint8Array | null, policyIdHex: string, keyIdHex: string }> {
  // TODO: Fix for @mysten/sui.js compatibility
  throw new Error('sealEncrypt temporarily disabled due to package compatibility issues');
}

// Create or restore a SessionKey for decrypting keys from Seal key servers.
// A SessionKey provides time-limited access so the user doesn't need to sign for each decryption.
export async function initSessionKey(userAddress: string, packageIdHex: string, ttlMinutes: number = 10, signer?: Ed25519Keypair): Promise<SessionKey> {
  const packageIdBytes = fromHEX(packageIdHex);
  let sessionKey: SessionKey;
  if (signer) {
    // If a Signer (keypair) is provided, SessionKey.create will automatically sign the personal message.
    sessionKey = await SessionKey.create({
      userAddress,
      packageId: packageIdBytes,
      ttlMin: ttlMinutes,
      suiClient,
      signer
    });
  } else {
    // Without an immediate signer, create SessionKey and manually obtain signature (e.g. via wallet)
    sessionKey = await SessionKey.create({
      userAddress,
      packageId: packageIdBytes,
      ttlMin: ttlMinutes,
      suiClient
    });
    // Caller must sign sessionKey.getPersonalMessage() with user's wallet and then call sessionKey.setPersonalMessageSignature(sig).
    // TODO: The hook/useSecureContent handles prompting the user to sign if no signer here.
  }
  return sessionKey;
}

// Decrypt encrypted content using Seal.
// Requires an active SessionKey (user has approved a personal message for this package).
// encryptedBytes: Uint8Array of the encrypted content (output from sealEncrypt or fetched from storage).
// sessionKey: an initialized SessionKey (with signature set).
// policyObjectIdHex: hex string of the Policy object ID (to build the approval transaction).
export async function sealDecrypt(packageIdHex: string, policyObjectIdHex: string, encryptedBytes: Uint8Array, sessionKey: SessionKey): Promise<Uint8Array> {
  const client = getSealClient();
  // Parse EncryptedObject to extract the key ID (identity) bytes
  const encryptedObj = EncryptedObject.parse(encryptedBytes);
  const keyIdBytes = encryptedObj.keyId;
  // Build a transaction block that calls seal_approve on our policy for this key ID
  const packageId = packageIdHex;
  const policyId = policyObjectIdHex;
  
  // TODO: Fix transaction building - temporarily disabled for build compatibility
  throw new Error('Transaction building temporarily disabled - please use @mysten/dapp-kit transaction building instead');
  
  /*
  const { Transaction } = await import('@mysten/sui.js/transactions');
  const tx = new Transaction();
  // Prepare arguments: vector<u8> for id, object reference for policy
  tx.moveCall({
    target: `${packageId}::policy::seal_approve`,
    arguments: [
      tx.pure(Array.from(keyIdBytes), 'vector<u8>'),
      tx.object(policyId)
    ]
  });
  // Build transaction bytes (only the TransactionKind, as required by Seal)
  const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true });
  // Request decryption from Seal key servers
  const decrypted = await client.decrypt({
    ciphertext: encryptedBytes,
    sessionKey,
    transactionBytes: txBytes
  });
  return decrypted;
  */
}
