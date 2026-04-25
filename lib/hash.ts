import { createHash } from "crypto";
import type { DifficultyMode, ExperienceLevel } from "@/types";
export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
export function computeInputHash(cv: string, jd: string, level: ExperienceLevel, difficulty: DifficultyMode) {
  return sha256(`${cv.toLowerCase().trim()}::${jd.toLowerCase().trim()}::${level}::${difficulty}`);
}
