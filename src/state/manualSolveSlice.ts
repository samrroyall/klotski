import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockMove, Move } from '../models/api/game';
import { Board as BoardResponse, Solve as SolveResponse } from '../models/api/response';

interface ManualSolveState {
  isSolved: boolean;
  moves: BlockMove[];
  //moveIdx: number;
  optimalMoves: BlockMove[] | null;
  nextMoves: Move[][];
}

const initialState: ManualSolveState = {
  isSolved: false,
  moves: [],
  //moveIdx: -1,
  optimalMoves: null,
  nextMoves: [],
};

const initReducer: CaseReducer<ManualSolveState, PayloadAction<{ 
  nextMoves: Move[][],
  optimalMoves: BlockMove[],
}>> = (
  state,
  { payload: { nextMoves, optimalMoves } }
) => {
  state.isSolved = optimalMoves.length === 0;
  state.nextMoves = nextMoves;
  state.optimalMoves = optimalMoves;
};

const updateMovesReducer: CaseReducer<ManualSolveState, PayloadAction<{
  moves: BlockMove[],
  nextMoves: Move[][],
}>> = (
  state,
  { payload: {moves, nextMoves} }
) => {
  state.moves = moves;
  state.nextMoves = nextMoves;
};

const manualSolveSlice = createSlice({
  name: 'manualSolve',
  initialState,
  reducers: {
    init: initReducer,
    updateMoves: updateMovesReducer,
    reset: (state) => { state = initialState; },
  },
});

export const {init, updateMoves, reset } = manualSolveSlice.actions;

export default manualSolveSlice.reducer;
