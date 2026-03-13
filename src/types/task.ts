import type { RoadmapStage, TaskCategory, TaskStatus, MilestoneStatus } from "./company";

export interface TaskItem {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  category: TaskCategory;
  stage: RoadmapStage;
  priority: number;
  dueDate: Date | null;
  completedAt: Date | null;
  sortOrder: number;
  checklistItemKey: string | null;
  resourceUrl: string | null;
  resourceLabel: string | null;
}

export interface MilestoneItem {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  stage: RoadmapStage;
  status: MilestoneStatus;
  sortOrder: number;
  completedAt: Date | null;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface StageProgress {
  stage: RoadmapStage;
  label: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  milestone: MilestoneItem | null;
}
