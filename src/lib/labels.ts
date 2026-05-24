import type {
  AssetType,
  BudgetLevel,
  DebtLevel,
  FeedbackStyle,
  GoalType,
  IncomeLevel,
  MaritalStatus,
  PainPoint,
  Qualification,
  ReadinessLevel,
  ReserveAmount,
  SavingsLevel,
  StabilityLevel,
  WhyNowReason,
} from "@prisma/client";

export const maritalStatusLabels: Record<MaritalStatus, string> = {
  SINGLE: "Холост / не замужем",
  MARRIED_NO_KIDS: "В браке, без детей",
  MARRIED_WITH_KIDS: "В браке, есть дети",
};

export const incomeLevelLabels: Record<IncomeLevel, string> = {
  UNDER_150K: "До 150 000 ₽",
  FROM_150K_TO_250K: "150 000 – 250 000 ₽",
  FROM_250K_TO_400K: "250 000 – 400 000 ₽",
  FROM_400K_TO_700K: "400 000 – 700 000 ₽",
  OVER_700K: "Более 700 000 ₽",
};

export const stabilityLabels: Record<StabilityLevel, string> = {
  STABLE: "Стабильный, предсказуемый",
  FLUCTUATING: "Колеблется от месяца к месяцу",
  UNSTABLE: "Нестабильный",
};

export const debtLabels: Record<DebtLevel, string> = {
  NO_DEBTS: "Нет долгов",
  UP_TO_500K: "До 500 000 ₽",
  FROM_500K_TO_2M: "500 000 – 2 000 000 ₽",
  OVER_2M: "Более 2 000 000 ₽",
};

export const savingsLabels: Record<SavingsLevel, string> = {
  NO_SAVINGS: "Нет накоплений",
  UP_TO_300K: "До 300 000 ₽",
  FROM_300K_TO_1M: "300 000 – 1 000 000 ₽",
  FROM_1M_TO_5M: "1 000 000 – 5 000 000 ₽",
  OVER_5M: "Более 5 000 000 ₽",
};

export const assetLabels: Record<AssetType, string> = {
  NONE: "Пока нет активов",
  CASH_DEPOSITS: "Наличные / вклады",
  BROKERAGE_IIS: "Брокерский счёт / ИИС",
  INSURANCE_NSZH_ISZH: "НСЖ / ИСЖ",
  REAL_ESTATE_LIVING: "Жилая недвижимость",
};

export const painPointLabels: Record<PainPoint, string> = {
  NO_SAFETY_NET: "Нет финансовой подушки",
  DEBT_PRESSURE: "Давят долги",
  MONEY_DISAPPEARS: "Деньги «утекают»",
  FEAR_CRISIS: "Страх кризиса",
  WANT_INVEST_DONT_KNOW_HOW: "Хочу инвестировать, но не знаю как",
  OTHER: "Другое",
};

export const goalLabels: Record<GoalType, string> = {
  BUILD_SAFETY_NET: "Собрать подушку безопасности",
  CLOSE_DEBTS: "Закрыть долги",
  START_INVESTING: "Начать инвестировать",
  PASSIVE_INCOME: "Пассивный доход",
  INCOME_REAL_ESTATE: "Доход от недвижимости",
};

export const whyNowLabels: Record<WhyNowReason, string> = {
  WANT_SYSTEM: "Хочу систему, а не хаос",
  CANT_HANDLE_ALONE: "Не справляюсь один",
  BAD_EXPERIENCE_BEFORE: "Был негативный опыт",
  KNOWS_NEEDS_HELP: "Понимаю, что нужна помощь",
  OTHER: "Другое",
};

export const readinessLabels: Record<ReadinessLevel, string> = {
  READY_REGULAR: "Готов следовать регулярно",
  READY_WITH_MOTIVATION: "Готов при мотивации",
  HARD_TO_FOLLOW_BUT_WANT: "С дисциплиной бывает сложно, но очень хочу изменений",
  UNSURE: "Пока не уверен",
};

export const feedbackLabels: Record<FeedbackStyle, string> = {
  STRICT_CONTROL: "Жёсткий контроль и отчётность",
  SOFT_SUPPORT: "Мягкая поддержка",
  FACTS_ONLY: "Только факты и цифры",
};

export const reserveLabels: Record<ReserveAmount, string> = {
  UP_TO_10K: "До 10 000 ₽/мес",
  FROM_10K_TO_30K: "10 000 – 30 000 ₽/мес",
  FROM_30K_TO_70K: "30 000 – 70 000 ₽/мес",
  OVER_70K: "Более 70 000 ₽/мес",
};

export const budgetLabels: Record<BudgetLevel, string> = {
  NOT_READY_PAY: "Пока не готов платить",
  ONE_TIME_UP_TO_30K: "Разово до 30 000 ₽",
  ONE_TIME_30K_100K: "Разово 30 000 – 100 000 ₽",
  SUBSCRIPTION_100K_PLUS: "Подписка от 100 000 ₽/мес",
  OPEN_TO_DISCUSS: "Готов обсудить",
};

export const qualificationLabels: Record<Qualification, string> = {
  PENDING: "Обработка",
  HOT: "Приоритетная консультация",
  WARM: "Потенциал — материалы и подготовка",
  COLD: "Сначала накопить капитал",
  NOT_READY: "Индивидуальный разбор",
};
