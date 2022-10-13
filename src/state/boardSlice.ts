import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NUM_COLS, NUM_ROWS } from '../constants';
import {
  addBlock as addBlockHelper,
  Block,
  getMinPos,
  getNewPosFromDir,
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

//  Randomize Helpers

const getRandomAvailableCoords = (grid: Grid): Pos => {
  const getRandomCoords = () => [
    Math.floor(Math.random()*NUM_ROWS),
    Math.floor(Math.random()*NUM_COLS),
  ];
  let [i, j] = getRandomCoords();
  while (grid[i][j] !== 0) {
    [i, j] = getRandomCoords();
  }
  return { row: i, col: j };
};

const getRandomBlock = (
  numCellsAvailable: number, hasTwoByTwoBlock: boolean
): Block => {
  let availableBlocks: Block[] = [
    { rows: 1, cols: 1 },
    { rows: 2, cols: 1 },
    { rows: 1, cols: 2 },
    { rows: 2, cols: 2 },
  ];
  if (numCellsAvailable === 1) {
    availableBlocks = [{ rows: 1, cols: 1 }];
  } else if (!hasTwoByTwoBlock) {
    availableBlocks = [{ rows: 2, cols: 2 }];
  }
  return availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
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
  let numCellsAvailable = NUM_ROWS*NUM_COLS-2;
  let hasTwoByTwoBlock = false;

  while (numCellsAvailable > 0) {
    const randomPosBlock = {
      block: getRandomBlock(numCellsAvailable, hasTwoByTwoBlock),
      pos: getRandomAvailableCoords(state.grid),
    };
    // attempt to add random block at random pos
    try {
      addBlockHelper(state, randomPosBlock);
    } catch {
      continue;
    }
    // if successful update variables
    const blockArea = randomPosBlock.block.rows * randomPosBlock.block.cols;
    numCellsAvailable -= blockArea;
    if (blockArea === 4) {
      hasTwoByTwoBlock = true;
    }
  }
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
