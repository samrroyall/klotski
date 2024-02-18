import {BoardState, Step} from './game';

export interface AddBlock {
    block_id: number;
    min_row: number;
    min_col: number;
}

interface ChangeBlockData {
    new_block_id: number;
}

interface ChangeBlock extends ChangeBlockData {
    type: 'change_block';
}

interface MoveBlockData {
    steps: Step[];
}

interface MoveBlock extends MoveBlockData {
    type: 'move_block';
}

export type AlterBlock = ChangeBlock | MoveBlock;

interface ChangeStateData {
    new_state: BoardState,
}

interface ChangeState extends ChangeStateData {
    type: 'change_state';
}

interface UndoMove {
    type: 'undo_move';
}

export type AlterBoard = ChangeState | UndoMove;
