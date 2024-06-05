import { BlockMove, BoardBlock, Position } from '../../models/api/game';
import { RootState } from '../../store';

export const selectMoves = (state: RootState): BlockMove[] => state.manualSolve.moves;

export const selectNumMoves = (state: RootState): number => state.manualSolve.moves.length;

export const selectMovesOverOptimal = (state: RootState): number | null =>
  state.manualSolve.numOptimalMoves
    ? state.manualSolve.moves.length - state.manualSolve.numOptimalMoves
    : null;

export const selectNumOptimalMoves = (state: RootState): number | null =>
  state.manualSolve.numOptimalMoves;

export const selectCurrentBlock = (state: RootState): BoardBlock | null =>
  state.manualSolve.currentBlock;

export const selectCurrentBlockMinPosition = (state: RootState): Position | null =>
  state.manualSolve.currentBlock?.min_position || null;

export const selectAvailableMinPositions = (state: RootState): Position[] =>
  state.manualSolve.availableMinPositions;
