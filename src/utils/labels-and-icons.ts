import { Stages } from "../types/Piece";

export const STAGE_CONFIG: Record<Stages, { icon: string; label: string }> = {
  ideas: {
    icon: "💡",
    label: "Ideas",
  },
  throw: {
    icon: "🏺",
    label: "Throw",
  },
  trim: {
    icon: "🔧",
    label: "Trim",
  },
  bisque: {
    icon: "🔥",
    label: "Bisque",
  },
  glaze: {
    icon: "🎨",
    label: "Glaze",
  },
  finished: {
    icon: "✨",
    label: "Finished",
  },
} as const;

export const getStageIcon = (stage: Stages): string => {
  return STAGE_CONFIG[stage].icon || "";
};

export const getStageLabel = (stage: Stages): string => {
  return STAGE_CONFIG[stage].label || stage;
};

export const getAllStages = (): Stages[] => {
  return Object.keys(STAGE_CONFIG) as Stages[];
};

export const getStageConfig = (stage: Stages) => {
  return STAGE_CONFIG[stage];
};

