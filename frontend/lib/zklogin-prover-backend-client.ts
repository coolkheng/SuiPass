import { ZkProverRequest, ZkProverResponse } from "./zklogin-prover-client";

/**
 * Calls the backend proxy for Mysten zkLogin Prover.
 * @param req ZkProverRequest
 * @returns ZkProverResponse
 */
export async function fetchZkProofFromBackend(
  req: ZkProverRequest
): Promise<ZkProverResponse> {
  const response = await fetch("/api/zklogin-prover/zklogin/proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend ZK proof error: ${text}`);
  }
  return await response.json();
}
