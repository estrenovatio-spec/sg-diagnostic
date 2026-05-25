import { notFound } from "next/navigation";
import { AlertTriangle, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { CTASection } from "@/app/diagnostic/report/components/CTASection";
import { DownloadPDF } from "@/app/diagnostic/report/components/DownloadPDF";
import { ReportCard } from "@/app/diagnostic/report/components/ReportCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { qualificationLabels } from "@/lib/labels";
import { qualifyLead } from "@/lib/qualification";

type Props = { params: { leadId: string } };

export default async function ReportPage({ params }: Props) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: { aiReport: true },
  });

  if (!lead || !lead.aiReport) notFound();

  const report = lead.aiReport;
  const q = qualifyLead(lead);
  const focusText =
    lead.nextStep === "WAIT_ACCUMULATE"
      ? "Финансовая подушка и дисциплина в учёте расходов"
      : report.priorityFocus;

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 md:py-12">
      <header className="space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">SG Capital</p>
        <h1 className="text-2xl font-semibold">Ваш финансовый отчёт</h1>
        <p className="text-sm text-muted-foreground">
          {lead.fullName} · {qualificationLabels[lead.qualification]}
        </p>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Резюме</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportCard title="Сильные стороны" icon={Sparkles} items={report.strengths} />
        <ReportCard title="Зоны роста" icon={TrendingUp} items={report.growthZones} />
        <ReportCard title="Риски" icon={AlertTriangle} items={report.risks} variant="risk" />
        <ReportCard title="Быстрые шаги на неделю" icon={Zap} items={report.quickWins} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Фокус на ближайший месяц</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{focusText}</p>
          {report.investmentReadiness && (
            <p className="mt-2 text-xs text-primary">По анкете — есть база для инвестиционной стратегии</p>
          )}
        </CardContent>
      </Card>

      <CTASection
        leadId={lead.id}
        qualification={lead.qualification}
        nextStep={lead.nextStep}
        message={q.message}
      />

      <div className="flex justify-center pb-8">
        <DownloadPDF leadId={lead.id} />
      </div>
    </main>
  );
}
