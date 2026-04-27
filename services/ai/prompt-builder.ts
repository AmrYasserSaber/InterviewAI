import type { DifficultyMode, ExperienceLevel } from "@prisma/client";
export const buildSystemPrompt = () =>
  `You are an expert professional interviewer. Generate only interview questions that are directly grounded in the provided CV and job description for hiring evaluation, regardless of profession or industry. Respond only with JSON object: {"questions":[...10 strings...]}.`;
export function buildUserPrompt(params: {
  cv: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  difficultyMode: DifficultyMode;
}) {
  const cvSection = params.cv.trim().length > 0 ? params.cv : "Not provided";
  return `DIFFICULTY:${params.difficultyMode}\nLEVEL:${params.experienceLevel}\n<CANDIDATE_CV>${cvSection}</CANDIDATE_CV>\n<JOB_DESCRIPTION>${params.jobDescription}</JOB_DESCRIPTION>`;
}
