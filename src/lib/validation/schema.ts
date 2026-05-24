import { z } from "zod";

const enumValues = <T extends string>(values: readonly T[]) =>
  z.enum(values as [T, ...T[]]);

export const diagnosticSchema = z
  .object({
    fullName: z.string().min(2, "Укажите ФИО").max(100),
    age: z.coerce.number().min(18, "Минимум 18 лет").max(100),
    city: z.string().min(2, "Укажите город"),
    phone: z
      .string()
      .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Формат: +7 (999) 123-45-67"),
    telegram: z
      .string()
      .regex(/^@[\w_]{3,32}$/, "Формат: @username")
      .optional()
      .or(z.literal("")),
    maritalStatus: enumValues([
      "SINGLE",
      "MARRIED_NO_KIDS",
      "MARRIED_WITH_KIDS",
    ] as const),
    profession: z.string().min(2, "Опишите профессию").max(200),
    incomeLevel: enumValues([
      "UNDER_150K",
      "FROM_150K_TO_250K",
      "FROM_250K_TO_400K",
      "FROM_400K_TO_700K",
      "OVER_700K",
    ] as const),
    incomeStability: enumValues(["STABLE", "FLUCTUATING", "UNSTABLE"] as const),
    hasDebts: enumValues([
      "NO_DEBTS",
      "UP_TO_500K",
      "FROM_500K_TO_2M",
      "OVER_2M",
    ] as const),
    hasSavings: enumValues([
      "NO_SAVINGS",
      "UP_TO_300K",
      "FROM_300K_TO_1M",
      "FROM_1M_TO_5M",
      "OVER_5M",
    ] as const),
    assets: z
      .array(
        enumValues([
          "NONE",
          "CASH_DEPOSITS",
          "BROKERAGE_IIS",
          "INSURANCE_NSZH_ISZH",
          "REAL_ESTATE_LIVING",
        ] as const),
      )
      .min(1, "Выберите хотя бы один вариант"),
    mainPainPoint: enumValues([
      "NO_SAFETY_NET",
      "DEBT_PRESSURE",
      "MONEY_DISAPPEARS",
      "FEAR_CRISIS",
      "WANT_INVEST_DONT_KNOW_HOW",
      "OTHER",
    ] as const),
    painPointOther: z.string().max(500).optional(),
    goals35years: z
      .array(
        enumValues([
          "BUILD_SAFETY_NET",
          "CLOSE_DEBTS",
          "START_INVESTING",
          "PASSIVE_INCOME",
          "INCOME_REAL_ESTATE",
        ] as const),
      )
      .min(1, "Выберите хотя бы одну цель"),
    triedBefore: z.string().max(1000).optional(),
    mistakes: z.string().max(1000).optional(),
    whyNow: enumValues([
      "WANT_SYSTEM",
      "CANT_HANDLE_ALONE",
      "BAD_EXPERIENCE_BEFORE",
      "KNOWS_NEEDS_HELP",
      "OTHER",
    ] as const),
    readinessLevel: enumValues([
      "READY_REGULAR",
      "READY_WITH_MOTIVATION",
      "HARD_TO_FOLLOW_BUT_WANT",
      "UNSURE",
    ] as const),
    feedbackStyle: enumValues([
      "STRICT_CONTROL",
      "SOFT_SUPPORT",
      "FACTS_ONLY",
    ] as const),
    monthlyReserve: enumValues([
      "UP_TO_10K",
      "FROM_10K_TO_30K",
      "FROM_30K_TO_70K",
      "OVER_70K",
    ] as const),
    advisorBudget: enumValues([
      "NOT_READY_PAY",
      "ONE_TIME_UP_TO_30K",
      "ONE_TIME_30K_100K",
      "SUBSCRIPTION_100K_PLUS",
      "OPEN_TO_DISCUSS",
    ] as const),
    userQuestion: z.string().max(1000).optional(),
    rulesAccepted: z.boolean().refine((v) => v === true, {
      message: "Необходимо принять правила работы",
    }),
    pdConsent: z.boolean().refine((v) => v === true, {
      message: "Необходимо согласие на обработку персональных данных",
    }),
    utmSource: z.string().max(200).optional(),
  })
  .refine(
    (data) =>
      data.mainPainPoint !== "OTHER" ||
      (data.painPointOther && data.painPointOther.trim().length >= 3),
    {
      message: "Опишите вашу ситуацию",
      path: ["painPointOther"],
    },
  );

export type DiagnosticFormValues = z.infer<typeof diagnosticSchema>;

export const defaultFormValues: Partial<DiagnosticFormValues> = {
  assets: [],
  goals35years: [],
  telegram: "",
  triedBefore: "",
  mistakes: "",
  userQuestion: "",
  painPointOther: "",
};
