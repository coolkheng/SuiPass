import { getExtendedEphemeralPublicKey } from "@mysten/sui/zklogin";

export interface ZkProverRequest {
  jwt: string;
  extendedEphemeralPublicKey: string; // base64 or bigint string
  jwtRandomness: string; // base64 or bigint string
  salt: string; // base64 or bigint string
  keyClaimName: string; // usually sub
}

export interface ZkProverResponse {
  proof: string;
  // ...other fields as returned by the prover
}

/**
 * Calls the Mysten zkLogin Prover Dev endpoint to get a ZK proof.
 * @param req ZkProverRequest
 * @returns ZkProverResponse
 */
export async function fetchZkProofFromMysten(
  req: ZkProverRequest
): Promise<ZkProverResponse> {
  const response = await fetch("https://prover-dev.mystenlabs.com/v1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jwt: req.jwt,
      extendedEphemeralPublicKey: req.extendedEphemeralPublicKey,
      jwtRandomness: req.jwtRandomness,
      salt: req.salt,
      keyClaimName: req.keyClaimName,
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch ZK proof from Mysten prover");
  }
  return await response.json();
}

/**
 * Helper to get the extended ephemeral public key from a keypair.
 * @param ephemeralKeyPair The Ed25519Keypair instance
 * @returns base64 string
 */
export function getExtendedEphemeralPublicKeyBase64(
  ephemeralKeyPair: any
): string {
  // Assumes ephemeralKeyPair has getPublicKey() method
  return getExtendedEphemeralPublicKey(ephemeralKeyPair.getPublicKey());
}
