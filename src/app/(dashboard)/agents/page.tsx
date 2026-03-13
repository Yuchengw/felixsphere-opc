import Link from "next/link";
import { AGENTS, type AgentRole } from "@/types/agent";

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "hover:border-emerald-500/30" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600", border: "hover:border-violet-500/30" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600", border: "hover:border-amber-500/30" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600", border: "hover:border-blue-500/30" },
};

export default function AgentsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Your AI Team</h1>
        <p className="text-muted-foreground mt-1">
          Four specialized agents ready to help you build your company
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(AGENTS) as AgentRole[]).map((role) => {
          const agent = AGENTS[role];
          const colors = colorMap[agent.color];

          return (
            <Link
              key={role}
              href={`/agents/${role}`}
              className={`bg-card border border-border rounded-xl p-6 transition-colors ${colors.border}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${colors.bg} ${colors.text}`}
                >
                  {agent.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className={`text-sm font-medium ${colors.text}`}>
                    {agent.title}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {agent.description}
              </p>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Try asking:
                </p>
                {agent.suggestedPrompts.slice(0, 2).map((prompt) => (
                  <p
                    key={prompt}
                    className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-1.5 truncate"
                  >
                    &ldquo;{prompt}&rdquo;
                  </p>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
