"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { STAGE_LABELS, type RoadmapStage } from "@/types/company";
import type { MilestoneItem, StageProgress } from "@/types/task";

export default function RoadmapPage() {
  const [stages, setStages] = useState<StageProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
      const [tasksRes, milestonesRes] = await Promise.all([
        fetch("/api/tasks"),
        fetch("/api/roadmap"),
      ]);
      if (!tasksRes.ok || !milestonesRes.ok) throw new Error("Failed to fetch data");
      const { tasks } = await tasksRes.json();
      const { milestones } = await milestonesRes.json();

      const stageOrder: RoadmapStage[] = ["FORMATION", "REGISTRATION", "BANKING", "COMPLIANCE", "LAUNCH", "GROWTH"];
      const progressData: StageProgress[] = stageOrder.map((stage) => {
        const stageTasks = (tasks || []).filter((t: { stage: string }) => t.stage === stage);
        const completedTasks = stageTasks.filter((t: { status: string }) => t.status === "COMPLETED").length;
        const milestone = (milestones || []).find((m: MilestoneItem) => m.stage === stage) || null;

        return {
          stage,
          label: STAGE_LABELS[stage],
          totalTasks: stageTasks.length,
          completedTasks,
          percentage: stageTasks.length > 0 ? Math.round((completedTasks / stageTasks.length) * 100) : 0,
          milestone,
        };
      });

      setStages(progressData);
      } catch (error) {
        console.error("Failed to fetch roadmap data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-emerald-500",
    IN_PROGRESS: "bg-primary",
    AVAILABLE: "bg-amber-500",
    LOCKED: "bg-muted-foreground/30",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Company Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          Your journey from formation to growth
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {stages.map((stageData, i) => {
            const milestoneStatus = stageData.milestone?.status ?? "LOCKED";
            const isActive = milestoneStatus === "AVAILABLE" || milestoneStatus === "IN_PROGRESS";

            return (
              <div key={stageData.stage} className="relative flex gap-4">
                {/* Timeline dot */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center z-10 border-4 border-background flex-shrink-0",
                    statusColors[milestoneStatus]
                  )}
                >
                  {milestoneStatus === "COMPLETED" ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={cn(
                    "flex-1 bg-card border rounded-xl p-5 transition-colors",
                    isActive ? "border-primary/30" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{stageData.label}</h3>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        milestoneStatus === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : milestoneStatus === "AVAILABLE" || milestoneStatus === "IN_PROGRESS"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {milestoneStatus === "COMPLETED"
                        ? "Completed"
                        : milestoneStatus === "LOCKED"
                        ? "Locked"
                        : "In Progress"}
                    </span>
                  </div>

                  {stageData.totalTasks > 0 ? (
                    <>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${stageData.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stageData.completedTasks} of {stageData.totalTasks} tasks completed ({stageData.percentage}%)
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
