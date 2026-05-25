"use server";

import { revalidatePath } from "next/cache";
import { generateAiReport } from "@/lib/ai/client";
import { prisma } from "@/lib/db";
import { qualifyLead } from "@/lib/qualification";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/security";
import { appendLeadToGoogleSheet } from "@/lib/google-sheets";
import { notifyManager, sendReportToClient } from "@/lib/telegram";
import { diagnosticSchema, type DiagnosticFormValues } from "@/lib/validation/schema";
import type { Qualification } from "@prisma/client";

export type SubmitResult =
  | { ok: true; leadId: string; qualification: Qualification }
  | { ok: false; error: string };

export async function submitDiagnostic(data: DiagnosticFormValues): Promise<SubmitResult> {
  const parsed = diagnosticSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Проверьте данные анкеты" };
  }

  const ip = getClientIp();
  const ipHash = hashIp(ip);
  const rate = checkRateLimit(ipHash);
  if (!rate.ok) {
    return {
      ok: false,
      error: `Слишком много попыток. Попробуйте через ${rate.retryAfterSec ?? 3600} сек.`,
    };
  }

  const v = parsed.data;
  const q = qualifyLead({
    incomeLevel: v.incomeLevel,
    hasSavings: v.hasSavings,
    hasDebts: v.hasDebts,
    mainPainPoint: v.mainPainPoint,
    advisorBudget: v.advisorBudget,
    goals35years: v.goals35years,
  });

  const lead = await prisma.lead.create({
    data: {
      fullName: v.fullName,
      age: v.age,
      city: v.city,
      phone: v.phone,
      telegram: v.telegram || null,
      maritalStatus: v.maritalStatus,
      profession: v.profession,
      incomeLevel: v.incomeLevel,
      incomeStability: v.incomeStability,
      hasDebts: v.hasDebts,
      hasSavings: v.hasSavings,
      assets: v.assets,
      mainPainPoint: v.mainPainPoint,
      painPointOther: v.painPointOther,
      goals35years: v.goals35years,
      triedBefore: v.triedBefore || null,
      mistakes: v.mistakes || null,
      whyNow: v.whyNow,
      readinessLevel: v.readinessLevel,
      feedbackStyle: v.feedbackStyle,
      monthlyReserve: v.monthlyReserve,
      advisorBudget: v.advisorBudget,
      userQuestion: v.userQuestion || null,
      rulesAccepted: v.rulesAccepted,
      pdConsent: v.pdConsent,
      utmSource: v.utmSource,
      ipHash,
      qualification: q.qualification,
      nextStep: q.nextStep,
    },
  });

  const { output, rawPrompt, modelUsed, tokensUsed } = await generateAiReport(lead);

  const aiReport = await prisma.aiReport.create({
    data: {
      leadId: lead.id,
      summary: output.summary,
      strengths: output.strengths,
      growthZones: output.growthZones,
      risks: output.risks,
      quickWins: output.quickWins,
      priorityFocus: output.priorityFocus,
      investmentReadiness: output.investmentReadiness,
      consultationRecommendation: output.consultationRecommendation,
      rawPrompt,
      modelUsed,
      tokensUsed,
    },
  });

  await notifyManager(lead, q.qualification);
  await sendReportToClient(lead.telegram, aiReport, lead.id);

  const reportUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/diagnostic/report/${lead.id}`;
  try {
    await appendLeadToGoogleSheet(lead, q.qualification, reportUrl);
  } catch (err) {
    console.error("Google Sheets sync failed:", err);
  }

  revalidatePath(`/diagnostic/report/${lead.id}`);

  return { ok: true, leadId: lead.id, qualification: q.qualification };
}
