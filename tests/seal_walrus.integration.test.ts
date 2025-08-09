// tests/seal_walrus.integration.test.ts - Integration tests for Seal and Walrus flows
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getSealClient, initSessionKey, sealEncrypt, sealDecrypt } from '../frontend/lib/seal.client';
import { getWalrusClient, walrusWriteBlob, walrusReadBlob } from '../frontend/lib/walrus.client';
// Note: These imports may need adjustment based on actual package structure
// import { Ed25519Keypair, fromB64 } from '@mysten/sui/keypairs/ed25519';

const TEST_PACKAGE_ID = process.env.POLICY_PACKAGE_ID || '';         // The Move package ID of the policy module
const TEST_POLICY_ID = process.env.TEST_POLICY_ID || process.env.POLICY_OBJECT_ID || ''; // A Policy object ID for testing
const USER_ADDRESS = process.env.TEST_USER_ADDRESS || '';            // Address that is owner of TEST_POLICY_ID
let userKeypair: any | null = null;
let sessionKey: any | null = null;

beforeAll(async () => {
  expect(TEST_PACKAGE_ID, 'Missing TEST_PACKAGE_ID env').to.not.equal('');
  expect(TEST_POLICY_ID, 'Missing TEST_POLICY_ID env').to.not.equal('');
  // If a test user key is provided via KEYPAIR, load it (so we can simulate user signing)
  if (process.env.KEYPAIR) {
    // TODO: Uncomment when Ed25519Keypair is available
    // const secretKey = fromB64(process.env.KEYPAIR);
    // userKeypair = Ed25519Keypair.fromSecretKey(secretKey);
  }
  // Initialize Seal and Walrus clients (to set up any global config)
  getSealClient();
  getWalrusClient();
  // Create a SessionKey for the user (simulate user approving in wallet or use keypair if available)
  if (USER_ADDRESS) {
    sessionKey = userKeypair
      ? await initSessionKey(USER_ADDRESS, TEST_PACKAGE_ID, 10, userKeypair)
      : await initSessionKey(USER_ADDRESS, TEST_PACKAGE_ID, 10);
    if (!userKeypair) {
      // If we don't have user's private key, we would need a wallet signature here.
      // For test, we expect userKeypair to be available or this test will not decrypt properly.
      console.warn('No user keypair available; sessionKey not fully initialized');
    }
  }
});

afterAll(() => {
  // Cleanup: reset global clients to avoid side effects
  // (Not strictly necessary in single-run tests)
});

// Test Seal encryption/decryption round-trip
it('encrypts and decrypts data via Seal (threshold encryption)', async function() {
  if (!USER_ADDRESS || !sessionKey) {
    this.skip(); // skip if no user context
  }
  const plainText = 'Hello Seal & Walrus!';
  const plainBytes = new TextEncoder().encode(plainText);
  // Encrypt the plaintext for the test policy
  const { encryptedBytes, keyIdHex } = await sealEncrypt(TEST_PACKAGE_ID, TEST_POLICY_ID, plainBytes);
  expect(encryptedBytes).to.be.instanceOf(Uint8Array);
  console.log(`Seal encryption produced keyId=${keyIdHex}`);
  // Decrypt the ciphertext using the sessionKey
  if (sessionKey) {
    // If sessionKey was created without signer, we would need to sign its message now.
    if (!sessionKey.isSigned()) {
      expect(userKeypair, 'User keypair needed to sign session key').to.be.not.null;
      const msg = sessionKey.getPersonalMessage();
      const sig = userKeypair!.signData(msg);
      sessionKey.setPersonalMessageSignature(sig.signature);
    }
    const decryptedBytes = await sealDecrypt(TEST_PACKAGE_ID, TEST_POLICY_ID, encryptedBytes, sessionKey);
    const decryptedText = new TextDecoder().decode(decryptedBytes);
    expect(decryptedText).to.equal(plainText);
  }
});

// Test Walrus storage (write and read)
it('stores and retrieves data via Walrus', async () => {
  if (!userKeypair) {
    this.skip(); // need server keypair to sign Walrus tx for test
  }
  const walrusData = new TextEncoder().encode('Test Walrus Data');
  // Write data blob to Walrus
  const { blobId, objectId } = await walrusWriteBlob(walrusData, userKeypair!, 1, true);
  expect(blobId).to.be.a('string');
  expect(objectId).to.match(/^0x[0-9a-fA-F]+$/);
  console.log(`Walrus blob stored: blobId=${blobId}, objectId=${objectId}`);
  // Read blob back from Walrus
  const retrieved = await walrusReadBlob(blobId);
  expect(new Uint8Array(retrieved)).to.deep.equal(walrusData);
});
