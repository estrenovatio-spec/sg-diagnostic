import type { Lead } from "@prisma/client";
import {
  assetLabels,
  budgetLabels,
  debtLabels,
  feedbackLabels,
  goalLabels,
  incomeLevelLabels,
  maritalStatusLabels,
  painPointLabels,
  readinessLabels,
  reserveLabels,
  savingsLabels,
  stabilityLabels,
  whyNowLabels,
} from "@/lib/labels";

export function buildLeadContext(lead: Lead): Record<string, unknown> {
  return {
    fullName: lead.fullName,
    age: lead.age,
    city: lead.city,
    maritalStatus: maritalStatusLabels[lead.maritalStatus],
    profession: lead.profession,
    incomeLevel: incomeLevelLabels[lead.incomeLevel],
    incomeStability: stabilityLabels[lead.incomeStability],
    hasDebts: debtLabels[lead.hasDebts],
    hasSavings: savingsLabels[lead.hasSavings],
    assets: lead.assets.map((a) => assetLabels[a]),
    mainPainPoint:
      lead.mainPainPoint === "OTHER"
        ? lead.painPointOther
        : painPointLabels[lead.mainPainPoint],
    goals: lead.goals35years.map((g) => goalLabels[g]),
    triedBefore: lead.triedBefore,
    mistakes: lead.mistakes,
    whyNow: whyNowLabels[lead.whyNow],
    readiness: readinessLabels[lead.readinessLevel],
    feedbackStyle: feedbackLabels[lead.feedbackStyle],
    monthlyReserve: reserveLabels[lead.monthlyReserve],
    advisorBudget: budgetLabels[lead.advisorBudget],
    userQuestion: lead.userQuestion,
    qualification: lead.qualification,
    nextStep: lead.nextStep,
  };
}

export function buildDiagnosticReportPrompt(leadData: Record<string, unknown>): string {
  return `
Ты — опытный финансовый советник с экспертизой в стратегическом планировании.
Твоя задача: проанализировать анкету клиента и составить персональный отчёт.

### Контекст компании:
- Компания: SG Capital, основатель — Алексей Шаргатов
- Позиционирование: «Финансовая стратегия. Спокойствие. Наследие»
- Философия: не «горящие схемы», а системные стратегии на годы
- ЦА: предприниматели, топ-менеджеры, эксперты с доходом от 250 000 ₽/мес

### Входные данные клиента:
${JSON.stringify(leadData, null, 2)}

### Требования к отчёту:
1. Тон: спокойный, уверенный, без запугивания, с акцентом на контроль и ясность
2. Структура ответа — ТОЛЬКО валидный JSON:

{
  "summary": "2-3 предложения: кто клиент и его финансовый статус",
  "strengths": ["сильная сторона 1", "сильная сторона 2"],
  "growthZones": ["зона роста 1", "зона роста 2", "зона роста 3"],
  "risks": ["риск 1", "риск 2"],
  "quickWins": ["действие на неделю 1", "действие на неделю 2"],
  "priorityFocus": "На чём сфокусироваться в первую очередь (1 предложение)",
  "investmentReadiness": true,
  "consultationRecommendation": "Текст рекомендации",
  "suggestedNextStep": "BOOK_CALL"
}

suggestedNextStep — одно из: BOOK_CALL | SEND_MATERIALS | WAIT_ACCUMULATE

### Логика рекомендации:
- Если доход ≥250к + накопления ≥300к + есть боль по инвестициям → призыв записаться на стратегическую сессию
- Если доход хороший, но нет подушки → сначала подушка 3–6 месяцев
- Если есть крупные долги → фокус на рефинансирование и план
- Если доход <150к или нет готовности платить → вернуться при капитале от 300к

### Важно:
- Не давай конкретных инвестиционных рекомендаций
- Не обещай доходность
- Акцент на стратегию, дисциплину, системность
`.trim();
}
