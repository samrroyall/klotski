import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove } from '../../models/api/game';
import { Solved as SolvedResponse } from '../../models/api/response';

interface State {
  isSolved: boolean;
  steps: BlockMove[] | null;
  stepIdx: number;
}

const initialState: State = {
  isSolved: false,
  steps: null,
  stepIdx: -1,
};

const resetReducer: CaseReducer<State> = (state) => {
  state.isSolved = initialState.isSolved;
  state.steps = initialState.steps;
  state.stepIdx = initialState.stepIdx;
};

const initReducer: CaseReducer<State, PayloadAction<SolvedResponse>> = (state, { payload }) => {
  state.steps = payload.moves || [];
  state.isSolved = false;
};

const decrementStepReducer: CaseReducer<State> = (state) => {
  state.stepIdx = state.stepIdx - 1;
  state.isSolved ||= false;
};

const incrementStepReducer: CaseReducer<State> = (state) => {
  state.stepIdx = state.stepIdx + 1;
  state.isSolved = state.steps !== null && state.stepIdx === state.steps.length - 1;
};

const algoSolveSlice = createSlice({
  name: 'algoSolve',
  initialState,
  reducers: {
    reset: resetReducer,
    init: initReducer,
    decrementStep: decrementStepReducer,
    incrementStep: incrementStepReducer,
  },
});

export const { reset, init, decrementStep, incrementStep } = algoSolveSlice.actions;

export default algoSolveSlice.reducer;
