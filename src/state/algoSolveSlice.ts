import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addBlock, Move, PosBlock } from '../models/global';
import { Board, solveBoard } from '../models/Solver';

// State

interface AlgoSolveState {
  isSolved: boolean;
  steps: Move[] | null;
  stepIdx: number;
}

const initialState: AlgoSolveState = {
  isSolved: false,
  steps: null,
  stepIdx: -1,
};

// Actions

const initReducer: CaseReducer<
  AlgoSolveState,
  PayloadAction<PosBlock[]>
> = (state, {payload: blocks}) => {
  const board = new Board();
  blocks.forEach((pb) => addBlock(board, pb))
  state.steps = solveBoard(board);
  state.stepIdx = state.steps ? state.steps.length - 1 : -1;
  state.isSolved = true;
};

const decrementStepReducer: CaseReducer<AlgoSolveState> = (state) => {
  state.stepIdx -= 1;
};

const incrementStepReducer: CaseReducer<AlgoSolveState> = (state) => {
  state.stepIdx += 1;
}

// Slice

const algoSolveSlice = createSlice({
  name: 'algoSolve',
  initialState,
  reducers: {
    init: initReducer,
    decrementStepIdx: decrementStepReducer,
    incrementStepIdx: incrementStepReducer,
  },
});

export const { init, decrementStepIdx, incrementStepIdx } = algoSolveSlice.actions;

export default algoSolveSlice.reducer;
