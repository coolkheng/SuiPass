import { generateEphemeralKeypair } from "./wallet-crypto";

// Helper to create a nonce with embedded ephemeral public key, expiry, and randomness
export function createZkLoginNonce({
  eph_pk,
  max_epoch,
  jwt_randomness,
}: {
  eph_pk: Uint8Array | string;
  max_epoch: number;
  jwt_randomness: string;
}): string {
  // This is a placeholder. You must follow the Sui zkLogin nonce spec for production.
  // Typically, the nonce is a base64-encoded JSON with these fields.
  return btoa(JSON.stringify({ eph_pk, max_epoch, jwt_randomness }));
}

// Helper to build Google OAuth URL with nonce
export function getGoogleOAuthUrl({ nonce }: { nonce: string }): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "";
  const scope = "openid email profile";
  const state = Math.random().toString(36).substring(2);
  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}&nonce=${nonce}`;
}

// Helper to extract JWT from URL hash after redirect
export function extractJwtFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("id_token");
}
