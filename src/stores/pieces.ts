import { atom } from 'nanostores'
import { PotteryPiece } from '../types/Piece'
import potteryData from '../../dogfood.json'

// Initialize the store with dogfood data
export const piecesStore = atom<PotteryPiece[]>(potteryData as PotteryPiece[])

// Actions
export const addPiece = (piece: PotteryPiece) => {
  const currentPieces = piecesStore.get()
  piecesStore.set([...currentPieces, piece])
}

export const updatePiece = (id: string, updates: Partial<Omit<PotteryPiece, 'id'>>) => {
  const currentPieces = piecesStore.get()
  const updatedPieces = currentPieces.map(piece =>
    piece.id === id ? { 
      ...piece, 
      ...updates,
      lastUpdated: new Date().toISOString()
    } : piece
  )
  piecesStore.set(updatedPieces)
}

export const removePiece = (id: string) => {
  const currentPieces = piecesStore.get()
  const filteredPieces = currentPieces.filter(piece => piece.id !== id)
  piecesStore.set(filteredPieces)
}

export const getPiecesByStage = (stage: string) => {
  const pieces = piecesStore.get()
  return pieces.filter(piece => piece.stage === stage)
}

export const getPieceById = (id: string) => {
  const pieces = piecesStore.get()
  return pieces.find(piece => piece.id === id)
}