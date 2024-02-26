import { NUM_COLS, NUM_ROWS } from '../../constants';
import { Block, BoardBlock, getBlockCols, getBlockRows } from '../../models/api/game';
import { RootState } from '../../state/store';

const getNumCellsFilled = (state: RootState) =>
  state.board.blocks.reduce((acc, { rows, cols }) => acc + rows * cols, 0);

const getNumTwoByTwoBlocks = (state: RootState) =>
  state.board.blocks.filter(({ block }) => block === Block.TwoByTwo).length;

const getBlockKey = (boardBlock: BoardBlock) => {
  const {
    block,
    min_position: { row, col },
  } = boardBlock;

  return `${getBlockRows(block)}x${getBlockCols(block)}-${row}-${col}`;
};

const getIsCellFilled = (state: RootState, row: number, col: number) =>
  state.board.grid[row * NUM_COLS + col];

const getAvailablePositionsForBlock = (state: RootState, block: BoardBlock) => {
  const {
    min_position: { row: minRow, col: minCol },
    idx,
  } = block;

  const moves = state.board.nextMoves;

  return idx < moves.length - 1
    ? state.board.nextMoves[idx].map(({ row_diff, col_diff }) => ({
        row: minRow + row_diff,
        col: minCol + col_diff,
      }))
    : [];
};

const getNextChangeBlock = (state: RootState, boardBlock: BoardBlock): Block | null => {
  const {
    block,
    rows: numRows,
    cols: numCols,
    min_position: { row: minRow, col: minCol },
  } = boardBlock;

  const inLastRow = minRow >= NUM_ROWS - 1;
  const inLastCol = minCol >= NUM_COLS - 1;

  const blockSize = numRows * numCols;
  const cellsFree = NUM_COLS * NUM_ROWS - 2 - (getNumCellsFilled(state) - blockSize);

  const rightCellIsFree =
    numCols > 1 || (!inLastCol && !getIsCellFilled(state, minRow, minCol + 1));
  const bottomCellIsFree =
    numRows > 1 || (!inLastRow && !getIsCellFilled(state, minRow + 1, minCol));
  const bottomRightCellIsFree =
    (numRows > 1 && numCols > 1) ||
    (!inLastRow && !inLastCol && !getIsCellFilled(state, minRow + 1, minCol + 1));

  const blocks = [Block.OneByOne, Block.OneByTwo, Block.TwoByOne, Block.TwoByTwo];
  const blockIdx = blocks.indexOf(block);

  for (let i = 0; i < 3; i++) {
    const nextBlock = blocks[(blockIdx + i + 1) % 4];

    switch (nextBlock) {
      case Block.OneByOne:
        if (cellsFree < 1) {
          return null;
        }
        break;
      case Block.OneByTwo:
        if (cellsFree < 2 || !rightCellIsFree) {
          continue;
        }
        break;
      case Block.TwoByOne:
        if (cellsFree < 2 || !bottomCellIsFree) {
          continue;
        }
        break;
      case Block.TwoByTwo:
        if (
          getNumTwoByTwoBlocks(state) > 0 ||
          cellsFree < 4 ||
          !rightCellIsFree ||
          !bottomCellIsFree ||
          !bottomRightCellIsFree
        ) {
          continue;
        }
        break;
    }

    return nextBlock;
  }

  return null;
};

export const Helpers = {
  getBlockKey,
  getNumCellsFilled,
  getNumTwoByTwoBlocks,
  getIsCellFilled,
  getAvailablePositionsForBlock,
  getNextChangeBlock,
};
