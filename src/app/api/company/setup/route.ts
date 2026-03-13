import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { getChecklistForEntity, getDocumentTemplates, supportedCountries } from "@/data/jurisdictions";
import type { CountryCode, RoadmapStage } from "@/types/company";
import { STAGE_LABELS } from "@/types/company";

const setupSchema = z.object({
  country: z.string().min(1),
  entityType: z.string().min(1),
  companyName: z.string().min(2).max(200),
  founderName: z.string().optional(),
  founderEmail: z.string().email().optional().or(z.literal("")),
  founderAddress: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { country, entityType, companyName, founderName, founderEmail, founderAddress, industry, description } = parsed.data;

    // Validate country is supported
    const supportedCountry = supportedCountries.find((c) => c.code === country && c.available);
    if (!supportedCountry) {
      return NextResponse.json({ error: "Unsupported country" }, { status: 400 });
    }

    // Create slug
    let slug = slugify(companyName);
    const existing = await db.company.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Use a transaction for atomic creation
    const result = await db.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          userId: session.user.id,
          name: companyName,
          slug,
          jurisdictionCode: country,
          entityType,
          status: "IN_PROGRESS",
          industry: industry || null,
          description: description || null,
          founderDetails: JSON.stringify({ founderName, founderEmail, founderAddress }),
          setupData: JSON.stringify(parsed.data),
          setupCompleted: true,
          setupCurrentStep: 8,
        },
      });

      // Generate tasks from checklist
      const checklistItems = getChecklistForEntity(country as CountryCode, entityType);
      for (let i = 0; i < checklistItems.length; i++) {
        const item = checklistItems[i];
        await tx.task.create({
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

      // Generate milestones
      const stageOrder: RoadmapStage[] = ["FORMATION", "REGISTRATION", "BANKING", "COMPLIANCE", "LAUNCH", "GROWTH"];
      for (let i = 0; i < stageOrder.length; i++) {
        const stage = stageOrder[i];
        await tx.milestone.create({
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
        await tx.document.create({
          data: {
            companyId: company.id,
            title: doc.title,
            description: doc.description,
            templateKey: doc.key,
            status: "PENDING",
          },
        });
      }

      return company;
    });

    return NextResponse.json({ success: true, companyId: result.id }, { status: 201 });
  } catch (error) {
    console.error("Company setup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
