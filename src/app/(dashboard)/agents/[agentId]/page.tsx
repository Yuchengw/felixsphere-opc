"use client";

import { useParams } from "next/navigation";
import { useChat } from "ai/react";
import { AGENTS, type AgentRole } from "@/types/agent";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
};

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as AgentRole;
  const agent = AGENTS[agentId];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: "/api/chat",
      body: { agentRole: agentId },
      onError: (err) => {
        setError(err.message || "Something went wrong. Please try again.");
      },
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Agent not found</p>
      </div>
    );
  }

  const colors = colorMap[agent.color];

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      {/* Agent Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold",
            colors.bg,
            colors.text
          )}
        >
          {agent.name[0]}
        </div>
        <div>
          <h2 className="font-semibold">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">{agent.title}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4",
                colors.bg,
                colors.text
              )}
            >
              {agent.name[0]}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Chat with {agent.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              {agent.description}
            </p>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {agent.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="text-sm bg-muted hover:bg-muted/80 rounded-lg px-3 py-2 text-left transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
                  colors.bg,
                  colors.text
                )}
              >
                {agent.name[0]}
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
                colors.bg,
                colors.text
              )}
            >
              {agent.name[0]}
            </div>
            <div className="bg-muted rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-500 py-2">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-border pt-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask ${agent.name} anything...`}
            className="flex-1 px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary text-primary-foreground px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
