export type BlockId = 1 | 2 | 3 | 4;

export const rowsFromBlockId = (blockId: BlockId) => {
  switch (blockId) {
    case 1:
      return 1;
    case 2:
      return 1;
    case 3:
      return 2;
    case 4:
      return 2;
  }
};

export const colsFromBlockId = (blockId: 1 | 2 | 3 | 4) => {
  switch (blockId) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 1;
    case 4:
      return 2;
  }
};

export interface Position {
  row: number;
  col: number;
}

export interface Block {
  block_id: BlockId;
  min_position: Position;
}

export interface BoardBlock extends Block {
  rows: number;
  cols: number;
  min_position: Position;
  idx: number;
}

export function blockToBoardBlock(block: Block, idx: number): BoardBlock {
  return {
    ...block,
    rows: rowsFromBlockId(block.block_id),
    cols: colsFromBlockId(block.block_id),
    idx,
  };
}

export enum BoardState {
  Building = 'building',
  ReadyToSolve = 'ready_to_solve',
  Solving = 'solving',
  Solved = 'solved',
}

export interface Move {
  row_diff: number;
  col_diff: number;
}

export interface BlockMove extends Move {
  block_idx: number;
}
