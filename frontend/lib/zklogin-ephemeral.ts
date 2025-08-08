import { SuiClient } from "@mysten/sui/client";
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { getGoogleOAuthUrl, extractJwtFromUrl } from "./zklogin-helpers";

const FULLNODE_URL = "https://fullnode.devnet.sui.io";

// Main zkLogin ephemeral key and OAuth flow
export async function startZkLoginFlow() {
  // 1. Get current epoch from Sui
  const suiClient = new SuiClient({ url: FULLNODE_URL });
  const { epoch } = await suiClient.getLatestSuiSystemState();

  // 2. Generate ephemeral keypair
    const ephemeralKeypair = new Ed25519Keypair();

  // 3. Set expiration (maxEpoch)
  const maxEpoch = Number(epoch) + 2;

  // 4. Generate randomness and nonce
  const randomness = generateRandomness();
  const nonce = generateNonce(ephemeralKeypair.getPublicKey(), maxEpoch, randomness);

  // 5. Assemble OAuth URL (Google example)
  const oauthUrl = getGoogleOAuthUrl({ nonce });

  return {
    ephemeralKeypair,
    maxEpoch,
    randomness,
    nonce,
    oauthUrl,
  };
}

// To handle JWT after redirect (for providers that return JWT directly):
// const jwt = extractJwtFromUrl();

// For providers that require token exchange, use fetch to POST to the token endpoint with the code.
