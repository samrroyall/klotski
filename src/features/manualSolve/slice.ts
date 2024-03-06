import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove, BoardBlock, Position } from '../../models/api/game';
import { Solved as SolvedResponse } from '../../models/api/response';

interface State {
  moves: BlockMove[];
  numOptimalMoves: number | null;
  currentBlock: BoardBlock | null;
  availableMinPositions: Position[];
}

const initialState: State = {
  moves: [],
  numOptimalMoves: null,
  currentBlock: null,
  availableMinPositions: [],
};

const resetReducer: CaseReducer<State> = (state) => {
  state.moves = initialState.moves;
  state.numOptimalMoves = initialState.numOptimalMoves;
  state.currentBlock = initialState.currentBlock;
  state.availableMinPositions = initialState.availableMinPositions;
};

const initReducer: CaseReducer<State, PayloadAction<SolvedResponse>> = (state, { payload }) => {
  state.numOptimalMoves = payload.moves.length;
};

const setAvailableMinPositionsReducer: CaseReducer<State, PayloadAction<Position[]>> = (
  state,
  { payload }
) => {
  if (state.currentBlock) {
    state.availableMinPositions = payload;
  }
};

const setCurrentBlockReducer: CaseReducer<State, PayloadAction<BoardBlock>> = (
  state,
  { payload }
) => {
  state.currentBlock = payload;
};

const setMovesReducer: CaseReducer<State, PayloadAction<BlockMove[]>> = (state, { payload }) => {
  state.moves = payload;
  state.availableMinPositions = initialState.availableMinPositions;
  state.currentBlock = initialState.currentBlock;
};

const resetAvailableMinPositionsReducer: CaseReducer<State> = (state) => {
  state.availableMinPositions = initialState.availableMinPositions;
};

const resetCurrentBlockReducer: CaseReducer<State> = (state) => {
  state.currentBlock = initialState.currentBlock;
};

const manualSolveSlice = createSlice({
  name: 'manualSolve',
  initialState,
  reducers: {
    init: initReducer,
    reset: resetReducer,
    resetAvailableMinPositions: resetAvailableMinPositionsReducer,
    resetCurrentBlock: resetCurrentBlockReducer,
    setAvailableMinPositions: setAvailableMinPositionsReducer,
    setCurrentBlock: setCurrentBlockReducer,
    setMoves: setMovesReducer,
  },
});

export const {
  init,
  reset,
  resetAvailableMinPositions,
  resetCurrentBlock,
  setAvailableMinPositions,
  setCurrentBlock,
  setMoves,
} = manualSolveSlice.actions;

export default manualSolveSlice.reducer;
