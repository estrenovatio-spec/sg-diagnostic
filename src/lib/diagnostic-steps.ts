import type { DiagnosticFormValues } from "@/lib/validation/schema";

export type StepId =
  | "intro"
  | "expectations"
  | "fullName"
  | "age"
  | "city"
  | "phone"
  | "telegram"
  | "maritalStatus"
  | "profession"
  | "incomeLevel"
  | "incomeStability"
  | "hasDebts"
  | "hasSavings"
  | "assets"
  | "mainPainPoint"
  | "goals35years"
  | "triedBefore"
  | "mistakes"
  | "whyNow"
  | "readinessLevel"
  | "feedbackStyle"
  | "monthlyReserve"
  | "advisorBudget"
  | "userQuestion"
  | "review"
  | "consent";

export type StepConfig = {
  id: StepId;
  title: string;
  subtitle?: string;
  fields: (keyof DiagnosticFormValues)[];
};

export const DIAGNOSTIC_STEPS: StepConfig[] = [
  {
    id: "intro",
    title: "Финансовая диагностика Алексея Шаргатова",
    subtitle: "5–7 минут · 26 вопросов · персональный отчёт",
    fields: [],
  },
  {
    id: "expectations",
    title: "Что вы получите",
    subtitle: "После анкеты — персональный отчёт за ~1 минуту",
    fields: [],
  },
  { id: "fullName", title: "Как вас зовут?", fields: ["fullName"] },
  { id: "age", title: "Сколько вам лет?", fields: ["age"] },
  { id: "city", title: "В каком городе вы живёте?", fields: ["city"] },
  { id: "phone", title: "Ваш телефон", subtitle: "Просто для связи", fields: ["phone"] },
  {
    id: "telegram",
    title: "Telegram",
    subtitle: "Чтобы отправить отчёт в мессенджер (необязательно)",
    fields: ["telegram"],
  },
  { id: "maritalStatus", title: "Семейное положение", fields: ["maritalStatus"] },
  { id: "profession", title: "Профессия и формат занятости", fields: ["profession"] },
  { id: "incomeLevel", title: "Средний месячный доход после налогов", fields: ["incomeLevel"] },
  { id: "incomeStability", title: "Насколько стабилен доход?", fields: ["incomeStability"] },
  { id: "hasDebts", title: "Есть ли долги и обязательства?", fields: ["hasDebts"] },
  { id: "hasSavings", title: "Свободные накопления (без недвижимости)", fields: ["hasSavings"] },
  { id: "assets", title: "Какие активы у вас уже есть?", subtitle: "Можно несколько", fields: ["assets"] },
  { id: "mainPainPoint", title: "Главная финансовая боль сейчас", fields: ["mainPainPoint", "painPointOther"] },
  { id: "goals35years", title: "Цели на 3–5 лет", subtitle: "Можно несколько", fields: ["goals35years"] },
  { id: "triedBefore", title: "Что уже пробовали?", subtitle: "Необязательно", fields: ["triedBefore"] },
  { id: "mistakes", title: "Какие ошибки допускали?", subtitle: "Необязательно", fields: ["mistakes"] },
  { id: "whyNow", title: "Почему решили пройти диагностику сейчас?", fields: ["whyNow"] },
  { id: "readinessLevel", title: "Готовность следовать системе", fields: ["readinessLevel"] },
  { id: "feedbackStyle", title: "Какой формат обратной связи вам ближе?", fields: ["feedbackStyle"] },
  { id: "monthlyReserve", title: "Сколько можете откладывать ежемесячно?", fields: ["monthlyReserve"] },
  { id: "advisorBudget", title: "Бюджет на работу с финансовым советником", fields: ["advisorBudget"] },
  {
    id: "userQuestion",
    title: "Вопрос к Алексею",
    subtitle: "Необязательно",
    fields: ["userQuestion"],
  },
  {
    id: "review",
    title: "Проверьте перед отправкой",
    subtitle: "Данные можно изменить кнопкой «Назад»",
    fields: [],
  },
  {
    id: "consent",
    title: "Согласия и отправка",
    fields: ["rulesAccepted", "pdConsent"],
  },
];

export const TOTAL_STEPS = DIAGNOSTIC_STEPS.length;
