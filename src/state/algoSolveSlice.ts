import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove } from '../models/api/game';

interface AlgoSolveState {
  isSolved: boolean;
  steps: BlockMove[] | null;
  stepIdx: number;
}

const initialState: AlgoSolveState = {
  isSolved: false,
  steps: null,
  stepIdx: -1,
};

const initReducer: CaseReducer<AlgoSolveState, PayloadAction<BlockMove[] | null>> = (
  state,
  { payload: steps }
) => {
  state.steps = steps;
  state.stepIdx = state.steps !== null ? state.steps.length - 1 : -1;
  state.isSolved = true;
};

const algoSolveSlice = createSlice({
  name: 'algoSolve',
  initialState,
  reducers: {
    init: initReducer,
    decrementStepIdx: (state) => { state.stepIdx--; },
    incrementStepIdx: (state) => { state.stepIdx++; },
  },
});

export const { init, decrementStepIdx, incrementStepIdx } = algoSolveSlice.actions;

export default algoSolveSlice.reducer;
