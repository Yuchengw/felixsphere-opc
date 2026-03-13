import { requireAuth, getUserCompany } from "@/lib/auth-helpers";
import Link from "next/link";
import { STAGE_LABELS, type RoadmapStage } from "@/types/company";
import { AGENTS, type AgentRole } from "@/types/agent";

const stages: { stage: RoadmapStage; icon: string }[] = [
  { stage: "FORMATION", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { stage: "REGISTRATION", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { stage: "BANKING", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { stage: "COMPLIANCE", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { stage: "LAUNCH", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
];

export default async function DashboardPage() {
  const user = await requireAuth();
  const company = await getUserCompany(user.id!);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user.name?.split(" ")[0] ?? "Founder"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {company
            ? `Managing ${company.name}`
            : "Let's get your company started"}
        </p>
      </div>

      {/* Quick Start / Setup CTA */}
      {!company && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-2">
            Start Your Company Journey
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg">
            Our setup wizard will guide you through choosing your jurisdiction,
            entity type, and everything you need to register your one-person
            company.
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Launch Setup Wizard
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Company Progress Stages */}
      {company && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Company Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stages.map(({ stage, icon }) => (
              <Link
                key={stage}
                href={`/tasks?stage=${stage}`}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={icon} />
                    </svg>
                  </div>
                  <h3 className="font-medium">{STAGE_LABELS[stage]}</h3>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: "0%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  0 of 0 tasks completed
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AI Agents Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your AI Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(AGENTS) as AgentRole[]).map((role) => {
            const agent = AGENTS[role];
            const colorMap: Record<string, string> = {
              emerald: "bg-emerald-500/10 text-emerald-600",
              violet: "bg-violet-500/10 text-violet-600",
              amber: "bg-amber-500/10 text-amber-600",
              blue: "bg-blue-500/10 text-blue-600",
            };
            return (
              <Link
                key={role}
                href={`/agents/${role}`}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mb-3 ${colorMap[agent.color]}`}
                >
                  {agent.name[0]}
                </div>
                <h3 className="font-medium">{agent.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {agent.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
