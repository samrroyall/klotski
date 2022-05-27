import { Block } from './Block';
import { Pos } from './global';

// A PositionedBlock is a Block associated with some Pos valuej
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
