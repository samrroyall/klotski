import {
  init,
  reset,
  resetAvailableMinPositions,
  resetCurrentBlock,
  setAvailableMinPositions,
  setCurrentBlock,
  setMoves,
} from './slice';
import {
  selectMoves,
  selectNumMoves,
  selectNumOptimalMoves,
  selectCurrentBlock,
  selectAvailableMinPositions,
} from './selectors';
import { solveBoard, moveBlock, undoMove } from './thunks';

export {
  init as initManualSolve,
  reset as resetManualSolve,
  resetAvailableMinPositions,
  resetCurrentBlock,
  setAvailableMinPositions,
  setCurrentBlock,
  setMoves,
  solveBoard as manualSolveBoard,
  moveBlock,
  undoMove,
  selectMoves,
  selectNumMoves,
  selectNumOptimalMoves,
  selectCurrentBlock,
  selectAvailableMinPositions,
};
