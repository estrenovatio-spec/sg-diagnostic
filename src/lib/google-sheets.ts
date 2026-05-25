import type { Lead, Qualification } from "@prisma/client";
import {
  assetLabels,
  budgetLabels,
  debtLabels,
  goalLabels,
  incomeLevelLabels,
  painPointLabels,
  qualificationLabels,
  savingsLabels,
} from "@/lib/labels";

/** Строка в Google Таблицу через Apps Script Web App (см. docs/GOOGLE-SHEETS.md) */
export async function appendLeadToGoogleSheet(
  lead: Lead,
  qualification: Qualification,
  reportUrl: string,
): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.ADMIN_DASHBOARD_URL ?? "";

  const row = {
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
    fullName: lead.fullName,
    age: lead.age,
    city: lead.city,
    phone: lead.phone ?? "",
    telegram: lead.telegram ?? "",
    profession: lead.profession,
    incomeLevel: incomeLevelLabels[lead.incomeLevel],
    hasDebts: debtLabels[lead.hasDebts],
    hasSavings: savingsLabels[lead.hasSavings],
    assets: lead.assets.map((a) => assetLabels[a]).join("; "),
    mainPainPoint:
      lead.mainPainPoint === "OTHER"
        ? lead.painPointOther ?? "Другое"
        : painPointLabels[lead.mainPainPoint],
    goals: lead.goals35years.map((g) => goalLabels[g]).join("; "),
    advisorBudget: budgetLabels[lead.advisorBudget],
    userQuestion: lead.userQuestion ?? "",
    qualification: qualificationLabels[qualification],
    reportUrl: reportUrl || `${siteUrl}/diagnostic/report/${lead.id}`,
    utmSource: lead.utmSource ?? "",
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Sheets webhook ${res.status}: ${text.slice(0, 200)}`);
  }
}
