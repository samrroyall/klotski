import { WINNING_COL, WINNING_ROW } from '../../constants';
import { Block, BoardBlock, Move } from '../../models/api/game';
import { AppState } from '../../models/ui';
import { RootState } from '../../store';

export const selectBoardId = (state: RootState): number | null => state.board.id;

export const selectBoardIsSolved = (state: RootState): boolean =>
  state.board.blocks.find(
    (block) =>
      block.block === Block.TwoByTwo &&
      block.min_position.row === WINNING_ROW &&
      block.min_position.col === WINNING_COL
  ) !== undefined;

export const selectBoardState = (state: RootState): AppState => state.board.state;

export const selectBlocks = (state: RootState): BoardBlock[] => state.board.blocks;

export const selectGrid = (state: RootState): (Block | null)[] => state.board.grid;

export const selectNextMoves = (state: RootState): Move[][] => state.board.nextMoves;

export const selectNumCellsFilled = (state: RootState): number =>
  state.board.blocks.reduce((acc, { rows, cols }) => acc + rows * cols, 0);

export const selectNumTwoByTwoBlocks = (state: RootState) =>
  state.board.blocks.filter(({ block }) => block === Block.TwoByTwo).length;
