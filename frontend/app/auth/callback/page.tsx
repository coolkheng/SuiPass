"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { extractJwtFromUrl } from "@/lib/zklogin-helpers";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const jwt = extractJwtFromUrl();
    if (jwt) {
      // You can store the JWT, call your backend, etc. here
      router.push("/dashboard");
    }
  }, [router]);

  return <div>Processing login...</div>;
}
