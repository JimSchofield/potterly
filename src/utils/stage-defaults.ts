import { StageDetails, StageData, ThrowStageData, GlazeStageData } from '../types/Piece';

export const createDefaultStageData = (): StageData => ({
  notes: '',
  imageUrl: ''
});

export const createDefaultThrowStageData = (): ThrowStageData => ({
  notes: '',
  imageUrl: '',
  weight: null
});

export const createDefaultGlazeStageData = (): GlazeStageData => ({
  notes: '',
  imageUrl: '',
  glazes: ''
});

export const createDefaultStageDetails = (): StageDetails => ({
  ideas: createDefaultStageData(),
  throw: createDefaultThrowStageData(),
  trim: createDefaultStageData(),
  bisque: createDefaultStageData(),
  glaze: createDefaultGlazeStageData(),
  finished: createDefaultStageData()
});
