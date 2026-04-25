export function sanitizeInput(raw: string, maxLength: number): string {
  return raw.trim().slice(0, maxLength).replace(/[\u0000-\u001F]/g, " ").replace(/\s{3,}/g, "\n\n");
}
