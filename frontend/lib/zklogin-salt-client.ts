// Client for fetching user salt from the Rust backend
export async function fetchUserSalt({
  iss,
  aud,
  sub,
  backendUrl = "http://localhost:4000/api/zklogin/salt",
}: {
  iss: string;
  aud: string;
  sub: string;
  backendUrl?: string;
}): Promise<string> {
  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ iss, aud, sub }),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user salt from backend");
  }
  const data = await res.json();
  return data.user_salt;
}
