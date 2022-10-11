import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pos, Block, Move, PosBlock, addBlock } from '../models/global';
import { Board, solveBoard } from '../models/Solver';

// State

export interface ManualMove {
  block: Block;
  oldPos: Pos;
  newPos: Pos;
}

interface ManualSolveState {
  isSolved: boolean;
  moves: ManualMove[];
  moveIdx: number;
  optimalMoves: Move[] | null;
  blockToMove: PosBlock | null;
  availablePositions: Pos[];
}

const initialState: ManualSolveState = {
  isSolved: false,
  moves: [],
  moveIdx: -1,
  optimalMoves: null,
  blockToMove: null,
  availablePositions: [],
};

// Actions

const initReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<PosBlock[]>
> = (state, {payload: blocks}) => {
  const board = new Board();
  blocks.forEach((pb) => addBlock(board, pb));
  state.optimalMoves = solveBoard(board);
  state.moveIdx = state.optimalMoves ? 0 : -1;
  state.isSolved = true;
};

const doMoveReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<{pb: PosBlock; newPos: Pos}>
> = (state, {payload: {pb, newPos}}) => {
  state.moves = [...state.moves, { block: pb.block, oldPos: pb.pos, newPos }];
  state.moveIdx = state.moveIdx + 1;
};

const undoMoveReducer: CaseReducer<ManualSolveState> = (state) => {
  state.moves = state.moves.slice(0, -1);
  state.moveIdx = state.moveIdx - 1;
};

const resetReducer: CaseReducer<ManualSolveState> = (state) => {
  state.isSolved = false;
  state.moves = [];
  state.moveIdx = -1;
  state.optimalMoves = null;
  state.blockToMove = null;
  state.availablePositions = [];
};

const clearAvailablePositionsReducer: CaseReducer<ManualSolveState> = (state) => {
  state.availablePositions = [];
};

const setAvailablePositionsReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<Pos[]>
> = (state, {payload: positions}) => {
  if (state.blockToMove) {
    state.availablePositions = positions;
  }
};

const setBlockToMoveReducer: CaseReducer<ManualSolveState, PayloadAction<PosBlock>> = (
  state,
  {payload: {block, pos}}
) => {
  state.blockToMove = {block, pos};
};

const clearBlockToMoveReducer: CaseReducer<ManualSolveState> = (state) => {
  state.blockToMove = null;
};

// Slice

const manualSolveSlice = createSlice({
  name: 'manualSolve',
  initialState,
  reducers: {
    init: initReducer,
    doMove: doMoveReducer,
    undoMove: undoMoveReducer,
    reset: resetReducer,
    clearBlockToMove: clearBlockToMoveReducer,
    setBlockToMove: setBlockToMoveReducer,
    clearAvailablePositions: clearAvailablePositionsReducer,
    setAvailablePositions: setAvailablePositionsReducer,
  },
});

export const {
  init,
  doMove,
  undoMove,
  reset,
  clearBlockToMove,
  setBlockToMove,
  clearAvailablePositions,
  setAvailablePositions,
} = manualSolveSlice.actions;

export default manualSolveSlice.reducer;
