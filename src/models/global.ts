// General Types, Interfaces, and functions

export enum Dir {
  Left = 'L',
  Right = 'R',
  Up = 'U',
  Down = 'D',
}

export function getOppositeDir(dir: Dir): Dir {
  switch (dir) {
    case Dir.Left:
      return Dir.Right;
    case Dir.Right:
      return Dir.Left;
    case Dir.Up:
      return Dir.Down;
    case Dir.Down:
      return Dir.Up;
  }
}

export interface Pos {
  row: number;
  col: number;
}

export function getNewPosFromDir(pos: Pos, dir: Dir): Pos {
  const { row, col } = pos;
  switch (dir) {
    case Dir.Left:
      return { row, col: col - 1 };
    case Dir.Right:
      return { row, col: col + 1 };
    case Dir.Up:
      return { row: row - 1, col };
    case Dir.Down:
      return { row: row + 1, col };
  }
}

// UI Types and Interfaces

export interface UIBlock {
  rows: 1 | 2;
  cols: 1 | 2;
}

export interface UIMove {
  block: UIBlock;
  pos: Pos;
  dirs: Dir[];
}

export const getOppositeMove = ({ block, pos, dirs }: UIMove): UIMove => ({
  block,
  pos: dirs.reduce((acc, dir) => getNewPosFromDir(acc, dir), pos), // update old pos with old dirs
  dirs: dirs.map((d) => getOppositeDir(d)).reverse(), // get opposite dirs
});

export type BlockId = 0 | 1 | 2 | 3 | 4;

export type Grid = BlockId[][];

export const blockToInt = (block: UIBlock): BlockId => {
  const { rows, cols } = block;

  if (rows === 1 && cols === 1) return 1;
  else if (rows === 2 && cols === 1) return 2;
  else if (rows === 1 && cols === 2) return 3;
  else if (rows === 2 && cols === 2) return 4;
  else return 0;
};

export type UIPosBlock = { block: UIBlock; pos: Pos };

export const posBlocksEqual = (pb1: UIPosBlock, pb2: UIPosBlock) =>
  pb1.block.rows === pb2.block.rows &&
  pb1.block.cols === pb2.block.cols &&
  pb1.pos.row === pb2.pos.row &&
  pb1.pos.col === pb2.pos.col;
