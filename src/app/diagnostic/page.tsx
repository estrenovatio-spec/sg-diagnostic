import { Suspense } from "react";
import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";

export default function DiagnosticPage() {
  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <Suspense fallback={<div className="mx-auto max-w-lg text-center text-muted-foreground">Загрузка…</div>}>
        <DiagnosticWizard />
      </Suspense>
    </main>
  );
}
