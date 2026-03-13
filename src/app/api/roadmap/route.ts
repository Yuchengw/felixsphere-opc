import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const company = await db.company.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!company) {
    return NextResponse.json({ milestones: [] });
  }

  const milestones = await db.milestone.findMany({
    where: { companyId: company.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ milestones });
}
