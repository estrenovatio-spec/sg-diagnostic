"use client";

import Link from "next/link";
import { Calendar, Mail, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NextStep, Qualification } from "@prisma/client";
import { trackEvent } from "@/lib/analytics";

type Props = {
  leadId: string;
  qualification: Qualification;
  nextStep: NextStep | null;
  recommendation: string;
  qualificationMessage: string;
};

export function CTASection({
  leadId,
  qualification,
  nextStep,
  recommendation,
  qualificationMessage,
}: Props) {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "#";

  const onCta = (cta_type: string) => {
    trackEvent("cta_clicked", { lead_id: leadId, cta_type });
  };

  if (nextStep === "BOOK_CALL" || qualification === "HOT") {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm">{recommendation}</p>
          <p className="text-xs text-muted-foreground">{qualificationMessage}</p>
          <Button asChild size="lg" className="w-full" onClick={() => onCta("book_call")}>
            <Link href={bookingUrl} target="_blank">
              <Calendar className="h-4 w-4" />
              Записаться на стратегическую сессию
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (nextStep === "SEND_MATERIALS" || qualification === "WARM") {
    return (
      <Card>
        <CardContent className="space-y-4 p-6">
          <p className="text-sm">{recommendation}</p>
          <Button variant="secondary" className="w-full" onClick={() => onCta("send_materials")}>
            <Mail className="h-4 w-4" />
            Получить материалы на email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <PiggyBank className="h-8 w-8 text-primary" />
        <p className="text-sm">{recommendation || qualificationMessage}</p>
        <Button variant="outline" asChild onClick={() => onCta("restart")}>
          <Link href="/diagnostic">Пройти снова</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
