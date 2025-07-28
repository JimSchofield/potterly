import { pieceTypes } from "../utils/piece-types";

export type Stages =
  | "ideas"
  | "throw"
  | "trim"
  | "bisque"
  | "glaze"
  | "finished";
export type Priorities = "high" | "medium" | "low";

export type Types = (typeof pieceTypes)[number];

export interface PotteryPiece {
  id: string;
  title: string;
  type: Types;
  details: string;
  status?: string; // Optional status/notes field for display purposes
  priority: Priorities;
  stage: Stages;
  archived: boolean;
  starred: boolean;
  createdAt: string; // ISO date string
  lastUpdated: string; // ISO date string
  dueDate?: string; // Optional ISO date string
}
