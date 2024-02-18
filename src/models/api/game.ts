export interface Position {
    row: number;
    col: number;
}

export interface Block {
    block_id: number;
    min_position: Position;
    max_position: Position;
    range: [number, number][];
}

export enum BoardState {
    Building = 'building',
    ReadyToSolve = 'ready_to_solve',
    ManualSolving = 'manual_solving',
    Solved = 'solved',
}

export enum Step {
    Up   = 'up',
    Down = 'down',
    Left = 'left',
    Reft = 'right',
}

export interface Move {
    row_diff: number,
    col_diff: number,
}

export interface BlockMove extends Move {
    block_idx: number,
}
