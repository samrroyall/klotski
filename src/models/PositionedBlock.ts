import { Block, BlockId } from './Block';

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

export function updatePos(pos: Pos, dir: Dir): void {
  switch (dir) {
    case Dir.Left: {
      pos.col--;
      return;
    }
    case Dir.Right: {
      pos.col++;
      return;
    }
    case Dir.Up: {
      pos.row--;
      return;
    }
    case Dir.Down: {
      pos.row++;
      return;
    }
  }
}

// A PositionedBlock is a Block associated with some Pos value
export class PositionedBlock {
  readonly block: Block;
  private _pos: Pos; // the minimum position (top-left corner) of the block

  public constructor(block: Block, pos: Pos) {
    this.block = block;
    this._pos = pos;
  }

  public area = (): number => this.block.height() * this.block.width();

  public minPos = (): Pos => ({ row: this._pos.row, col: this._pos.col });

  public maxPos = (): Pos => ({
    row: this._pos.row + this.block.height() - 1,
    col: this._pos.col + this.block.width() - 1,
  });

  public toBlockId(): BlockId {
    switch (this.block) {
      case Block.ONE_BY_ONE:
        return BlockId.OneByOne;
      case Block.ONE_BY_TWO:
        return BlockId.OneByTwo;
      case Block.TWO_BY_ONE:
        return BlockId.TwoByOne;
      case Block.TWO_BY_TWO:
        return BlockId.TwoByTwo;
      default:
        throw new Error('An attempt was made to convert an illegal Block object into a BlockId.');
    }
  }

  public move = (dirs: Dir[]): void => dirs.forEach((dir) => updatePos(this._pos, dir));

  public toString = (): string =>
    `${this.block.height()}x${this.block.width()} block @ (${this._pos.row}, ${this._pos.col})`;
}

export function isSamePositionedBlock(p1: PositionedBlock, p2: PositionedBlock) {
  const b1 = p1.block;
  const b2 = p2.block;
  const minPos1 = p1.minPos();
  const minPos2 = p2.minPos();

  return (
    b1.height() === b2.height() &&
    b1.width() === b2.width() &&
    minPos1.row === minPos2.row &&
    minPos1.col === minPos2.col
  );
}
