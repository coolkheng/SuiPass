"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { extractJwtFromUrl } from "@/lib/zklogin-helpers";
import { decodeGoogleJwt, JwtPayload } from "@/lib/jwt-decode-google";
import { fetchUserSalt } from "@/lib/zklogin-salt-client";

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
            // Parse nonce (base64-encoded JSON)
            let eph_pk = "";
            let jwt_randomness = "";
            try {
              const nonceDecoded = JSON.parse(atob(nonce));
              eph_pk = nonceDecoded.eph_pk;
              jwt_randomness = nonceDecoded.jwt_randomness;
            } catch (e) {
              console.error("Failed to decode nonce:", e);
            }
            // Call zklogin proof endpoint
            const proofRes = await fetch(
              "http://localhost:4000/api/zklogin/proof",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jwt,
                  user_salt,
                  eph_pk,
                  jwt_randomness,
                  key_claim_name: sub,
                }),
              }
            );
            if (proofRes.ok) {
              const proofData = await proofRes.json();
              console.log("zklogin proof response:", proofData);
            } else {
              console.error("Failed to get zklogin proof from Rust backend");
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
