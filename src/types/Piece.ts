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
  date: string;
  priority: Priorities;
  stage: Stages;
}
