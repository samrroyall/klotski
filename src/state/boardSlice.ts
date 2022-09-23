import { CaseReducer, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { NUM_COLS, NUM_ROWS, WINNING_COL, WINNING_ROW } from '../constants';
import { Board } from '../models/Board';
import {
  blockToInt,
  Dir,
  getNewPosFromDir,
  Grid,
  getOppositeDir,
  Pos,
  posBlocksEqual,
  UIBlock,
  UIMove,
  UIPosBlock,
} from '../models/global';

// State

interface BoardState {
  blocks: UIPosBlock[];
  grid: Grid;
}

const initialState: BoardState = {
  blocks: [],
  grid: Array(Board.rows)
    .fill(null)
    .map(() => Array(Board.cols).fill(0)),
};

// Add/Move Block helpers

export const getMinPos = ({ pos }: Draft<UIPosBlock>): Pos => pos;

export const getMaxPos = ({ block, pos }: Draft<UIPosBlock>): Pos => ({
  row: pos.row + block.rows - 1,
  col: pos.col + block.cols - 1,
});

const isOutOfBounds = (pb: Draft<UIPosBlock>): boolean =>
  [getMinPos(pb), getMaxPos(pb)].some(
    (pos) => pos.row < 0 || pos.col < 0 || pos.row >= Board.rows || pos.col >= Board.cols
  );

const doesOverlapOtherBlock = (state: Draft<BoardState>, pb: Draft<UIPosBlock>): boolean => {
  const minPos = getMinPos(pb);
  const maxPos = getMaxPos(pb);
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++) if (state.grid[row][col]) return true;
  }
  return false;
};

const addBlockToGrid = (state: Draft<BoardState>, pb: Draft<UIPosBlock>) => {
  const minPos = getMinPos(pb);
  const maxPos = getMaxPos(pb);
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++)
      state.grid[row][col] = blockToInt(pb.block);
  }
};

const removeBlockFromGrid = (state: Draft<BoardState>, pb: Draft<UIPosBlock>) => {
  const minPos = getMinPos(pb);
  const maxPos = getMaxPos(pb);
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++) state.grid[row][col] = 0;
  }
};

const addBlockHelper = (state: Draft<BoardState>, pb: Draft<UIPosBlock>) => {
  if (isOutOfBounds(pb) || doesOverlapOtherBlock(state, pb))
    throw new Error('Invalid block placement');

  state.blocks = [...state.blocks, pb];
  addBlockToGrid(state, pb);
};

const moveBlockHelper = (state: Draft<BoardState>, pb: Draft<UIPosBlock>, newPos: Draft<Pos>) => {
  removeBlockFromGrid(state, pb);
  pb.pos = newPos;
  addBlockToGrid(state, pb);
};

//  Randomize Helpers

const getRandomAvailableCoords = (grid: Grid): Pos => {
  const getRandomCoords = () => [
    Math.floor(Math.random() * Board.rows),
    Math.floor(Math.random() * Board.cols),
  ];

  let [i, j] = getRandomCoords();
  while (grid[i][j] !== 0) {
    [i, j] = getRandomCoords();
  }

  return { row: i, col: j };
};

const getRandomBlock = (numCellsAvailable: number, hasTwoByTwoBlock: boolean): UIBlock => {
  const ONE_BY_ONE: UIBlock = { rows: 1, cols: 1 };
  const TWO_BY_ONE: UIBlock = { rows: 2, cols: 1 };
  const ONE_BY_TWO: UIBlock = { rows: 1, cols: 2 };
  const TWO_BY_TWO: UIBlock = { rows: 2, cols: 2 };

  let availableBlocks: UIBlock[] = [];
  if (!hasTwoByTwoBlock) availableBlocks = [TWO_BY_TWO];
  else if (numCellsAvailable === 1) availableBlocks = [ONE_BY_ONE];
  else availableBlocks = [ONE_BY_ONE, ONE_BY_TWO, TWO_BY_ONE];

  return availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
};

// Actions

const addBlockReducer: CaseReducer<BoardState, PayloadAction<UIPosBlock>> = (
  state,
  { payload: pb }
) => {
  addBlockHelper(state, pb);
};

const moveBlockReducer: CaseReducer<BoardState, PayloadAction<{ move: UIMove }>> = (
  state,
  { payload: { move } }
) => {
  const { pos, block, dirs } = move;
  const pb = state.blocks.find((_pb) => posBlocksEqual(_pb, { pos, block }));
  if (!pb) throw Error('An attempt was made to move a block that does not exist on the board.');

  const newPos = dirs.reduce((acc, d) => getNewPosFromDir(acc, d), getMinPos(pb));
  moveBlockHelper(state, pb, newPos);
};

