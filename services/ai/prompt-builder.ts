import type { DifficultyMode, ExperienceLevel } from "@prisma/client";
export const buildSystemPrompt = () =>
  `You are an expert technical interviewer. Respond only with JSON object: {"questions":[...10 strings...]}.`;
export function buildUserPrompt(params: {
  cv: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  difficultyMode: DifficultyMode;
}) {
  return `DIFFICULTY:${params.difficultyMode}\nLEVEL:${params.experienceLevel}\n<CANDIDATE_CV>${params.cv}</CANDIDATE_CV>\n<JOB_DESCRIPTION>${params.jobDescription}</JOB_DESCRIPTION>`;
}
