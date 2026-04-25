"use client";

import { QuestionList } from "@/components/results/QuestionList";
import { UnlockCTA } from "@/components/results/UnlockCTA";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { usePayment } from "@/hooks/usePayment";
import type { QuestionDTO } from "@/types";

type Props = {
  requestId: string;
  initialQuestions: QuestionDTO[];
  initiallyUnlocked: boolean;
  isAuthenticated: boolean;
};

export function ResultsClient({ requestId, initialQuestions, initiallyUnlocked, isAuthenticated }: Props) {
  const { questions, unlocked, isPolling, startPolling } = usePayment(requestId, initialQuestions, initiallyUnlocked);

  async function copyToClipboard() {
    const text = questions
      .map((q) => `${q.position.toString().padStart(2, "0")}. ${q.content}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
  }

  if (unlocked) {
    return (
      <section className="w-full bg-surface-container rounded-xl p-card-padding shadow-neumorphic border border-surface-bright/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container opacity-[0.02] rounded-full blur-[64px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-surface-variant/50 relative z-10">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
            <Icon name="terminal" className="text-primary-container opacity-80" size={28} />
            Generated Assessment
          </h2>
          <div className="mt-4 sm:mt-0 font-label-caps text-label-caps text-surface-tint bg-primary-container/10 border border-primary-container/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            {questions.length} Variables Active
          </div>
        </div>

        <div className="relative z-10">
          <QuestionList questions={questions} unlocked />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mt-10 w-full sm:w-auto">
          <Button variant="neon" size="lg" onClick={() => void copyToClipboard()}>
            <Icon name="content_copy" />
            Copy Questions
          </Button>
          <Button variant="neon" size="lg" onClick={() => window.print()}>
            <Icon name="picture_as_pdf" />
            Download as PDF
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-surface-container rounded-xl shadow-neumorphic p-card-padding border border-white/5 relative overflow-hidden">
      <QuestionList questions={questions} unlocked={false} />

      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-surface-container to-transparent z-20 pointer-events-none" />

      <div className="relative -mb-2 mt-8">
        <UnlockCTA
          requestId={requestId}
          onPaymentStarted={startPolling}
          isPolling={isPolling}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </section>
  );
}
