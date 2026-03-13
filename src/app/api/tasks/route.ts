import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const stage = searchParams.get("stage");
  const status = searchParams.get("status");

  const company = await db.company.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!company) {
    return NextResponse.json({ tasks: [] });
  }

  const where: Record<string, unknown> = { companyId: company.id };
  if (stage) where.stage = stage;
  if (status) where.status = status;

  const tasks = await db.task.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ tasks });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { taskId, status } = body;

  if (!taskId || !status) {
    return NextResponse.json({ error: "Missing taskId or status" }, { status: 400 });
  }

  const task = await db.task.findUnique({ where: { id: taskId }, include: { company: true } });
  if (!task || task.company.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });

  return NextResponse.json({ task: updated });
}
