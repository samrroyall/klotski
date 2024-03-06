export enum Block {
  OneByOne = 'one_by_one',
  OneByTwo = 'one_by_two',
  TwoByOne = 'two_by_one',
  TwoByTwo = 'two_by_two',
}

export const getBlockRows = (block: Block) => {
  switch (block) {
    case Block.OneByOne:
    case Block.OneByTwo:
      return 1;
    case Block.TwoByOne:
    case Block.TwoByTwo:
      return 2;
  }
};

export const getBlockCols = (block: Block) => {
  switch (block) {
    case Block.OneByOne:
    case Block.TwoByOne:
      return 1;
    case Block.OneByTwo:
    case Block.TwoByTwo:
      return 2;
  }
};

export interface Position {
  row: number;
  col: number;
}

export interface PositionedBlock {
  block: Block;
  min_position: Position;
  max_position: Position;
}

export interface BoardBlock extends PositionedBlock {
  idx: number;
  rows: number;
  cols: number;
}

export function positionedBlockToBoardBlock(
  positionedBlock: PositionedBlock,
  idx: number
): BoardBlock {
  return {
    ...positionedBlock,
    rows: getBlockRows(positionedBlock.block),
    cols: getBlockCols(positionedBlock.block),
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
