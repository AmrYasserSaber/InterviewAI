import { notFound } from "next/navigation";
import { ResultsClient } from "@/app/results/[requestId]/ResultsClient";
import { getCurrentUserId } from "@/lib/current-user";
import { NotFoundError } from "@/lib/errors";
import { ForbiddenError, getQuestionsForRequest } from "@/services/questions/gate";

export const metadata = {
  title: "Your Interview Questions — InterviewAI",
};

export default async function ResultsPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  const viewerUserId = await getCurrentUserId();

  let data;
  try {
    data = await getQuestionsForRequest(requestId, viewerUserId);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      notFound();
    }
    throw error;
  }

  return (
    <main className="flex-grow flex flex-col items-center py-margin-desktop px-gutter w-full max-w-[1200px] mx-auto">
      <header className="w-full text-center mb-12">
        <h1 className="font-display-lg text-display-lg text-on-background mb-4">Your Interview Questions</h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">
          We&apos;ve generated a tailored set of questions based on your provided job description and role requirements.
        </p>
      </header>

      <ResultsClient
        requestId={requestId}
        initialQuestions={data.questions}
        initiallyUnlocked={data.unlocked}
        isAuthenticated={Boolean(viewerUserId)}
      />
    </main>
  );
}
