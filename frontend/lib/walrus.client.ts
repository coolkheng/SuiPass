// src/lib/walrus.client.ts - Walrus decentralized storage integration
//
// Provides functions to initialize Walrus client, and to write/read data blobs using Walrus.
import { SuiClient, getFullnodeUrl } from '@mysten/sui';
import { WalrusClient } from '@mysten/walrus';
// import { TESTNET_WALRUS_PACKAGE_CONFIG } from '@mysten/walrus';  // contains default package IDs for testnet

// Load environment configuration
const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl('testnet');
const WALRUS_WASM_URL = process.env.NEXT_PUBLIC_WALRUS_WASM_URL || process.env.WALRUS_WASM_URL;
const UPLOAD_RELAY_HOST = process.env.NEXT_PUBLIC_UPLOAD_RELAY_HOST || process.env.UPLOAD_RELAY_HOST;
const USE_UPLOAD_RELAY = !!UPLOAD_RELAY_HOST;  // whether to use an upload relay for writes

// Optional Walrus contract package overrides (for custom deployments or mainnet)
const CUSTOM_SYSTEM_OBJ = process.env.WALRUS_SYSTEM_OBJECT_ID;
const CUSTOM_STAKING_POOL = process.env.WALRUS_STAKING_POOL_ID;

// Create a Sui RPC client (shared with Walrus)
export const suiClient = new SuiClient({ url: RPC_URL });

// Initialize Walrus client with appropriate network and optional upload relay
export function initWalrusClient(): WalrusClient {
  const config: any = {
    network: RPC_URL.includes('testnet') ? 'testnet' : 'mainnet',
    suiClient
  };
  // Apply custom Walrus package addresses if provided (e.g. for local or updated contracts)
  if (CUSTOM_SYSTEM_OBJ && CUSTOM_STAKING_POOL) {
    config.packageConfig = {
      systemObjectId: CUSTOM_SYSTEM_OBJ,
      stakingPoolId: CUSTOM_STAKING_POOL
    };
  }
  // If running in a browser or Vite environment, provide WASM URL for encoding/decoding
  if (WALRUS_WASM_URL) {
    config.wasmUrl = WALRUS_WASM_URL;
  }
  // If configured, attach upload relay to reduce client load on blob writes
  if (USE_UPLOAD_RELAY && UPLOAD_RELAY_HOST) {
    config.uploadRelayHost = UPLOAD_RELAY_HOST;
  }
  const walrusClient = new WalrusClient(config);
  return walrusClient;
}

// Singleton Walrus client
let walrusClientSingleton: WalrusClient | null = null;
export function getWalrusClient(): WalrusClient {
  if (!walrusClientSingleton) {
    walrusClientSingleton = initWalrusClient();
  }
  return walrusClientSingleton;
}

// Write an encrypted blob to Walrus storage and return its identifiers.
// `fileData`: Uint8Array of the data to store (already encrypted if sensitive).
// Returns an object containing Walrus blobId (for retrieval) and the on-chain object ID.
export async function walrusWriteBlob(fileData: Uint8Array, signer: any, epochs: number = 3, deletable: boolean = false): Promise<{ blobId: string, objectId: string }> {
  const client = getWalrusClient();
  // Store the blob to Walrus
  const result = await client.store({
    data: fileData,
    signer,
    epochs,
    deletable
  });
  
  return {
    blobId: result.blobId,      // Walrus blob identifier (for reading content)
    objectId: result.objectId   // Sui object ID of the Walrus Blob on-chain
  };
}

// Read a blob's content from Walrus by its blobId.
// Returns the raw data as Uint8Array.
export async function walrusReadBlob(blobId: string): Promise<Uint8Array> {
  const client = getWalrusClient();
  const data = await client.read({ blobId });
  return data;
}

// Helper to generate a self-hosted WASM URL (if using Next.js static files).
// If you place walrus_wasm_bg.wasm in the public/ directory, you can set WALRUS_WASM_URL to '/walrus_wasm_bg.wasm'
// and use this function to resolve the absolute URL in the browser environment.
export function getWalrusWasmURL(): string | undefined {
  if (!WALRUS_WASM_URL) return undefined;
  if (typeof window !== 'undefined' && WALRUS_WASM_URL.startsWith('/')) {
    // In browser, convert relative public path to absolute URL
    return window.location.origin + WALRUS_WASM_URL;
  }
  return WALRUS_WASM_URL;
}
