export type AgentRole = "sales" | "marketing" | "pm" | "coder";

export interface AgentConfig {
  id: AgentRole;
  name: string;
  title: string;
  description: string;
  avatar: string;
  color: string;
  suggestedPrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export const AGENTS: Record<AgentRole, AgentConfig> = {
  sales: {
    id: "sales",
    name: "Alex",
    title: "Sales Agent",
    description:
      "Helps with lead generation, cold outreach, CRM setup, and building your first sales pipeline.",
    avatar: "/images/agents/sales.png",
    color: "emerald",
    suggestedPrompts: [
      "Help me identify my target customer persona",
      "Draft a cold outreach email for my product",
      "Create a simple CRM tracking system",
      "Build my first sales pitch deck outline",
    ],
  },
  marketing: {
    id: "marketing",
    name: "Maya",
    title: "Marketing Agent",
    description:
      "Assists with brand strategy, content calendar, social media planning, and growth tactics.",
    avatar: "/images/agents/marketing.png",
    color: "violet",
    suggestedPrompts: [
      "Build my brand positioning statement",
      "Create a 30-day content calendar",
      "Plan my social media launch strategy",
      "Help me write my company tagline and value prop",
    ],
  },
  pm: {
    id: "pm",
    name: "Jordan",
    title: "PM Agent",
    description:
      "Supports project planning, roadmap creation, task management, and sprint organization.",
    avatar: "/images/agents/pm.png",
    color: "amber",
    suggestedPrompts: [
      "Create my first product roadmap",
      "Break down my MVP into user stories",
      "Set up a weekly sprint template",
      "Help me prioritize my feature backlog",
    ],
  },
  coder: {
    id: "coder",
    name: "Dev",
    title: "Coder Agent",
    description:
      "Provides technical guidance, architecture advice, code reviews, and development best practices.",
    avatar: "/images/agents/coder.png",
    color: "blue",
    suggestedPrompts: [
      "Review my tech stack choices",
      "Design a database schema for my MVP",
      "Help me write a technical specification",
      "Suggest the best deployment strategy for my app",
    ],
  },
};
