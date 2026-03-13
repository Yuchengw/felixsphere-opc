import type { AgentRole } from "@/types/agent";
import { salesSystemPrompt } from "@/data/agent-prompts/sales";
import { marketingSystemPrompt } from "@/data/agent-prompts/marketing";
import { pmSystemPrompt } from "@/data/agent-prompts/pm";
import { coderSystemPrompt } from "@/data/agent-prompts/coder";

const agentPrompts: Record<AgentRole, string> = {
  sales: salesSystemPrompt,
  marketing: marketingSystemPrompt,
  pm: pmSystemPrompt,
  coder: coderSystemPrompt,
};

export function getAgentSystemPrompt(role: AgentRole, companyContext: string): string {
  const basePrompt = agentPrompts[role];
  return `${basePrompt}\n\n${companyContext}`;
}
