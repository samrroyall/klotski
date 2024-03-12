import { Block, BoardBlock, Position } from '../../models/api/game';
import { NUM_COLS, NUM_ROWS } from '../../constants';

export interface ChangeBlock {
  newBlock: Block;
  minPosition: Position;
}

const numTwoByTwoBlocks = (grid: (Block | null)[]) =>
  grid.filter((cell) => cell === Block.TwoByTwo).length / 4;

const numCellsFilled = (grid: (Block | null)[]) => grid.filter((cell) => cell !== null).length;

const cellsFree = (grid: (Block | null)[], block: BoardBlock) =>
  NUM_COLS * NUM_ROWS - 2 - (numCellsFilled(grid) - block.rows * block.cols);

const inLastRow = (block: BoardBlock) => block.min_position.row >= NUM_ROWS - 1;
const inLastCol = (block: BoardBlock) => block.min_position.col >= NUM_COLS - 1;

const isCellFilled = (grid: (Block | null)[], i: number, j: number): boolean =>
  grid[i * NUM_COLS + j] !== null;

const leftCellIsFree = (grid: (Block | null)[], block: BoardBlock) =>
  block.min_position.col > 0 &&
  !isCellFilled(grid, block.min_position.row, block.min_position.col - 1);

const rightCellIsFree = (grid: (Block | null)[], block: BoardBlock) =>
  block.cols > 1 ||
  (!inLastCol(block) && !isCellFilled(grid, block.min_position.row, block.min_position.col + 1));

const upCellIsFree = (grid: (Block | null)[], block: BoardBlock) =>
  block.min_position.row > 0 &&
  !isCellFilled(grid, block.min_position.row - 1, block.min_position.col);

const downCellIsFree = (grid: (Block | null)[], block: BoardBlock) =>
  block.rows > 1 ||
  (!inLastRow(block) && !isCellFilled(grid, block.min_position.row + 1, block.min_position.col));

const getChangeBlockWithDifferentMinPosition = (
  grid: (Block | null)[],
  block: BoardBlock,
  nextBlock: Block
): ChangeBlock | null => {
  switch (nextBlock) {
    case Block.TwoByOne:
      if (cellsFree(grid, block) >= 2) {
        if (upCellIsFree(grid, block)) {
          return {
            newBlock: Block.TwoByOne,
            minPosition: { row: block.min_position.row - 1, col: block.min_position.col },
          };
        }
      }
      break;
    case Block.OneByTwo:
      if (cellsFree(grid, block) >= 2) {
        if (leftCellIsFree(grid, block)) {
          return {
            newBlock: Block.OneByTwo,
            minPosition: { row: block.min_position.row, col: block.min_position.col - 1 },
          };
        }
      }
      break;
    case Block.TwoByTwo:
      if (numTwoByTwoBlocks(grid) === 0 && cellsFree(grid, block) >= 4) {
        if (
          rightCellIsFree(grid, block) &&
          upCellIsFree(grid, block) &&
          !isCellFilled(grid, block.min_position.row - 1, block.min_position.col + 1)
        ) {
          return {
            newBlock: Block.TwoByTwo,
            minPosition: {
              row: block.min_position.row - 1,
              col: block.min_position.col,
            },
          };
        }
        if (
          leftCellIsFree(grid, block) &&
          downCellIsFree(grid, block) &&
          !isCellFilled(grid, block.min_position.row + 1, block.min_position.col - 1)
        ) {
          return {
            newBlock: Block.TwoByTwo,
            minPosition: {
              row: block.min_position.row,
              col: block.min_position.col - 1,
            },
          };
        }
        if (
          leftCellIsFree(grid, block) &&
          upCellIsFree(grid, block) &&
          !isCellFilled(grid, block.min_position.row - 1, block.min_position.col - 1)
        ) {
          return {
            newBlock: Block.TwoByTwo,
            minPosition: {
              row: block.min_position.row - 1,
              col: block.min_position.col - 1,
            },
          };
        }
      }
      break;
  }

  return null;
};

const getChangeBlockWithSameMinPosition = (
  grid: (Block | null)[],
  block: BoardBlock,
  nextBlock: Block
): ChangeBlock | null => {
  switch (nextBlock) {
    case Block.OneByOne:
      if (cellsFree(grid, block) >= 1) {
        return { newBlock: Block.OneByOne, minPosition: block.min_position };
      }
      break;
    case Block.TwoByOne:
      if (cellsFree(grid, block) >= 2 && downCellIsFree(grid, block)) {
        return { newBlock: Block.TwoByOne, minPosition: block.min_position };
      }
      break;
    case Block.OneByTwo:
      if (cellsFree(grid, block) >= 2 && rightCellIsFree(grid, block)) {
        return { newBlock: Block.OneByTwo, minPosition: block.min_position };
      }
      break;
    case Block.TwoByTwo:
      if (
        numTwoByTwoBlocks(grid) === 0 &&
        cellsFree(grid, block) >= 4 &&
        rightCellIsFree(grid, block) &&
        downCellIsFree(grid, block) &&
        !isCellFilled(grid, block.min_position.row + 1, block.min_position.col + 1)
      ) {
        return { newBlock: Block.TwoByTwo, minPosition: block.min_position };
      }
      break;
  }

  return null;
};

export const getNextChangeBlock = (
  currentBlock: BoardBlock,
  grid: (Block | null)[]
): ChangeBlock | null => {
  const blocks = [Block.OneByOne, Block.TwoByOne, Block.OneByTwo, Block.TwoByTwo];
  const blockIdx = blocks.indexOf(currentBlock.block);

  for (let i = 0; i < 3; i++) {
    const nextBlock = blocks[(blockIdx + i + 1) % 4];
    let result =
      getChangeBlockWithSameMinPosition(grid, currentBlock, nextBlock) ||
      getChangeBlockWithDifferentMinPosition(grid, currentBlock, nextBlock);
    if (result !== null) {
      return result;
    }
  }

  return null;
};
