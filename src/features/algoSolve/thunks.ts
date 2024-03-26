import { ApiService } from '../../services/api';
import { updateBoardState } from '../board';
import { decrementStep, incrementStep, initAlgoSolve } from '.';
import { AppState } from '../../models/ui';
import { createThunk } from '../../store';
import { updateBlock } from '../board/slice';

const api = new ApiService();

export const solveBoard = createThunk<void, void>('algoSolve/solveBoard', async (_, thunkAPI) => {
  const boardId = thunkAPI.getState().board.id;
  if (boardId) {
    thunkAPI.dispatch(updateBoardState(AppState.AlgoSolving));

    api.solveBoard(boardId).then((response) => {
      if (response && response.type === 'solved') {
        if (response.moves.length === 0) {
          thunkAPI.dispatch(updateBoardState(AppState.AlreadySolved));
        } else {
          thunkAPI.dispatch(initAlgoSolve(response));
        }
      } else {
        thunkAPI.dispatch(updateBoardState(AppState.UnableToSolve));
      }
    });
  }
});

export const prevStep = createThunk<void, void>('algoSolve/prevStep', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const steps = state.algoSolve.steps;
  const stepIdx = state.algoSolve.stepIdx;

  if (steps && stepIdx >= 0) {
    const move = steps[stepIdx];

    thunkAPI.dispatch(
      updateBlock({
        block_idx: move.block_idx,
        row_diff: -move.row_diff,
        col_diff: -move.col_diff,
      })
    );

    thunkAPI.dispatch(decrementStep());
  }
});

export const nextStep = createThunk<void, void>('algoSolve/nextStep', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const steps = state.algoSolve.steps;
  const stepIdx = state.algoSolve.stepIdx;

  if (steps && stepIdx < steps.length - 1) {
    const move = steps[stepIdx + 1];

    thunkAPI.dispatch(incrementStep());

    thunkAPI.dispatch(updateBlock(move));
  }
});
