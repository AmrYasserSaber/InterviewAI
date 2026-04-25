"use client";
import { useEffect, useState } from "react";
import type { QuestionDTO } from "@/types";
export function usePayment(requestId: string, initialQuestions: QuestionDTO[], initiallyUnlocked: boolean) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [isPolling, setIsPolling] = useState(false);
  useEffect(() => {
    if (!isPolling || unlocked) return;
    const i = setInterval(async () => {
      const res = await fetch(`/api/questions/${requestId}`, { cache: "no-store" });
      if (!res.ok) return;
      const d = (await res.json()) as { unlocked: boolean; questions: QuestionDTO[] };
      setUnlocked(d.unlocked);
      setQuestions(d.questions);
      if (d.unlocked) setIsPolling(false);
    }, 2000);
    return () => clearInterval(i);
  }, [isPolling, unlocked, requestId]);
  return { questions, unlocked, isPolling, startPolling: () => setIsPolling(true) };
}
