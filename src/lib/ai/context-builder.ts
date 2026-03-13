import { db } from "@/lib/db";

export async function buildCompanyContext(userId: string): Promise<string> {
  const company = await db.company.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!company) {
    return "The user has not set up a company yet. They are exploring the platform. Help them understand what steps they need to take.";
  }

  const tasks = await db.task.findMany({
    where: { companyId: company.id },
  });

  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const totalTasks = tasks.length;

  let founderInfo = "";
  if (company.founderDetails) {
    try {
      const details = JSON.parse(company.founderDetails);
      founderInfo = `Founder: ${details.founderName || "Unknown"}`;
    } catch {
      founderInfo = "";
    }
  }

  const context = [
    `--- Company Context ---`,
    `Company Name: ${company.name}`,
    `Jurisdiction: ${company.jurisdictionCode}`,
    `Entity Type: ${company.entityType}`,
    `Status: ${company.status}`,
    company.industry ? `Industry: ${company.industry}` : null,
    company.description ? `Description: ${company.description}` : null,
    founderInfo || null,
    `Progress: ${completedTasks}/${totalTasks} tasks completed`,
    `Setup Completed: ${company.setupCompleted ? "Yes" : "No"}`,
    `--- End Context ---`,
  ]
    .filter(Boolean)
    .join("\n");

  return context;
}
