import { z } from "zod";

export const aiReportOutputSchema = z.object({
  summary: z.string(),
  strengths: z.array(z.string()).min(1),
  growthZones: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  quickWins: z.array(z.string()).min(1),
  priorityFocus: z.string(),
  investmentReadiness: z.boolean(),
  consultationRecommendation: z.string(),
  suggestedNextStep: z
    .enum(["BOOK_CALL", "SEND_MATERIALS", "WAIT_ACCUMULATE"])
    .optional(),
});

export type AiReportOutput = z.infer<typeof aiReportOutputSchema>;

export function parseAiJsonResponse(raw: string): AiReportOutput {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("JSON not found in AI response");
  }
  const parsed = JSON.parse(jsonMatch[0]) as unknown;
  return aiReportOutputSchema.parse(parsed);
}
