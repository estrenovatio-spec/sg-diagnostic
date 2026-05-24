"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type Props = { leadId: string };

export function DownloadPDF({ leadId }: Props) {
  return (
    <Button variant="outline" asChild>
      <a
        href={`/api/report-pdf/${leadId}`}
        download
        onClick={() => trackEvent("cta_clicked", { lead_id: leadId, cta_type: "download_pdf" })}
      >
        <Download className="h-4 w-4" />
        Скачать PDF
      </a>
    </Button>
  );
}
