"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, type RoadmapStage, type TaskStatus } from "@/types/company";
import type { TaskItem } from "@/types/task";

const stages: RoadmapStage[] = ["FORMATION", "REGISTRATION", "BANKING", "COMPLIANCE", "LAUNCH", "GROWTH"];

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksSkeleton />}>
      <TasksContent />
    </Suspense>
  );
}

function TasksSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="h-8 bg-muted rounded w-48 animate-pulse" />
      <div className="h-4 bg-muted rounded w-64 animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function TasksContent() {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get("stage") as RoadmapStage | null;

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<RoadmapStage | "ALL">(initialStage ?? "ALL");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as TaskStatus } : t
      )
    );

    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update task");
    } catch {
      setTasks(previousTasks);
    }
  }

  const filtered = tasks.filter((t) => {
    if (filterStage !== "ALL" && t.stage !== filterStage) return false;
    if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
    return true;
  });

  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const total = tasks.length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-64 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          {total > 0
            ? `${completed} of ${total} tasks completed`
            : "Complete the setup wizard to generate your tasks"}
        </p>
        {total > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mt-3">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Filters */}
      {total > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value as RoadmapStage | "ALL")}
            className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm"
          >
            <option value="ALL">All Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>{STAGE_LABELS[s]}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "ALL")}
            className="px-3 py-1.5 border border-border rounded-lg bg-background text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="SKIPPED">Skipped</option>
          </select>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border border-border transition-colors",
              task.status === "COMPLETED" ? "bg-muted/30" : "bg-card"
            )}
          >
            <button
              onClick={() => toggleTask(task.id, task.status)}
              className={cn(
                "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                task.status === "COMPLETED"
                  ? "bg-primary border-primary"
                  : "border-border hover:border-primary"
              )}
            >
              {task.status === "COMPLETED" && (
                <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium", task.status === "COMPLETED" && "line-through text-muted-foreground")}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                  {STAGE_LABELS[task.stage as RoadmapStage] ?? task.stage}
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">
                  {task.category.toLowerCase()}
                </span>
                {task.resourceUrl && (
                  <a
                    href={task.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {task.resourceLabel || "Resource"}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && total > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks match your current filters.
        </div>
      )}

      {total === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks yet. Complete the setup wizard to get started.</p>
          <a
            href="/setup"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Setup
          </a>
        </div>
      )}
    </div>
  );
}
