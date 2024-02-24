import { NUM_COLS, NUM_ROWS } from '../../constants';
import { BlockId, BoardBlock } from '../../models/api/game';
import { RootState } from '../../state/store';

const getNumCellsFilled = (state: RootState) =>
  state.board.blocks.reduce((acc, { rows, cols }) => acc + rows * cols, 0);

const getNumTwoByTwoBlocks = (state: RootState) =>
  state.board.blocks.filter(({ block_id }) => block_id === 4).length;

const getBlockKey = (block: BoardBlock) => {
  const {
    block_id,
    min_position: { row, col },
  } = block;
  return `${block_id}-${row}-${col}`;
};

const getIsCellFilled = (state: RootState, row: number, col: number) =>
  state.board.filled[row][col];

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

const getNextChangeBlockId = (state: RootState, block: BoardBlock): BlockId | null => {
  const {
    block_id: blockId,
    rows: numRows,
    cols: numCols,
    min_position: { row: minRow, col: minCol },
  } = block;

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

  const blockIds = [1, 2, 3, 4];

  for (let i = 0; i < 3; i++) {
    const nextBlockId = blockIds[(blockId + i) % 4];

    if (nextBlockId === 1 && cellsFree < 1) {
      continue;
    }
    if (nextBlockId === 2 && (cellsFree < 2 || !rightCellIsFree)) {
      continue;
    }
    if (nextBlockId === 3 && (cellsFree < 2 || !bottomCellIsFree)) {
      continue;
    }

    if (
      nextBlockId === 4 &&
      (cellsFree < 4 ||
        getNumTwoByTwoBlocks(state) > 0 ||
        !rightCellIsFree ||
        !bottomCellIsFree ||
        !bottomRightCellIsFree)
    ) {
      continue;
    }

    return nextBlockId as BlockId;
  }

  return null;
};

export const Helpers = {
  getBlockKey,
  getNumCellsFilled,
  getNumTwoByTwoBlocks,
  getIsCellFilled,
  getAvailablePositionsForBlock,
  getNextChangeBlockId,
};
