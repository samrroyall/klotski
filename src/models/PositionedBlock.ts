import { Block } from './Block';

// On the board, only moves of type Left, Right, Up, or Down are valid
export enum Dir {
  Left = 'L',
  Right = 'R',
  Up = 'U',
  Down = 'D',
}

export function oppositeDir(dir: Dir): Dir {
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

// Pos is made up of an x- and y-coordinate
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

// A PositionedBlock is a Block associated with some Pos value
export class PositionedBlock {
  readonly block: Block;
  private _minPos: Pos; // top-left corner of block

  public constructor(block: Block, pos: Pos) {
    this.block = block;
    this._minPos = { ...pos };
  }

  public minPos = (): Pos => ({ ...this._minPos });

  public maxPos = (): Pos => ({
    row: this._minPos.row + this.block.rows - 1,
    col: this._minPos.col + this.block.cols - 1,
  });

  public isEqual = (p: PositionedBlock) =>
    this.block.isEqual(p.block) &&
    this._minPos.row === p.minPos().row &&
    this._minPos.col === p.minPos().col;

  public move = (newPos: Pos) => (this._minPos = { ...newPos });
}
