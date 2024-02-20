import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove, BoardBlock, Move, Position } from '../models/api/game';

interface ManualSolveState {
  moves: BlockMove[];
  optimalMoves: BlockMove[] | null;
  nextMoves: Move[][];
  currentBlock: BoardBlock | null;
  availableMinPositions: Position[];
}

const initialState: ManualSolveState = {
  moves: [],
  optimalMoves: null,
  nextMoves: [],
  currentBlock: null,
  availableMinPositions: [],
};

const initReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<{
    nextMoves: Move[][];
    optimalMoves: BlockMove[];
  }>
> = (state, { payload: { nextMoves, optimalMoves } }) => {
  state.nextMoves = nextMoves;
  state.optimalMoves = optimalMoves;
};

const updateMovesReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<{
    moves: BlockMove[];
    nextMoves: Move[][];
  }>
> = (state, { payload: { moves, nextMoves } }) => {
  state.moves = moves;
  state.nextMoves = nextMoves;
  state.availableMinPositions = initialState.availableMinPositions;
  state.currentBlock = initialState.currentBlock;
};

const setAvailableMinPositionsReducer: CaseReducer<ManualSolveState, PayloadAction<Position[]>> = (
  state,
  { payload }
) => {
  if (state.currentBlock) {
    state.availableMinPositions = payload;
  }
};

const setCurrentBlockReducer: CaseReducer<ManualSolveState, PayloadAction<BoardBlock>> = (
  state,
  { payload }
) => {
  state.currentBlock = payload;
};

const manualSolveSlice = createSlice({
  name: 'manualSolve',
  initialState,
  reducers: {
    init: initReducer,
    updateMoves: updateMovesReducer,
    reset: (state) => {
      state = initialState;
    },
    resetAvailableMinPositions: (state) => {
      state.availableMinPositions = initialState.availableMinPositions;
    },
    resetCurrentBlock: (state) => {
      state.currentBlock = initialState.currentBlock;
    },
    setAvailableMinPositions: setAvailableMinPositionsReducer,
    setCurrentBlock: setCurrentBlockReducer,
  },
});

export const {
  init,
  updateMoves,
  reset,
  resetAvailableMinPositions,
  resetCurrentBlock,
  setAvailableMinPositions,
  setCurrentBlock,
} = manualSolveSlice.actions;

export default manualSolveSlice.reducer;
