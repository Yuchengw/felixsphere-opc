import { auth } from "@/lib/auth";
import { buildCompanyContext } from "@/lib/ai/context-builder";
import { getAgentSystemPrompt } from "@/lib/ai/agents";
import type { AgentRole } from "@/types/agent";

const VALID_ROLES = ["sales", "marketing", "pm", "coder"];

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { messages, agentRole } = body;

    if (!agentRole || !VALID_ROLES.includes(agentRole)) {
      return new Response("Invalid agent role", { status: 400 });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("Messages are required", { status: 400 });
    }

    // Build context from user's company data
    const companyContext = await buildCompanyContext(session.user.id);
    const systemPrompt = getAgentSystemPrompt(agentRole as AgentRole, companyContext);

    // Try to use AI SDK if API key is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey || anthropicKey) {
      try {
        const { streamText } = await import("ai");

        if (anthropicKey) {
          const { createAnthropic } = await import("@ai-sdk/anthropic");
          const anthropic = createAnthropic({ apiKey: anthropicKey });
          const result = streamText({
            model: anthropic("claude-sonnet-4-20250514"),
            system: systemPrompt,
            messages,
          });
          return result.toDataStreamResponse();
        } else {
          const { createOpenAI } = await import("@ai-sdk/openai");
          const openai = createOpenAI({ apiKey: openaiKey });
          const result = streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages,
          });
          return result.toDataStreamResponse();
        }
      } catch (error) {
        console.error("AI SDK error, falling back to mock:", error);
      }
    }

    // Fallback: return a mock streaming response
    const agentNames: Record<string, string> = {
      sales: "Alex",
      marketing: "Maya",
      pm: "Jordan",
      coder: "Dev",
    };

    const lastMessage = messages[messages.length - 1]?.content || "";
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
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
