import { DifficultyMode, ExperienceLevel } from "@prisma/client";
import { z } from "zod";
export const GenerateRequestSchema = z.object({
  cv: z.string().min(50).max(8000),
  jobDescription: z.string().min(20).max(3000),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  difficultyMode: z.nativeEnum(DifficultyMode),
});
export const CreatePaymentSchema = z.object({ requestId: z.string().cuid() });
export const CapturePaymentSchema = z.object({ orderId: z.string().min(1), requestId: z.string().cuid() });
