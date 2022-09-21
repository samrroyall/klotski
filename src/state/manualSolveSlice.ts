import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Block } from '../models/Block';
import { Board } from '../models/Board';
import { PositionedBlock } from '../models/PositionedBlock';
import { Grid, Pos, UIBlock, UIMove, UIPosBlock } from '../models/global';
import { solveBoard } from '../models/Solver';

// State

export interface ManualMove {
  block: UIBlock;
  oldPos: Pos;
  newPos: Pos;
}

interface ManualSolveState {
  isSolved: boolean;
  moves: ManualMove[];
  moveIdx: number;
  optimalMoves: UIMove[] | null;
  blockToMove: UIPosBlock | null;
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
  PayloadAction<{ blocks: UIPosBlock[]; grid: Grid }>
> = (state, { payload: { blocks, grid } }) => {
  const board = new Board();
  board.setBlocks(
    blocks.map((pb) => new PositionedBlock(new Block(pb.block.rows, pb.block.cols), pb.pos))
  );
  board.setGrid(grid);

  state.optimalMoves =
    solveBoard(board)?.map(({ block, pos, dirs }) => ({
      block: { rows: block.rows, cols: block.cols },
      pos,
      dirs,
    })) || null;
  state.moveIdx = state.optimalMoves ? 0 : -1;
  state.isSolved = true;
};

const doMoveReducer: CaseReducer<
  ManualSolveState,
  PayloadAction<{ pb: UIPosBlock; newPos: Pos }>
> = (state, { payload: { pb, newPos } }) => {
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
  PayloadAction<{ positions: Pos[] }>
> = (state, { payload: { positions } }) => {
  if (state.blockToMove) {
    state.availablePositions = positions;
  }
};

const setBlockToMoveReducer: CaseReducer<ManualSolveState, PayloadAction<UIPosBlock>> = (
  state,
  { payload: { block, pos } }
) => {
  state.blockToMove = { block, pos };
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
