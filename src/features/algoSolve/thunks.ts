import { ApiService } from '../../services/api';
import { updateBoard, updateBoardStatus } from '../board';
import { decrementStep, incrementStep, initAlgoSolve } from '.';
import { Status } from '../../models/ui';
import { BoardState } from '../../models/api/game';
import { createThunk } from '../../store';

const api = new ApiService();

export const solveBoard = createThunk<void, void>('algoSolve/solveBoard', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    thunkAPI.dispatch(updateBoardStatus(Status.AlgoSolving));

    api.solveBoard(boardId).then((response) => {
      if (response && response.type === 'solved') {
        if (response.moves.length === 0) {
          thunkAPI.dispatch(updateBoardStatus(Status.AlreadySolved));
        } else {
          thunkAPI.dispatch(initAlgoSolve(response));
        }
      } else {
        thunkAPI.dispatch(updateBoardStatus(Status.UnableToSolve));
      }
    });
  }
});

export const prevStep = createThunk<void, void>('algoSolve/prevStep', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    api.undoMove(boardId).then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard({ ...response, state: BoardState.Solving }));
        thunkAPI.dispatch(decrementStep());
      }
    });
  }
});

export const nextStep = createThunk<void, void>('algoSolve/nextStep', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const boardId = state.board.id;
  const steps = state.algoSolve.steps;
  const stepIdx = state.algoSolve.stepIdx;
  if (boardId && steps && stepIdx < steps.length - 1) {
    const move = steps[stepIdx + 1];
    api.moveBlock(boardId, move.block_idx, move.row_diff, move.col_diff).then((response) => {
      if (response) {
        thunkAPI.dispatch(updateBoard({ ...response, state: BoardState.Solving }));
        thunkAPI.dispatch(incrementStep());
      }
    });
  }
});
