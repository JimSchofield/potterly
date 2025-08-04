import { PotteryPiece, StageData, ThrowStageData, GlazeStageData } from "../types/Piece";
import { 
  createPieceAPI, 
  updatePieceAPI, 
  deletePieceAPI, 
  getPieceWithStagesAPI, 
  getUserPiecesAPI,
  updateStageDetailAPI 
} from "../network/pieces";

/**
 * Utility functions for piece operations without relying on a global store
 */

export const createPiece = async (piece: PotteryPiece): Promise<PotteryPiece> => {
  try {
    const savedPiece = await createPieceAPI(piece);
    return savedPiece;
  } catch (error) {
    console.error("Error creating piece:", error);
    throw error;
  }
};

export const updatePiece = async (
  id: string,
  updates: Partial<Omit<PotteryPiece, "id">>,
): Promise<PotteryPiece> => {
  try {
    const updatedPiece = await updatePieceAPI(id, {
      ...updates,
      lastUpdated: new Date().toISOString(),
    });
    return updatedPiece;
  } catch (error) {
    console.error("Error updating piece:", error);
    throw error;
  }
};

export const updateStageDetail = async (
  pieceId: string,
  stage: string,
  stageData: StageData | ThrowStageData | GlazeStageData
): Promise<void> => {
  try {
    await updateStageDetailAPI(pieceId, stage, stageData);
  } catch (error) {
    console.error("Error updating stage detail:", error);
    throw error;
  }
};

export const deletePiece = async (id: string): Promise<void> => {
  try {
    await deletePieceAPI(id);
  } catch (error) {
    console.error("Error deleting piece:", error);
    throw error;
  }
};

export const archivePiece = async (id: string): Promise<PotteryPiece> => {
  try {
    return await updatePiece(id, { archived: true });
  } catch (error) {
    console.error("Error archiving piece:", error);
    throw error;
  }
};

export const unarchivePiece = async (id: string): Promise<PotteryPiece> => {
  try {
    return await updatePiece(id, { archived: false });
  } catch (error) {
    console.error("Error unarchiving piece:", error);
    throw error;
  }
};

export const starPiece = async (id: string): Promise<PotteryPiece> => {
  try {
    return await updatePiece(id, { starred: true });
  } catch (error) {
    console.error("Error starring piece:", error);
    throw error;
  }
};

export const unstarPiece = async (id: string): Promise<PotteryPiece> => {
  try {
    return await updatePiece(id, { starred: false });
  } catch (error) {
    console.error("Error unstarring piece:", error);
    throw error;
  }
};

export const getPieceById = async (id: string): Promise<PotteryPiece | null> => {
  try {
    return await getPieceWithStagesAPI(id);
  } catch (error) {
    console.error("Error fetching piece:", error);
    return null;
  }
};

export const getUserPieces = async (userId: string): Promise<PotteryPiece[]> => {
  try {
    return await getUserPiecesAPI(userId);
  } catch (error) {
    console.error("Error loading user pieces:", error);
    return [];
  }
};