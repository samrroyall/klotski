import {
  DESKTOP_BORDER_SIZE,
  DESKTOP_CELL_SIZE,
  MOBILE_BORDER_SIZE,
  MOBILE_CELL_SIZE,
  NUM_COLS,
  NUM_ROWS,
  TABLET_CELL_SIZE,
  WINNING_COL,
  WINNING_ROW,
} from '../constants';
import { Board as _Board, solveBoard as _solveBoard } from './Solver';
const md5 = require('md5');

// Responsive helpers

export interface Sizes {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  borderSize: string;
  cellSize: string;
  boardHeight: string;
  boardWidth: string;
}

export const getSizes = (isMobile: boolean, isTablet: boolean): Sizes => {
  const borderSize = isMobile ? MOBILE_BORDER_SIZE : DESKTOP_BORDER_SIZE;
  const totalBorderSize = `${2 * borderSize}px`;
  const cellSize = isMobile ? MOBILE_CELL_SIZE : isTablet ? TABLET_CELL_SIZE : DESKTOP_CELL_SIZE;
  const totalCellSize = `(${cellSize} + ${totalBorderSize})`;

  return {
    isMobile,
    isTablet: !isMobile && isTablet,
    isDesktop: !isMobile && !isTablet,
    borderSize: `${borderSize}px`,
    cellSize: `${totalCellSize}`,
    boardHeight: `(${NUM_ROWS} * ${totalCellSize} + ${totalBorderSize})`,
    boardWidth: `(${NUM_COLS} * ${totalCellSize} + ${totalBorderSize})`,
  };
};

// Dir

export enum Dir {
  Left = 'L',
  Right = 'R',
  Up = 'U',
  Down = 'D',
}

export const getOppositeDir = (dir: Dir): Dir => {
  switch (dir) {
    case Dir.Left:
      return Dir.Right;
    case Dir.Right:
      return Dir.Left;
    case Dir.Up:
      return Dir.Down;
    case Dir.Down:
      return Dir.Up;
  }
};

// Pos

export interface Pos {
  row: number;
  col: number;
}

export const getNewPosFromDir = (pos: Pos, dir: Dir): Pos => {
  const { row, col } = pos;
  switch (dir) {
    case Dir.Left:
      return { row, col: col - 1 };
    case Dir.Right:
      return { row, col: col + 1 };
    case Dir.Up:
      return { row: row - 1, col };
    case Dir.Down:
      return { row: row + 1, col };
  }
};

// Block

export interface Block {
  rows: 1 | 2;
  cols: 1 | 2;
}

export type BlockId = 0 | 1 | 2 | 3 | 4;

export const blockToInt = ({ rows, cols }: Block): BlockId => {
  if (rows === 1 && cols === 1) return 1;
  if (rows === 2 && cols === 1) return 2;
  if (rows === 1 && cols === 2) return 3;
  if (rows === 2 && cols === 2) return 4;
  return 0;
};

// PosBlock

export interface PosBlock {
  block: Block;
  pos: Pos;
}

export const getMinPos = ({ pos }: PosBlock): Pos => pos;

export const getMaxPos = ({ block, pos }: PosBlock): Pos => ({
  row: pos.row + block.rows - 1,
  col: pos.col + block.cols - 1,
});

export const posBlocksEqual = (
  { block: b1, pos: p1 }: PosBlock,
  { block: b2, pos: p2 }: PosBlock
) => b1.rows === b2.rows && b1.cols === b2.cols && p1.row === p2.row && p1.col === p2.col;

export const blockIsOutOfBounds = (pb: PosBlock): boolean =>
  [getMinPos(pb), getMaxPos(pb)].some(
    ({ row, col }) => row < 0 || col < 0 || row >= NUM_ROWS || col >= NUM_COLS
  );

// Move

export interface Move {
  block: Block;
  pos: Pos;
  dirs: Dir[];
}

export const getOppositeMove = ({ block, pos, dirs }: Move): Move => ({
  block,
  pos: dirs.reduce((acc, dir) => getNewPosFromDir(acc, dir), pos), // update old pos with old dirs
  dirs: dirs.map((d) => getOppositeDir(d)).reverse(), // get opposite dirs
});

export const movesEqual = (
  { block: b1, pos: p1, dirs: ds1 }: Move,
  { block: b2, pos: p2, dirs: ds2 }: Move
): boolean => {
  if (ds1.length !== ds2.length) {
    return false;
  }
  let ds_equal = true;
  for (let i = 0; i < ds1.length; i++) {
    ds_equal = ds_equal && ds1[i] === ds2[i];
  }
  const [pb1, pb2] = [
    { block: b1, pos: p1 },
    { block: b2, pos: p2 },
  ];
  return ds_equal && posBlocksEqual(pb1, pb2);
};

// Grid

export type Grid = BlockId[][];

export const getEmptyGrid = (): Grid =>
  new Array(NUM_ROWS).fill(null).map(() => new Array(NUM_COLS).fill(0));

