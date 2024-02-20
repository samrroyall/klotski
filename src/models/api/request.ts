import { BlockId, BoardState, Move } from './game';

export interface AddBlock {
  block_id: BlockId;
  min_row: number;
  min_col: number;
}

interface ChangeBlockData {
  new_block_id: BlockId;
}

export interface ChangeBlock extends ChangeBlockData {
  type: 'change_block';
}

interface MoveBlockData {
  move: Move;
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

export type AlterBoard = ChangeState | UndoMove;
