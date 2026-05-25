import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildReportPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { leadId: string } };

export async function GET(_request: Request, { params }: Params) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.leadId },
      include: { aiReport: true },
    });

    if (!lead?.aiReport) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pdfBytes = await buildReportPdf(lead, lead.aiReport);
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `attachment; filename="sg-report-${lead.id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
