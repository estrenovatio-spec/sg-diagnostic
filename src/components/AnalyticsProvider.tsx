"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, trackEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (pathname?.includes("/diagnostic/report/")) {
      const leadId = pathname.split("/").pop();
      trackEvent("report_viewed", { lead_id: leadId ?? "" });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
