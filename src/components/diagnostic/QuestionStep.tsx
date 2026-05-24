"use client";

import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/diagnostic/PhoneInput";
import { TelegramInput } from "@/components/diagnostic/TelegramInput";
import { ConsentCheckbox } from "@/components/diagnostic/ConsentCheckbox";
import type { StepConfig } from "@/lib/diagnostic-steps";
import type { DiagnosticFormValues } from "@/lib/validation/schema";
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
import { cn } from "@/lib/utils";

type Props = {
  step: StepConfig;
  form: UseFormReturn<DiagnosticFormValues>;
};

function OptionList<T extends string>({
  options,
  value,
  onChange,
  multi,
}: {
  options: { value: T; label: string }[];
  value: T | T[] | undefined;
  onChange: (v: T | T[]) => void;
  multi?: boolean;
}) {
  if (multi) {
    const selected = (value as T[] | undefined) ?? [];
    return (
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                checked ? "border-primary bg-primary/5" : "hover:bg-muted/50",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => {
                  if (c) onChange([...selected, opt.value]);
                  else onChange(selected.filter((x) => x !== opt.value));
                }}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <RadioGroup value={value as string} onValueChange={(v) => onChange(v as T)} className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
            value === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50",
          )}
        >
          <RadioGroupItem value={opt.value} />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

export function QuestionStep({ step, form }: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  if (step.id === "intro") {
    return (
      <div className="space-y-4 text-muted-foreground">
        <p>
          Ответьте честно — на основе анкеты мы подготовим персональный финансовый отчёт: сильные
          стороны, зоны роста, риски и следующий шаг.
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Без «горящих схем» и обещаний доходности</li>
          <li>Фокус на систему, дисциплину и ясность</li>
          <li>Данные защищены согласно 152-ФЗ</li>
        </ul>
      </div>
    );
  }

  if (step.id === "expectations") {
    return (
      <ul className="space-y-3 text-sm text-muted-foreground">
        <li>📊 3–5 ключевых инсайтов по вашим финансам</li>
        <li>📈 Зоны роста и риски</li>
        <li>🎯 Рекомендация: консультация или план накопления</li>
        <li>📱 Копия отчёта в Telegram (если указан @username)</li>
      </ul>
    );
  }

  if (step.id === "review") {
    const v = watch();
    return (
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Имя</dt>
          <dd className="font-medium">{v.fullName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Город · возраст</dt>
          <dd>
            {v.city}, {v.age} лет
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Контакты</dt>
          <dd>
            {v.phone}
            {v.telegram ? ` · ${v.telegram}` : ""}
          </dd>
        </div>
      </dl>
    );
  }

  if (step.id === "fullName") {
    return (
      <div className="space-y-1">
        <Input placeholder="Иван Иванов" {...register("fullName")} />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>
    );
  }

  if (step.id === "age") {
    return (
      <div className="space-y-1">
        <Input type="number" min={18} max={100} {...register("age", { valueAsNumber: true })} />
        {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
      </div>
    );
  }

  if (step.id === "city") {
    return (
      <div className="space-y-1">
        <Input placeholder="Москва" {...register("city")} />
        {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
      </div>
    );
  }

  if (step.id === "phone") {
    return (
      <PhoneInput
        value={watch("phone") ?? ""}
        onChange={(v) => setValue("phone", v, { shouldValidate: true })}
        error={errors.phone?.message}
      />
    );
  }

  if (step.id === "telegram") {
    return (
      <TelegramInput
        value={watch("telegram") ?? ""}
        onChange={(v) => setValue("telegram", v || undefined)}
        error={errors.telegram?.message}
      />
    );
  }

  if (step.id === "profession") {
    return (
      <div className="space-y-1">
        <Input placeholder="Маркетолог, найм" {...register("profession")} />
        {errors.profession && (
          <p className="text-sm text-destructive">{errors.profession.message}</p>
        )}
      </div>
    );
  }

  if (step.id === "triedBefore" || step.id === "mistakes" || step.id === "userQuestion") {
    const field = step.id;
    return (
      <textarea
        className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        {...register(field)}
      />
    );
  }

  if (step.id === "consent") {
    return (
      <ConsentCheckbox
        rulesAccepted={watch("rulesAccepted") === true}
        pdConsent={watch("pdConsent") === true}
        onRulesChange={(v) => setValue("rulesAccepted", v, { shouldValidate: true })}
        onPdChange={(v) => setValue("pdConsent", v, { shouldValidate: true })}
        rulesError={errors.rulesAccepted?.message}
        pdError={errors.pdConsent?.message}
      />
    );
  }

  if (step.id === "mainPainPoint") {
    const pain = watch("mainPainPoint");
    return (
      <div className="space-y-4">
        <OptionList
          options={Object.entries(painPointLabels).map(([value, label]) => ({
            value: value as keyof typeof painPointLabels,
            label,
          }))}
          value={pain}
          onChange={(v) => setValue("mainPainPoint", v as DiagnosticFormValues["mainPainPoint"], {
            shouldValidate: true,
          })}
        />
        {pain === "OTHER" && (
          <div>
            <Label>Уточните</Label>
            <Input className="mt-1" {...register("painPointOther")} />
            {errors.painPointOther && (
              <p className="text-sm text-destructive">{errors.painPointOther.message}</p>
            )}
          </div>
        )}
        {errors.mainPainPoint && (
          <p className="text-sm text-destructive">{errors.mainPainPoint.message}</p>
        )}
      </div>
    );
  }

  const enumSteps: Record<string, { value: string; label: string }[]> = {
    maritalStatus: Object.entries(maritalStatusLabels).map(([value, label]) => ({ value, label })),
    incomeLevel: Object.entries(incomeLevelLabels).map(([value, label]) => ({ value, label })),
    incomeStability: Object.entries(stabilityLabels).map(([value, label]) => ({ value, label })),
    hasDebts: Object.entries(debtLabels).map(([value, label]) => ({ value, label })),
    hasSavings: Object.entries(savingsLabels).map(([value, label]) => ({ value, label })),
    assets: Object.entries(assetLabels).map(([value, label]) => ({ value, label })),
    goals35years: Object.entries(goalLabels).map(([value, label]) => ({ value, label })),
    whyNow: Object.entries(whyNowLabels).map(([value, label]) => ({ value, label })),
    readinessLevel: Object.entries(readinessLabels).map(([value, label]) => ({ value, label })),
    feedbackStyle: Object.entries(feedbackLabels).map(([value, label]) => ({ value, label })),
    monthlyReserve: Object.entries(reserveLabels).map(([value, label]) => ({ value, label })),
    advisorBudget: Object.entries(budgetLabels).map(([value, label]) => ({ value, label })),
  };

  const options = enumSteps[step.id];
  if (options) {
    const multi = step.id === "assets" || step.id === "goals35years";
    const field = step.id as keyof DiagnosticFormValues;
    return (
      <div>
        <OptionList
          options={options}
          multi={multi}
          value={watch(field) as never}
          onChange={(v) => setValue(field, v as never, { shouldValidate: true })}
        />
        {errors[field] && (
          <p className="mt-2 text-sm text-destructive">{String(errors[field]?.message)}</p>
        )}
      </div>
    );
  }

  return null;
}
