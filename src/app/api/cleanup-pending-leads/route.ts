import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await prisma.lead.deleteMany({
    where: {
      qualification: "PENDING",
      aiReport: { is: null },
      createdAt: { lt: cutoff },
    },
  });

  return NextResponse.json({ deleted: result.count });
}
