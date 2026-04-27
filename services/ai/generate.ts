import type { DifficultyMode, ExperienceLevel } from "@prisma/client";
import { prisma } from "@/lib/db";
import { computeInputHash, sha256 } from "@/lib/hash";
import { buildSystemPrompt, buildUserPrompt } from "@/services/ai/prompt-builder";
import { callOpenAI } from "@/services/ai/openai-client";
import { assertInterviewScope } from "@/services/ai/guardrails";
import { AIOutputSchema } from "@/services/ai/schema";
import { sanitizeInput } from "@/services/ai/sanitizer";
import { CV_MAX_LENGTH, FREE_QUESTIONS_COUNT, JD_MAX_LENGTH } from "@/utils/constants";

type Input = {
  cv: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  difficultyMode: DifficultyMode;
  ipAddress?: string;
  userId?: string | null;
};

export async function generateQuestions(input: Input) {
  const cv = sanitizeInput(input.cv, CV_MAX_LENGTH);
  const jd = sanitizeInput(input.jobDescription, JD_MAX_LENGTH);
  assertInterviewScope({ cv, jobDescription: jd });
  const inputHash = computeInputHash(cv, jd, input.experienceLevel, input.difficultyMode);

  // Cache only within the same ownership scope: a user sees their own prior
  // identical request; anonymous sees previous anonymous matches.
  const cached = await prisma.interviewRequest.findFirst({
    where: {
      inputHash,
      status: "COMPLETED",
      userId: input.userId ?? null,
    },
    include: { questions: { where: { isLocked: false }, orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  if (cached) {
    return { requestId: cached.id, fromCache: true, questions: cached.questions };
  }

  const req = await prisma.interviewRequest.create({
    data: {
      inputHash,
      cvHash: sha256(cv),
      jdHash: sha256(jd),
      experienceLevel: input.experienceLevel,
      difficultyMode: input.difficultyMode,
      ipAddress: input.ipAddress,
      userId: input.userId ?? null,
    },
  });

  const { raw, usage } = await callOpenAI(
    buildSystemPrompt(),
    buildUserPrompt({
      cv,
      jobDescription: jd,
      experienceLevel: input.experienceLevel,
      difficultyMode: input.difficultyMode,
    }),
  );
  const parsed = AIOutputSchema.parse(JSON.parse(raw));

  await prisma.$transaction([
    ...parsed.questions.map((content, i) =>
      prisma.question.create({
        data: { requestId: req.id, position: i + 1, content, isLocked: i >= FREE_QUESTIONS_COUNT },
      }),
    ),
    prisma.interviewRequest.update({
      where: { id: req.id },
      data: {
        status: "COMPLETED",
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
      },
    }),
  ]);

  const unlocked = await prisma.question.findMany({
    where: { requestId: req.id, isLocked: false },
    orderBy: { position: "asc" },
  });

  return { requestId: req.id, fromCache: false, questions: unlocked };
}
