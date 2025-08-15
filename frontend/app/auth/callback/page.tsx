"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { extractJwtFromUrl } from "@/lib/zklogin-helpers";
import { decodeGoogleJwt, JwtPayload } from "@/lib/jwt-decode-google";
import { fetchUserSalt } from "@/lib/zklogin-salt-client";
import { fetchZkProofFromBackend } from "@/lib/zklogin-prover-backend-client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const process = async () => {
      const jwt = extractJwtFromUrl();
      if (jwt) {
        // Decode JWT to get iss, aud, sub, nonce, etc. (type-safe)
        const decoded: JwtPayload = decodeGoogleJwt(jwt);
        const { iss, aud, sub, nonce } = decoded as JwtPayload & {
          nonce?: string;
        };

        if (iss && aud && sub && nonce) {
          try {
            const audStr = Array.isArray(aud) ? aud[0] : aud;
            const user_salt = await fetchUserSalt({ iss, aud: audStr, sub });
            console.log("Fetched user_salt:", user_salt);

            // nonce is a base64url-encoded string, use as-is for zkLogin
            let eph_pk = nonce;
            let jwt_randomness = "";
            // Call zklogin proof backend proxy
            try {
              const proofData = await fetchZkProofFromBackend({
                jwt,
                extendedEphemeralPublicKey: eph_pk,
                jwtRandomness: jwt_randomness,
                salt: user_salt,
                keyClaimName: sub,
              });
              console.log("zklogin proof response:", proofData);
            } catch (err) {
              console.error(
                "Failed to get zklogin proof from backend proxy",
                err
              );
            }
          } catch (e) {
            console.error("Failed to get user_salt from Rust backend", e);
          }
        }
        router.push("/dashboard");
      }
    };
    process();
  }, [router]);

  return <div>Processing login...</div>;
}
