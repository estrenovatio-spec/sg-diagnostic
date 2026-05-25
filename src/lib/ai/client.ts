import type { Lead } from "@prisma/client";
import { DebtLevel, SavingsLevel } from "@prisma/client";
import OpenAI from "openai";
import { buildDiagnosticReportPrompt, buildLeadContext } from "@/lib/ai/prompts";
import { type AiReportOutput, parseAiJsonResponse } from "@/lib/ai/parser";
import { resolveAiClientConfig } from "@/lib/ai/provider";
import { qualifyLead } from "@/lib/qualification";

const TEMPERATURE = Number(process.env.AI_TEMPERATURE ?? "0.3");

function buildFallbackRisks(lead: Lead): string[] {
  const risks: string[] = [];

  if (
    ([DebtLevel.FROM_500K_TO_2M, DebtLevel.OVER_2M] as DebtLevel[]).includes(lead.hasDebts)
  ) {
    risks.push("Долговая нагрузка может ограничивать свободу финансовых решений");
  } else if (lead.hasDebts === DebtLevel.UP_TO_500K) {
    risks.push("Небольшие обязательства стоит держать под контролем, чтобы не накапливать проценты");
  }

  if (
    lead.hasSavings === SavingsLevel.NO_SAVINGS ||
    lead.hasSavings === SavingsLevel.UP_TO_300K
  ) {
    risks.push("Недостаточная подушка безопасности при внешних шоках");
  }

  if (risks.length === 0) {
    risks.push("Основные риски — отсутствие единой стратегии и дисциплины в учёте финансов");
  }

  return risks;
}

function buildFallbackReport(lead: Lead): AiReportOutput {
  const q = qualifyLead(lead);
  const noDebt = lead.hasDebts === DebtLevel.NO_DEBTS;

  return {
    summary: `${lead.fullName}, ${lead.age} лет, ${lead.city}. Вы прошли финансовую диагностику Алексея Шаргатова — ниже ключевые наблюдения по вашей анкете${noDebt ? "; по анкете значимых долгов нет" : ""}.`,
    strengths: [
      "Вы осознанно подошли к оценке своей финансовой ситуации",
      noDebt ? "Нет давящей долговой нагрузки — хорошая база для планирования" : "Есть мотивация навести порядок в финансах",
    ],
    growthZones: [
      "Систематизация личного бюджета и резервов",
      "Приоритизация целей на 3–5 лет",
      "Снижение финансовой неопределённости через план",
    ],
    risks: buildFallbackRisks(lead),
    quickWins: [
      "Зафиксировать ежемесячные обязательные расходы в одной таблице",
      noDebt
        ? "Определить целевую сумму подушки и ежемесячный взнос на неё"
        : "Составить список обязательств с датами и ставками",
    ],
    priorityFocus:
      q.qualification === "COLD" || q.nextStep === "WAIT_ACCUMULATE"
        ? "Финансовая подушка и дисциплина в учёте расходов"
        : q.message,
    investmentReadiness: q.qualification === "HOT",
    consultationRecommendation: q.message,
    suggestedNextStep:
      q.nextStep === "BOOK_CALL"
        ? "BOOK_CALL"
        : q.nextStep === "SEND_MATERIALS"
          ? "SEND_MATERIALS"
          : "WAIT_ACCUMULATE",
  };
}

export async function generateAiReport(lead: Lead): Promise<{
  output: AiReportOutput;
  rawPrompt: string;
  modelUsed: string;
  tokensUsed: number;
}> {
  const leadContext = buildLeadContext(lead);
  const rawPrompt = buildDiagnosticReportPrompt(leadContext);
  const ai = resolveAiClientConfig();

  if (!ai.apiKey) {
    return {
      output: buildFallbackReport(lead),
      rawPrompt,
      modelUsed: "fallback (нет API-ключа — по правилам анкеты)",
      tokensUsed: 0,
    };
  }

  const client = new OpenAI({
    apiKey: ai.apiKey,
    baseURL: ai.baseURL,
  });

  try {
    const completion = await client.chat.completions.create({
      model: ai.model,
      temperature: TEMPERATURE,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Ты финансовый стратег Алексея Шаргатова (SG Capital). Отвечай только валидным JSON на русском языке. Не упоминай долги, если в анкете указано, что долгов нет.",
        },
        { role: "user", content: rawPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const output = parseAiJsonResponse(content);

    return {
      output,
      rawPrompt,
      modelUsed: `${ai.provider}:${ai.model}`,
      tokensUsed: completion.usage?.total_tokens ?? 0,
    };
  } catch {
    return {
      output: buildFallbackReport(lead),
      rawPrompt,
      modelUsed: `fallback-error (${ai.provider})`,
      tokensUsed: 0,
    };
  }
}
