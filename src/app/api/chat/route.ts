import { auth } from "@/lib/auth";
import { buildCompanyContext } from "@/lib/ai/context-builder";
import { getAgentSystemPrompt } from "@/lib/ai/agents";
import type { AgentRole } from "@/types/agent";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, agentRole } = await req.json();

  if (!agentRole || !["sales", "marketing", "pm", "coder"].includes(agentRole)) {
    return new Response("Invalid agent role", { status: 400 });
  }

  // Build context from user's company data
  const companyContext = await buildCompanyContext(session.user.id);
  const systemPrompt = getAgentSystemPrompt(agentRole as AgentRole, companyContext);

  // Try to use AI SDK if API key is configured, otherwise return a helpful mock response
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey || anthropicKey) {
    // Dynamic import to avoid build errors if SDK is not configured
    try {
      const { streamText } = await import("ai");

      let model;
      if (anthropicKey) {
        const { createAnthropic } = await import("@ai-sdk/anthropic");
        const anthropic = createAnthropic({ apiKey: anthropicKey });
        model = anthropic("claude-sonnet-4-20250514");
      } else {
        const { createOpenAI } = await import("@ai-sdk/openai");
        const openai = createOpenAI({ apiKey: openaiKey });
        model = openai("gpt-4o-mini");
      }

      const result = streamText({
        model,
        system: systemPrompt,
        messages,
      });

      return result.toDataStreamResponse();
    } catch (error) {
      console.error("AI SDK error:", error);
    }
  }

  // Fallback: return a mock streaming response
  const agentNames: Record<string, string> = {
    sales: "Alex",
    marketing: "Maya",
    pm: "Jordan",
    coder: "Dev",
  };

  const lastMessage = messages?.[messages.length - 1]?.content || "";
  const mockResponse = `Hi! I'm ${agentNames[agentRole]}, your ${agentRole} agent. I received your message: "${lastMessage.slice(0, 50)}..."

To get real AI-powered responses, please add your API key to the \`.env.local\` file:

\`\`\`
OPENAI_API_KEY=your-key-here
# or
ANTHROPIC_API_KEY=your-key-here
\`\`\`

Then restart the dev server. I'll be ready to help you with your one-person company!`;

  // Simulate streaming with a simple text response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Vercel AI SDK data stream format
      let i = 0;
      const interval = setInterval(() => {
        if (i < mockResponse.length) {
          const chunk = mockResponse.slice(i, i + 3);
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          i += 3;
        } else {
          controller.enqueue(encoder.encode(`e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
          controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`));
          controller.close();
          clearInterval(interval);
        }
      }, 20);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}
