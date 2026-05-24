import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { notifyManager } from "@/lib/telegram";

export async function POST(request: Request) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.RATE_LIMIT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { leadId?: string };
  if (!body.leadId) {
    return NextResponse.json({ error: "leadId required" }, { status: 400 });
  }

  const lead = await prisma.lead.findUnique({ where: { id: body.leadId } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await notifyManager(lead, lead.qualification);
  return NextResponse.json({ ok: true });
}
