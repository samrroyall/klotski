import { WINNING_COL, WINNING_ROW } from '../../constants';
import { BoardBlock, Move } from '../../models/api/game';
import { Status } from '../../state/boardSlice';
import { RootState } from '../../state/store';

const getStatus = (state: RootState): Status => state.board.status;

const getBoardIsSolved = (state: RootState): boolean =>
  state.board.blocks.find(
    (block) =>
      block.block_id === 4 &&
      block.min_position.row === WINNING_ROW &&
      block.min_position.col === WINNING_COL
  ) !== undefined;

const getIsAvailableMinPosition = (state: RootState, cellRow: number, cellCol: number): boolean =>
  state.manualSolve.availableMinPositions.filter(
    (pos) => pos.row === cellRow && pos.col === cellCol
  ).length > 0;

const getMovesOverOptimal = (state: RootState): number =>
  state.manualSolve.moves.length - state.manualSolve.optimalMoves!.length;

const getAssociatedMove = (
  state: RootState,
  block: BoardBlock,
  cellRow: number,
  cellCol: number
): Move | null => {
  const row_diff_to_cell = cellRow - block.min_position.row;
  const col_diff_to_cell = cellCol - block.min_position.col;

  return (
    state.manualSolve.nextMoves[block.idx].find(
      ({ row_diff, col_diff }) => row_diff === row_diff_to_cell && col_diff === col_diff_to_cell
    ) || null
  );
};

const getIsWinningCell = (row: number, col: number) =>
  (row === WINNING_ROW || row === WINNING_ROW + 1) &&
  (col === WINNING_COL || col === WINNING_COL + 1);

export const Helpers = {
  getStatus,
  getBoardIsSolved,
  getMovesOverOptimal,
  getIsAvailableMinPosition,
  getAssociatedMove,
  getIsWinningCell,
};
