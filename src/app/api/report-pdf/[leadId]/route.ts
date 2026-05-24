import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReportPdf } from "@/lib/pdf";

type Params = { params: { leadId: string } };

export async function GET(_request: Request, { params }: Params) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: { aiReport: true },
  });

  if (!lead?.aiReport) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdfBytes = await buildReportPdf(lead, lead.aiReport);

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sg-capital-report-${lead.id}.pdf"`,
    },
  });
}
