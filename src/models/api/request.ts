import { Block, BoardState } from './game';

interface EmptyBoard {
  type: 'empty';
}

interface RandomBoard {
  type: 'random';
}

export type NewBoard = EmptyBoard | RandomBoard;

export interface Reset {
  type: 'reset';
}

export type AlterBoard = ChangeState | Reset | UndoMove;

export interface AddBlock {
  block: Block;
  min_row: number;
  min_col: number;
}

interface ChangeBlockData {
  new_block: Block;
}

export interface ChangeBlock extends ChangeBlockData {
  type: 'change_block';
}

interface MoveBlockData {
  row_diff: number;
  col_diff: number;
}

export interface MoveBlock extends MoveBlockData {
  type: 'move_block';
}

export type AlterBlock = ChangeBlock | MoveBlock;

interface ChangeStateData {
  new_state: BoardState;
}

export interface ChangeState extends ChangeStateData {
  type: 'change_state';
}

export interface UndoMove {
  type: 'undo_move';
}
