import { BlockMove } from '../../models/api/game';
import { updateBoard, updateBoardState } from '../board';
import { ApiService } from '../../services/api';
import { AppState } from '../../models/ui';
import { initManualSolve, setMoves } from '.';
import { selectBoardIsSolved } from '../board/selectors';
import { createThunk } from '../../store';
import { selectMovesOverOptimal } from './selectors';

const api = new ApiService();

export const solveBoard = createThunk<void, void>('manualSolve/solveBoard', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    thunkAPI.dispatch(updateBoardState(AppState.ManualSolving));

    api.solveBoard(boardId).then((response) => {
      if (response && response.type === 'solved') {
        if (response.moves.length === 0) {
          thunkAPI.dispatch(updateBoardState(AppState.AlreadySolved));
        } else {
          thunkAPI.dispatch(initManualSolve(response));
        }
      } else {
        thunkAPI.dispatch(updateBoardState(AppState.UnableToSolve));
      }
    });
  }
});

export const moveBlock = createThunk<BlockMove, void>(
  'manualSolve/moveBlock',
  async (move, thunkAPI) => {
    const state = thunkAPI.getState();
    const boardId = state.board.id;
    const currentBlock = state.manualSolve.currentBlock;
    const moves = state.manualSolve.moves;

    if (boardId && currentBlock) {
      api.moveBlock(boardId, currentBlock.idx, move.row_diff, move.col_diff).then((response) => {
        if (response) {
          thunkAPI.dispatch(updateBoard(response));
          thunkAPI.dispatch(setMoves([...moves, move]));

          const state = thunkAPI.getState();
          const boardIsSolved = selectBoardIsSolved(state);
          const movesOverOptimal = selectMovesOverOptimal(state);

          if (boardIsSolved) {
            if (movesOverOptimal === 0) {
              thunkAPI.dispatch(updateBoardState(AppState.SolvedOptimally));
            } else {
              thunkAPI.dispatch(updateBoardState(AppState.Solved));
            }
          }
        }
      });
    }
  }
);

export const undoMove = createThunk<void, void>('manualSolve/undoMove', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const boardId = state.board.id;
  const boardState = state.board.state;
  const moves = state.manualSolve.moves;

  if (boardId) {
    api.undoMove(boardId).then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard(response));
        if (boardState === AppState.ManualSolving) {
          thunkAPI.dispatch(setMoves(moves.slice(0, -1)));
        }
      }
    });
  }
});
