import {
  BudgetLevel,
  DebtLevel,
  GoalType,
  IncomeLevel,
  type Lead,
  NextStep,
  PainPoint,
  Qualification,
  SavingsLevel,
} from "@prisma/client";

export type QualificationResult = {
  qualification: Qualification;
  nextStep: NextStep;
  message: string;
};

export type LeadQualificationInput = Pick<
  Lead,
  "incomeLevel" | "hasSavings" | "hasDebts" | "mainPainPoint" | "advisorBudget"
> & {
  goals35years: GoalType[];
};

/** Персональный текст для COLD — без упоминания долгов, если их нет */
export function buildColdMessage(lead: LeadQualificationInput): string {
  const { hasDebts, hasSavings, advisorBudget } = lead;
  const focus: string[] = [];

  if (
    ([DebtLevel.FROM_500K_TO_2M, DebtLevel.OVER_2M] as DebtLevel[]).includes(hasDebts)
  ) {
    focus.push("закрытии дорогих долгов");
  } else if (hasDebts === DebtLevel.UP_TO_500K) {
    focus.push("управлении текущими обязательствами");
  }

  if (
    hasSavings === SavingsLevel.NO_SAVINGS ||
    hasSavings === SavingsLevel.UP_TO_300K
  ) {
    focus.push("создании финансовой подушки на 3–6 месяцев расходов");
  }

  if (advisorBudget === BudgetLevel.NOT_READY_PAY && focus.length === 0) {
    return "Когда будете готовы обсудить формат работы с советником — вернитесь к диагностике или запишитесь на вводную сессию.";
  }

  if (focus.length === 0) {
    return "Накопите от 300 000 ₽ свободных средств — тогда сможем перейти к полноценной инвестиционной стратегии.";
  }

  const focusText =
    focus.length === 1
      ? focus[0]
      : `${focus.slice(0, -1).join(", ")} и ${focus[focus.length - 1]}`;

  return `Сначала сфокусируйтесь на ${focusText}. Вернитесь, когда будет от 300 000 ₽ свободных средств.`;
}

export function qualifyLead(lead: LeadQualificationInput): QualificationResult {
  const { incomeLevel, hasSavings, hasDebts, mainPainPoint, advisorBudget, goals35years } =
    lead;

  if (
    (
      [
        IncomeLevel.FROM_250K_TO_400K,
        IncomeLevel.FROM_400K_TO_700K,
        IncomeLevel.OVER_700K,
      ] as IncomeLevel[]
    ).includes(incomeLevel) &&
    (
      [
        SavingsLevel.FROM_300K_TO_1M,
        SavingsLevel.FROM_1M_TO_5M,
        SavingsLevel.OVER_5M,
      ] as SavingsLevel[]
    ).includes(hasSavings) &&
    (
      [
        BudgetLevel.ONE_TIME_30K_100K,
        BudgetLevel.SUBSCRIPTION_100K_PLUS,
        BudgetLevel.OPEN_TO_DISCUSS,
      ] as BudgetLevel[]
    ).includes(advisorBudget) &&
    mainPainPoint !== PainPoint.NO_SAFETY_NET
  ) {
    return {
      qualification: Qualification.HOT,
      nextStep: NextStep.BOOK_CALL,
      message:
        "У вас есть потенциал для построения инвестиционной стратегии. Рекомендую стратегическую сессию.",
    };
  }

  if (
    (
      [IncomeLevel.FROM_150K_TO_250K, IncomeLevel.FROM_250K_TO_400K] as IncomeLevel[]
    ).includes(incomeLevel) &&
    (
      [SavingsLevel.UP_TO_300K, SavingsLevel.FROM_300K_TO_1M] as SavingsLevel[]
    ).includes(hasSavings) &&
    goals35years.includes(GoalType.BUILD_SAFETY_NET)
  ) {
    return {
      qualification: Qualification.WARM,
      nextStep: NextStep.SEND_MATERIALS,
      message:
        "Вы на правильном пути. Сначала соберите подушку 3–6 месяцев расходов, затем вернёмся к инвестициям.",
    };
  }

  if (
    ([DebtLevel.FROM_500K_TO_2M, DebtLevel.OVER_2M] as DebtLevel[]).includes(hasDebts) ||
    hasSavings === SavingsLevel.NO_SAVINGS ||
    hasSavings === SavingsLevel.UP_TO_300K ||
    advisorBudget === BudgetLevel.NOT_READY_PAY
  ) {
    return {
      qualification: Qualification.COLD,
      nextStep: NextStep.WAIT_ACCUMULATE,
      message: buildColdMessage(lead),
    };
  }

  return {
    qualification: Qualification.NOT_READY,
    nextStep: NextStep.MANUAL_REVIEW,
    message:
      "Спасибо за анкету. Я изучу вашу ситуацию и вернусь с персональным ответом в течение 24 часов.",
  };
}
