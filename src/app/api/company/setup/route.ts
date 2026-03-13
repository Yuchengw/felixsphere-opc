import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getChecklistForEntity, getDocumentTemplates } from "@/data/jurisdictions";
import type { CountryCode, RoadmapStage } from "@/types/company";
import { STAGE_LABELS } from "@/types/company";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { country, entityType, companyName, founderName, founderEmail, founderAddress, industry, description } = body;

    if (!country || !entityType || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create slug
    let slug = slugify(companyName);
    const existing = await db.company.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Build jurisdiction code
    const jurisdictionCode = country;

    // Create company
    const company = await db.company.create({
      data: {
        userId: session.user.id,
        name: companyName,
        slug,
        jurisdictionCode,
        entityType,
        status: "IN_PROGRESS",
        industry: industry || null,
        description: description || null,
        founderDetails: JSON.stringify({ founderName, founderEmail, founderAddress }),
        setupData: JSON.stringify(body),
        setupCompleted: true,
        setupCurrentStep: 8,
      },
    });

    // Generate tasks from checklist
    const checklistItems = getChecklistForEntity(country as CountryCode, entityType);
    for (let i = 0; i < checklistItems.length; i++) {
      const item = checklistItems[i];
      await db.task.create({
        data: {
          companyId: company.id,
          title: item.title,
          description: item.description,
          status: "PENDING",
          category: item.category,
          stage: item.stage,
          priority: item.priority,
          sortOrder: i,
          checklistItemKey: item.key,
          resourceUrl: item.resourceUrl || null,
          resourceLabel: item.resourceLabel || null,
        },
      });
    }

    // Generate milestones from stages
    const stageOrder: RoadmapStage[] = ["FORMATION", "REGISTRATION", "BANKING", "COMPLIANCE", "LAUNCH", "GROWTH"];
    for (let i = 0; i < stageOrder.length; i++) {
      const stage = stageOrder[i];
      await db.milestone.create({
        data: {
          companyId: company.id,
          title: STAGE_LABELS[stage],
          description: `Complete all ${stage.toLowerCase()} tasks`,
          stage,
          status: i === 0 ? "AVAILABLE" : "LOCKED",
          sortOrder: i,
        },
      });
    }

    // Generate document records
    const docTemplates = getDocumentTemplates(country as CountryCode, entityType);
    for (const doc of docTemplates) {
      await db.document.create({
        data: {
          companyId: company.id,
          title: doc.title,
          description: doc.description,
          templateKey: doc.key,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ success: true, companyId: company.id }, { status: 201 });
  } catch (error) {
    console.error("Company setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
