export type Stages =
  | "ideas"
  | "throw"
  | "trim"
  | "bisque"
  | "glaze"
  | "finished";
export type Priorities = "high" | "medium" | "low";

export interface PotteryPiece {
  id: string;
  title: string;
  type: string;
  details: string;
  date: string; // Legacy field for display purposes
  priority: Priorities;
  stage: Stages;
  createdAt: string; // ISO date string
  lastUpdated: string; // ISO date string
  dueDate?: string; // Optional ISO date string
}
