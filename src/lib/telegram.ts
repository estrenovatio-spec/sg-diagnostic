import type { AiReport, Lead, Qualification } from "@prisma/client";
import {
  budgetLabels,
  incomeLevelLabels,
  painPointLabels,
  savingsLabels,
} from "@/lib/labels";

const TELEGRAM_API = "https://api.telegram.org/bot";

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) return false;

  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  return res.ok;
}

export async function notifyManager(lead: Lead, qualification: Qualification): Promise<void> {
  if (qualification !== "HOT") return;

  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!adminChatId) return;

  const baseUrl = process.env.ADMIN_DASHBOARD_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const reportUrl = `${baseUrl}/diagnostic/report/${lead.id}`;

  const message = [
    "🔥 <b>ГОРЯЧИЙ ЛИД</b>",
    "",
    `👤 ${escapeHtml(lead.fullName)}, ${lead.age} лет, ${escapeHtml(lead.city)}`,
    `💰 Доход: ${incomeLevelLabels[lead.incomeLevel]}`,
    `💵 Накопления: ${savingsLabels[lead.hasSavings]}`,
    `🎯 Боль: ${painPointLabels[lead.mainPainPoint]}`,
    `💳 Бюджет на советника: ${budgetLabels[lead.advisorBudget]}`,
    `💬 Вопрос: ${escapeHtml(lead.userQuestion ?? "—")}`,
    "",
    `🔗 <a href="${reportUrl}">Открыть отчёт</a>`,
  ].join("\n");

  await sendTelegramMessage(adminChatId, message);
}

export async function sendReportToClient(
  telegram: string | null | undefined,
  report: AiReport,
  leadId: string,
): Promise<void> {
  if (!telegram?.startsWith("@")) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const reportUrl = `${siteUrl}/diagnostic/report/${leadId}`;

  const message = [
    "📊 <b>Ваш персональный финансовый отчёт — Алексей Шаргатов</b>",
    "",
    escapeHtml(report.summary),
    "",
    "✨ <b>Сильные стороны:</b>",
    ...report.strengths.map((s) => `• ${escapeHtml(s)}`),
    "",
    "📈 <b>Зоны роста:</b>",
    ...report.growthZones.map((g) => `• ${escapeHtml(g)}`),
    "",
    `🎯 <b>Фокус:</b> ${escapeHtml(report.priorityFocus)}`,
    "",
    escapeHtml(report.consultationRecommendation),
    "",
    `📥 <a href="${reportUrl}">Полный отчёт на сайте</a>`,
  ].join("\n");

  await sendTelegramMessage(telegram, message);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
