import { NextResponse } from "next/server";
import { generateAiReport } from "@/lib/ai/client";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/security";

export async function POST(request: Request) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.RATE_LIMIT_SECRET) {
    const ipHash = hashIp(getClientIp());
    const rate = checkRateLimit(ipHash);
    if (!rate.ok) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
  }

  const body = (await request.json()) as { leadId?: string };
  if (!body.leadId) {
    return NextResponse.json({ error: "leadId required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const { output, rawPrompt, modelUsed, tokensUsed } = await generateAiReport(lead);

  const report = await prisma.aiReport.upsert({
    where: { leadId: lead.id },
    create: {
      leadId: lead.id,
      summary: output.summary,
      strengths: output.strengths,
      growthZones: output.growthZones,
      risks: output.risks,
      quickWins: output.quickWins,
      priorityFocus: output.priorityFocus,
      investmentReadiness: output.investmentReadiness,
      consultationRecommendation: output.consultationRecommendation,
      rawPrompt,
      modelUsed,
      tokensUsed,
    },
    update: {
      summary: output.summary,
      strengths: output.strengths,
      growthZones: output.growthZones,
      risks: output.risks,
      quickWins: output.quickWins,
      priorityFocus: output.priorityFocus,
      investmentReadiness: output.investmentReadiness,
      consultationRecommendation: output.consultationRecommendation,
      rawPrompt,
      modelUsed,
      tokensUsed,
      generatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, reportId: report.id });
}
