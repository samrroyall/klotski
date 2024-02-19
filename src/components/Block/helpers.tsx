import { NUM_COLS, NUM_ROWS } from '../../constants';
import { BlockId, BlockWithDimensions } from '../../models/api/game';
import { RootState } from '../../state/store';

const getStatus = (state: RootState) => state.board.status;

const getBlockKey = (block: BlockWithDimensions) => {
  const {
    block_id,
    min_position: { row, col },
  } = block;
  return `${block_id}-${row}-${col}`;
};

const getBoardId = (state: RootState) => state.board.id;

const getNumCellsFilled = (state: RootState) =>
  state.board.blocks.reduce((acc, { rows, cols }) => acc + rows * cols, 0);

const getNumTwoByTwoBlocks = (state: RootState) =>
  state.board.blocks.filter(({ block_id }) => block_id === 4).length;

const getIsCellFilled = (state: RootState, row: number, col: number) =>
  state.board.filled[row][col];

const getAvailablePositions = (state: RootState, block: BlockWithDimensions, idx: number) => {
  const {
    min_position: { row: minRow, col: minCol },
  } = block;
  return state.manualSolve.nextMoves[idx].map(({ row_diff, col_diff }) => ({
    row: minRow + row_diff,
    col: minCol + col_diff,
  }));
};

const getNextChangeBlockId = (state: RootState, block: BlockWithDimensions): BlockId | null => {
  const {
    block_id: blockId,
    rows: numRows,
    cols: numCols,
    min_position: { row: minRow, col: minCol },
  } = block;

  const inLastRow = minRow + numRows >= NUM_ROWS;
  const inLastCol = minCol + numCols >= NUM_COLS;

  const cellsFree = NUM_COLS * NUM_ROWS - 2 - getNumCellsFilled(state);
  const rightCellIsFree = !inLastCol && !getIsCellFilled(state, minRow, minCol + numCols);
  const bottomCellIsFree = !inLastRow && !getIsCellFilled(state, minRow + numRows, minCol);
  const bottomRightCellIsFree =
    !inLastRow && !inLastCol && !getIsCellFilled(state, minRow + numRows, minCol + numCols);

  const blockIds = [1, 2, 3, 4];

  for (let i = 0; i < 4; i++) {
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
  getStatus,
  getBoardId,
  getBlockKey,
  getNumCellsFilled,
  getNumTwoByTwoBlocks,
  getIsCellFilled,
  getAvailablePositions,
  getNextChangeBlockId,
};
