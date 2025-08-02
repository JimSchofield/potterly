import { PotteryPiece } from "../types/Piece";

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