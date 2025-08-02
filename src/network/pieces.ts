import { PotteryPiece, StageData, ThrowStageData, GlazeStageData } from "../types/Piece";

export const createPieceAPI = async (piece: PotteryPiece): Promise<PotteryPiece> => {
  const response = await fetch("/api/pieces", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(piece),
  });

  if (!response.ok) {
    throw new Error(`Failed to add piece: ${response.statusText}`);
  }

  return response.json();
};

export const updatePieceAPI = async (id: string, updates: Partial<Omit<PotteryPiece, "id">>): Promise<PotteryPiece> => {
  const response = await fetch(`/api/pieces?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update piece: ${response.statusText}`);
  }

  return response.json();
};

export const deletePieceAPI = async (id: string): Promise<void> => {
  const response = await fetch(`/api/pieces?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete piece: ${response.statusText}`);
  }
};

export const getPieceWithStagesAPI = async (id: string): Promise<PotteryPiece | null> => {
  const response = await fetch(`/api/piece-with-stages?id=${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch piece: ${response.statusText}`);
  }

  return response.json();
};

export const getAllPiecesAPI = async (): Promise<PotteryPiece[]> => {
  const response = await fetch("/api/pieces");

  if (!response.ok) {
    throw new Error(`Failed to fetch pieces: ${response.statusText}`);
  }

  return response.json();
};

export const getUserPiecesAPI = async (userId: string): Promise<PotteryPiece[]> => {
  const response = await fetch(`/api/user-pieces?userId=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user pieces: ${response.statusText}`);
  }

  return response.json();
};

export const updateStageDetailAPI = async (
  pieceId: string, 
  stage: string, 
  stageData: StageData | ThrowStageData | GlazeStageData
): Promise<void> => {
  // First get the stage detail ID
  const getResponse = await fetch(`/api/stage-details?pieceId=${pieceId}&stage=${stage}`);
  
  if (!getResponse.ok) {
    throw new Error(`Failed to get stage detail: ${getResponse.statusText}`);
  }
  
  const existingStageDetail = await getResponse.json();
  
  if (!existingStageDetail || !existingStageDetail.id) {
    throw new Error("Stage detail not found");
  }
  
  // Update the stage detail
  const updateResponse = await fetch(`/api/stage-details?id=${existingStageDetail.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stageData),
  });

  if (!updateResponse.ok) {
    throw new Error(`Failed to update stage detail: ${updateResponse.statusText}`);
  }
};