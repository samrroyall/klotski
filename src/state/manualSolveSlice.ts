import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove, BoardBlock, Position } from '../models/api/game';
import { ParsedSolved as ParsedSolvedResponse } from '../models/api/response';

interface ManualSolveState {
  moves: BlockMove[];
  numOptimalMoves: number | null;
  currentBlock: BoardBlock | null;
  availableMinPositions: Position[];
}

const initialState: ManualSolveState = {
  moves: [],
  numOptimalMoves: null,
  currentBlock: null,
  availableMinPositions: [],
};

const resetReducer: CaseReducer<ManualSolveState> = (state) => {
  state.moves = initialState.moves;
  state.numOptimalMoves = initialState.numOptimalMoves;
  state.currentBlock = initialState.currentBlock;
  state.availableMinPositions = initialState.availableMinPositions;
};

const initReducer: CaseReducer<ManualSolveState, PayloadAction<ParsedSolvedResponse>> = (
  state,
  { payload }
) => {
  state.numOptimalMoves = payload.moves.length;
};

const updateMovesReducer: CaseReducer<ManualSolveState, PayloadAction<BlockMove[]>> = (
  state,
  { payload }
) => {
  state.moves = payload;
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

const resetAvailableMinPositionsReducer: CaseReducer<ManualSolveState> = (state) => {
  state.availableMinPositions = initialState.availableMinPositions;
};

const setCurrentBlockReducer: CaseReducer<ManualSolveState, PayloadAction<BoardBlock>> = (
  state,
  { payload }
) => {
  state.currentBlock = payload;
};

const resetCurrentBlockReducer: CaseReducer<ManualSolveState> = (state) => {
  state.currentBlock = initialState.currentBlock;
};

const manualSolveSlice = createSlice({
  name: 'manualSolve',
  initialState,
  reducers: {
    init: initReducer,
    updateMoves: updateMovesReducer,
    reset: resetReducer,
    resetAvailableMinPositions: resetAvailableMinPositionsReducer,
    resetCurrentBlock: resetCurrentBlockReducer,
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
