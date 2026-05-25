"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type Props = { leadId: string };

export function DownloadPDF({ leadId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    trackEvent("cta_clicked", { lead_id: leadId, cta_type: "download_pdf" });

    try {
      const res = await fetch(`/api/report-pdf/${leadId}`);
      if (!res.ok) throw new Error("Не удалось сформировать PDF");

      const blob = await res.blob();
      if (!blob.type.includes("pdf") && blob.size < 500) {
        throw new Error("Сервер вернул не PDF — попробуйте позже");
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sg-report-${leadId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Не удалось скачать PDF. Откройте отчёт в браузере и сохраните через «Печать → PDF».");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button type="button" variant="outline" onClick={handleDownload} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Скачать PDF
      </Button>
      {error && <p className="max-w-sm text-center text-xs text-muted-foreground">{error}</p>}
    </div>
  );
}
