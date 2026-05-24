"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/diagnostic/ProgressBar";
import { QuestionStep } from "@/components/diagnostic/QuestionStep";
import { submitDiagnostic } from "@/app/diagnostic/actions";
import { DIAGNOSTIC_STEPS, TOTAL_STEPS } from "@/lib/diagnostic-steps";
import { trackEvent } from "@/lib/analytics";
import {
  defaultFormValues,
  diagnosticSchema,
  type DiagnosticFormValues,
} from "@/lib/validation/schema";

export function DiagnosticWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [pending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<DiagnosticFormValues>({
    resolver: zodResolver(diagnosticSchema),
    defaultValues: {
      ...defaultFormValues,
      fullName: "",
      city: "",
      phone: "",
      profession: "",
      rulesAccepted: false,
      pdConsent: false,
      utmSource: searchParams.get("utm_source") ?? undefined,
    },
    mode: "onChange",
  });

  const step = DIAGNOSTIC_STEPS[stepIndex];

  useEffect(() => {
    trackEvent("diagnostic_started", { utm_source: searchParams.get("utm_source") ?? "" });
  }, [searchParams]);

  const validateCurrentStep = async () => {
    if (step.id === "intro" || step.id === "expectations" || step.id === "review") return true;
    if (step.id === "telegram") return true;
    const fields = step.fields.filter((f) => f !== "painPointOther" || form.getValues("mainPainPoint") === "OTHER");
    return form.trigger(fields.length ? fields : undefined);
  };

  const goNext = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
    trackEvent("diagnostic_step_completed", { step_number: stepIndex + 1 });
    if (stepIndex < TOTAL_STEPS - 1) {
      setStepIndex((i) => i + 1);
      return;
    }
    startTransition(async () => {
      setSubmitError(null);
      const values = form.getValues();
      const result = await submitDiagnostic(values);
      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }
      trackEvent("diagnostic_submitted", { lead_id: result.leadId, qualification: result.qualification });
      router.push(`/diagnostic/report/${result.leadId}`);
    });
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  return (
    <Card className="mx-auto max-w-lg border-0 shadow-lg">
      <CardHeader className="space-y-4 pb-2">
        <div className="text-center text-xs font-medium uppercase tracking-widest text-primary">
          SG Capital
        </div>
        <ProgressBar current={stepIndex + 1} total={TOTAL_STEPS} />
        <CardTitle className="text-xl">{step.title}</CardTitle>
        {step.subtitle && <p className="text-sm text-muted-foreground">{step.subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-6 pb-8">
        <QuestionStep step={step} form={form} />
        {submitError && <p className="text-sm text-destructive">{submitError}</p>}
        <div className="flex gap-3">
          {stepIndex > 0 && (
            <Button type="button" variant="outline" onClick={goBack} disabled={pending}>
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          )}
          <Button type="button" className="flex-1" onClick={goNext} disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : stepIndex === TOTAL_STEPS - 1 ? (
              "Получить отчёт"
            ) : (
              <>
                Далее
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
