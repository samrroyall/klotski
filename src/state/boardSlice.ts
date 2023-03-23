import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NUM_COLS, NUM_ROWS } from '../constants';
import {
  addBlock as addBlockHelper,
  getMinPos,
  getNewPosFromDir,
  getRandomBoard,
  Grid,
  Move,
  moveBlock as moveBlockHelper,
  Pos,
  PosBlock,
  removeBlock as removeBlockHelper,
} from '../models/global';

// State

interface BoardState {
  blocks: PosBlock[];
  grid: Grid;
}

const initialState: BoardState = {
  blocks: [],
  grid: Array(NUM_ROWS)
    .fill(null)
    .map(() => Array(NUM_COLS).fill(0)),
};

// Actions

const addBlockReducer: CaseReducer<
  BoardState, 
  PayloadAction<PosBlock>
> = (state, {payload: pb}) => (
  addBlockHelper(state, pb)
);

const moveBlockReducer: CaseReducer<
  BoardState, 
  PayloadAction<Move>
> = (state, {payload: {pos, block, dirs}}) => {
  const pb: PosBlock = {block, pos};
  const newPos = dirs.reduce((acc, d) => getNewPosFromDir(acc, d), getMinPos(pb));
  moveBlockHelper(state, pb, newPos);
};

const moveBlockToPosReducer: CaseReducer<
  BoardState,
  PayloadAction<{ pb: PosBlock; newPos: Pos }>
> = (state, {payload: {pb, newPos}}) => (
  moveBlockHelper(state, pb, newPos)
);

const randomizeReducer: CaseReducer<BoardState> = (state) => {
  const {blocks, grid} = getRandomBoard();
  state.blocks = blocks;
  state.grid = grid;
};

const removeBlockReducer: CaseReducer<
  BoardState, 
  PayloadAction<PosBlock>
> = (state, {payload: pb}) => {
  removeBlockHelper(state, pb);
};

const resetReducer: CaseReducer<BoardState> = (state) => {
  const {blocks, grid} = initialState;
  state.blocks = blocks;
  state.grid = grid;
};

// Slice

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addBlock: addBlockReducer,
    moveBlock: moveBlockReducer,
    moveBlockToPos: moveBlockToPosReducer,
    randomize: randomizeReducer,
    removeBlock: removeBlockReducer,
    reset: resetReducer,
  },
});

// Exports

export const { 
  addBlock, 
  moveBlock, 
  moveBlockToPos, 
  randomize, 
  removeBlock, 
  reset,
} = boardSlice.actions;
export default boardSlice.reducer;