const moveBlockToPosReducer: CaseReducer<
  BoardState,
  PayloadAction<{ pb: UIPosBlock; newPos: Pos }>
> = (state, { payload: { pb, newPos } }) => {
  const newPb = state.blocks.find((_pb) => posBlocksEqual(_pb, pb));
  if (!newPb) throw Error('An attempt was made to move a block that does not exist on the board.');

  moveBlockHelper(state, newPb, newPos);
};

const randomizeReducer: CaseReducer<BoardState> = (state) => {
  let numCellsAvailable = NUM_ROWS * NUM_COLS - 2;
  let hasTwoByTwoBlock = false;

  while (numCellsAvailable > 0) {
    const randomPosBlock = {
      block: getRandomBlock(numCellsAvailable, hasTwoByTwoBlock),
      pos: getRandomAvailableCoords(state.grid),
    };

    try {
      addBlockHelper(state, randomPosBlock);
    } catch {
      continue;
    }

    const blockArea = randomPosBlock.block.rows * randomPosBlock.block.cols;
    if (blockArea === 4) hasTwoByTwoBlock = true;
    numCellsAvailable -= blockArea;
  }
};

const resetReducer: CaseReducer<BoardState> = (state) => {
  state.blocks = [];
  state.grid = Array(Board.rows)
    .fill(null)
    .map(() => Array(Board.cols).fill(0));
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
    reset: resetReducer,
  },
});

// Selectors

const isMoveAvailable = (state: RootState, pb: UIPosBlock, dir: Dir): boolean => {
  const minPos = getMinPos(pb);
  const maxPos = getMaxPos(pb);

  switch (dir) {
    case Dir.Left: {
      const col = minPos.col - 1;
      if (col < 0) return false;

      for (let row = minPos.row; row <= maxPos.row; row++)
        if (state.board.grid[row][col]) return false;
      return true;
    }
    case Dir.Right: {
      const col = maxPos.col + 1;
      if (col >= Board.cols) return false;

      for (let row = minPos.row; row <= maxPos.row; row++)
        if (state.board.grid[row][col]) return false;
      return true;
    }
    case Dir.Up: {
      const row = minPos.row - 1;
      if (row < 0) return false;

      for (let col = minPos.col; col <= maxPos.col; col++)
        if (state.board.grid[row][col]) return false;
      return true;
    }
    case Dir.Down: {
      const row = maxPos.row + 1;
      if (row >= Board.rows) return false;

      for (let col = minPos.col; col <= maxPos.col; col++)
        if (state.board.grid[row][col]) return false;
      return true;
    }
  }
};

export const selectAvailablePositions = (state: RootState, pb: UIPosBlock): Pos[] => {
  const positions: Pos[] = [];

  const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
  for (let dir of availableDirs) {
    if (isMoveAvailable(state, pb, dir)) {
      // create temporary moved block and push its position
      const newPos = getNewPosFromDir(pb.pos, dir);
      positions.push(newPos);
      for (let dir2 of availableDirs.filter((dir) => dir !== getOppositeDir(dir))) {
        const movedPosBlock = { block: pb.block, pos: newPos };
        if (isMoveAvailable(state, movedPosBlock, dir2))
          positions.push(getNewPosFromDir(newPos, dir2));
      }
    }
  }

  return positions;
};

export const selectNumCellsFilled = (state: RootState): number =>
  state.board.blocks.reduce((acc, pb) => acc + pb.block.rows * pb.block.cols, 0);

export const selectNumTwoByTwoBlocks = (state: RootState): number =>
  state.board.blocks.reduce((acc, pb) => acc + Number(blockToInt(pb.block) === 4), 0);

export const selectBoardIsValid = (state: RootState): boolean =>
  selectNumCellsFilled(state) === Board.rows * Board.cols - 2 &&
  selectNumTwoByTwoBlocks(state) === 1;

export const selectBoardIsSolved = (state: RootState): boolean => {
  const twoByTwoBlockPos = state.board.blocks.find((pb) => blockToInt(pb.block) === 4)?.pos;

  return twoByTwoBlockPos?.row === WINNING_ROW && twoByTwoBlockPos?.col === WINNING_COL;
};

// Exports

export const { addBlock, moveBlock, moveBlockToPos, randomize, reset } = boardSlice.actions;
export default boardSlice.reducer;
