"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  async function submit(payload: unknown) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Generation failed");
      const data = (await res.json()) as { requestId: string };
      router.push(`/results/${data.requestId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  }
  return { submit, isLoading, error };
}
