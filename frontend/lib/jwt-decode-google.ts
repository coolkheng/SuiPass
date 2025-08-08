import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  iss?: string;
  sub?: string; // Subject ID
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  // You can add more fields as needed
}

/**
 * Decodes a JWT string and returns the payload as JwtPayload.
 * @param encodedJWT The JWT string (id_token from Google)
 * @returns JwtPayload
 */
export function decodeGoogleJwt(encodedJWT: string): JwtPayload {
  return jwtDecode<JwtPayload>(encodedJWT);
}
