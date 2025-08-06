import { StageDetails, StageData, ThrowStageData, GlazeStageData } from '../types/Piece';

const createDefaultStageData = (): StageData => ({
  notes: '',
  imageUrl: ''
});

const createDefaultThrowStageData = (): ThrowStageData => ({
  notes: '',
  imageUrl: '',
  weight: null
});

const createDefaultGlazeStageData = (): GlazeStageData => ({
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