export const addBlockToGrid = (grid: Grid, pb: PosBlock): void => {
  const [minPos, maxPos] = [getMinPos(pb), getMaxPos(pb)];
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++) {
      grid[row][col] = blockToInt(pb.block);
    }
  }
};

export const removeBlockFromGrid = (grid: Grid, pb: PosBlock): void => {
  const [minPos, maxPos] = [getMinPos(pb), getMaxPos(pb)];
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++) {
      grid[row][col] = 0;
    }
  }
};

export const blockOverlapsOtherBlock = (grid: Grid, pb: PosBlock): boolean => {
  const [minPos, maxPos] = [getMinPos(pb), getMaxPos(pb)];
  for (let row = minPos.row; row <= maxPos.row; row++) {
    for (let col = minPos.col; col <= maxPos.col; col++) {
      if (grid[row][col]) {
        return true;
      }
    }
  }
  return false;
};

export const getGridHash = (grid: Grid): string =>
  md5(grid.map((row) => row.reduce((acc, cell) => `${acc}${cell}`, '')).join(''));

// Board

export interface Board {
  blocks: PosBlock[];
  grid: BlockId[][];
}

export const addBlock = ({ blocks, grid }: Board, pb: PosBlock): void => {
  if (blockIsOutOfBounds(pb) || blockOverlapsOtherBlock(grid, pb)) {
    throw new Error('Invalid block placement');
  }
  blocks.push(pb);
  addBlockToGrid(grid, pb);
};

export const removeBlock = ({ blocks, grid }: Board, pb1: PosBlock): void => {
  const pbIdx = blocks.findIndex((pb2) => posBlocksEqual(pb1, pb2));
  if (pbIdx === -1) {
    throw new Error('Attempt to remove block that is not in board');
  }
  blocks.splice(pbIdx, 1);
  removeBlockFromGrid(grid, pb1);
};

export const moveBlock = ({ blocks, grid }: Board, pb1: PosBlock, newPos: Pos): void => {
  const pbIdx = blocks.findIndex((pb2) => posBlocksEqual(pb1, pb2));
  if (pbIdx === -1) {
    throw new Error('Attempt to move block that is not in board');
  }
  removeBlockFromGrid(grid, pb1);
  blocks[pbIdx].pos = newPos;
  addBlockToGrid(grid, blocks[pbIdx]);
};

const isMoveAvailable = (grid: Grid, pb: PosBlock, dir: Dir): boolean => {
  const [{ col: minCol, row: minRow }, { col: maxCol, row: maxRow }] = [
    getMinPos(pb),
    getMaxPos(pb),
  ];
  switch (dir) {
    case Dir.Left: {
      if (minCol <= 0) {
        return false;
      }
      for (let row = minRow; row <= maxRow; row++) {
        if (grid[row][minCol - 1]) {
          return false;
        }
      }
      return true;
    }
    case Dir.Right: {
      if (maxCol >= NUM_COLS - 1) {
        return false;
      }
      for (let row = minRow; row <= maxRow; row++) {
        if (grid[row][maxCol + 1]) {
          return false;
        }
      }
      return true;
    }
    case Dir.Up: {
      if (minRow <= 0) {
        return false;
      }
      for (let col = minCol; col <= maxCol; col++) {
        if (grid[minRow - 1][col]) {
          return false;
        }
      }
      return true;
    }
    case Dir.Down: {
      if (maxRow >= NUM_ROWS - 1) {
        return false;
      }
      for (let col = minCol; col <= maxCol; col++) {
        if (grid[maxRow + 1][col]) {
          return false;
        }
      }
      return true;
    }
  }
};

export const hasMove = (moves: Move[], m1: Move): boolean =>
  moves.filter((m2) => movesEqual(m1, m2)).length > 0;

const validMovesForBlock = (grid: Grid, pb: PosBlock): Move[] => {
  const moves: Move[] = [];
  const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
  for (let dir of availableDirs) {
    if (!isMoveAvailable(grid, pb, dir)) {
      continue;
    }
    // handle moves of length 1
    const move = { ...pb, dirs: [dir] };
    if (!hasMove(moves, move)) {
      moves.push(move);
    }
    const newPos = getNewPosFromDir(pb.pos, dir);
    // see if there are any valid moves of length 2 branching from this
    for (let dir2 of availableDirs.filter((d) => d !== getOppositeDir(dir))) {
      const movedPosBlock = { ...pb, pos: newPos };
      if (!isMoveAvailable(grid, movedPosBlock, dir2)) {
        continue;
      }
      const move2 = { ...pb, dirs: [dir, dir2] };
      if (!hasMove(moves, move2)) {
        moves.push(move2);
      }
    }
  }
  return moves;
};

export const allValidMoves = ({ blocks, grid }: Board): Move[] => {
  let moves: Move[] = [];
  for (let pb of blocks) {
    moves = [...moves, ...validMovesForBlock(grid, pb)];
  }
  return moves;
};

