import { z } from "zod";
export const AIOutputSchema = z.object({ questions: z.array(z.string().min(10).max(1000)).length(10) });
