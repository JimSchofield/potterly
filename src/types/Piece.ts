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

// Stage-specific data interfaces
export interface StageData {
  notes?: string;
  imageUrl?: string;
}

export interface ThrowStageData extends StageData {
  weight?: number | null; // Weight in grams
}

export interface GlazeStageData extends StageData {
  glazes?: string; // Description of glazes used
}

export interface StageDetails {
  ideas: StageData;
  throw: ThrowStageData;
  trim: StageData;
  bisque: StageData;
  glaze: GlazeStageData;
  finished: StageData;
}

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
  ownerId: string; // UUID of the user who owns this piece
  createdAt: string; // ISO date string
  lastUpdated: string; // ISO date string
  dueDate?: string; // Optional ISO date string
  stageDetails: StageDetails; // Stage-specific information
}