export const hasPos = (positions: Pos[], { row: r1, col: c1 }: Pos): boolean =>
  positions.filter(({ row: r2, col: c2 }) => r1 === r2 && c1 === c2).length > 0;

export const availablePositionsForBlock = ({ grid }: Board, pb: PosBlock): Pos[] => {
  const positions: Pos[] = [];
  const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
  for (let dir of availableDirs) {
    if (!isMoveAvailable(grid, pb, dir)) {
      continue;
    }
    // handle moves of length 1
    const newPos = getNewPosFromDir(pb.pos, dir);
    if (!hasPos(positions, newPos)) {
      positions.push(newPos);
    }
    // see if there are any valid moves of length 2 branching from this
    for (let dir2 of availableDirs.filter((d) => d !== getOppositeDir(dir))) {
      const movedPosBlock = { ...pb, pos: newPos };
      if (!isMoveAvailable(grid, movedPosBlock, dir2)) {
        continue;
      }
      const newPos2 = getNewPosFromDir(newPos, dir2);
      if (!hasPos(positions, newPos2)) {
        positions.push(newPos2);
      }
    }
  }
  return positions;
};

export const cellIsFree = (grid: Grid, row: number, col: number): boolean => grid[row][col] === 0;

export const numTwoByTwoBlocks = ({ blocks }: Board): number =>
  blocks.reduce((acc, { block }) => acc + Number(blockToInt(block) === 4), 0);

export const numCellsFilled = ({ blocks }: Board): number =>
  blocks.reduce((acc, { block }) => acc + block.cols * block.rows, 0);

export const boardIsValid = (board: Board): boolean => {
  return numTwoByTwoBlocks(board) === 1 && numCellsFilled(board) === NUM_ROWS * NUM_COLS - 2;
};

export const boardIsSolved = (board: Board): boolean => {
  if (numTwoByTwoBlocks(board) !== 1) {
    throw new Error('Attempt to check solved status of invalid board');
  }
  const { pos } = board.blocks.find(({ block }) => blockToInt(block) === 4)!;
  return pos.row === WINNING_ROW && pos.col === WINNING_COL;
};

// Solve Board Helpers

export const solveBoard = ({ blocks, grid }: Board): Move[] | null => {
  const board = new _Board();
  board.blocks = blocks;
  board.grid = grid;
  return _solveBoard(board);
};

// Random Board Helpers

const getRandomBlock = (numCellsAvailable: number, hasTwoByTwoBlock: boolean): Block => {
  const oneByOne: Block = { rows: 1, cols: 1 };
  const twoByOne: Block = { rows: 2, cols: 1 };
  const oneByTwo: Block = { rows: 1, cols: 2 };
  const twoByTwo: Block = { rows: 2, cols: 2 };
  let availableBlocks: Block[] = [];
  if (numCellsAvailable === 1) {
    availableBlocks = [oneByOne];
  } else if (!hasTwoByTwoBlock) {
    availableBlocks = [twoByTwo];
  } else {
    availableBlocks = [oneByOne, oneByTwo, twoByOne];
  }
  return availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
};

const getRandomOpenCoords = (grid: Grid, hasTwoByTwoBlock: boolean): Pos => {
  // get random row and column
  const getRandomCoords = () => [
    Math.floor(Math.random() * NUM_ROWS),
    Math.floor(Math.random() * NUM_COLS),
  ];
  // validate row and column
  const coordsOpen = (i: number, j: number): boolean =>
    grid[i][j] === 0 && (hasTwoByTwoBlock || i !== WINNING_ROW || j !== WINNING_COL);

  let [i, j] = getRandomCoords();
  while (!coordsOpen(i, j)) {
    [i, j] = getRandomCoords();
  }
  return { row: i, col: j };
};

const getRandomBoardHelper = (): Board => {
  let numCellsAvailable = NUM_ROWS * NUM_COLS - 2;
  let hasTwoByTwoBlock = false;
  const board: Board = {
    blocks: [],
    grid: getEmptyGrid(),
  };

  while (numCellsAvailable > 0) {
    const pb: PosBlock = {
      block: getRandomBlock(numCellsAvailable, hasTwoByTwoBlock),
      pos: getRandomOpenCoords(board.grid, hasTwoByTwoBlock),
    };
    // attempt to add random block at random pos
    try {
      addBlock(board, pb);
    } catch {
      continue;
    }
    // if successful update variables
    const blockArea = pb.block.rows * pb.block.cols;
    hasTwoByTwoBlock ||= blockArea === 4;
    numCellsAvailable -= blockArea;
  }

  return board;
};

export const getRandomBoard = (): Board => {
  const boardIsSolvable = (board: Board): boolean => {
    const moves = solveBoard(board);
    return moves !== null && moves.length > 0;
  };

  let board = getRandomBoardHelper();
  while (!boardIsSolvable(board)) {
    board = getRandomBoardHelper();
  }
  return board;
};
