// BlockId is a named enum of the different types of valid Blocks
export enum BlockId {
  OneByOne = 1,
  TwoByOne = 2,
  OneByTwo = 3,
  TwoByTwo = 4,
}

// There are four types of blocks in Klotski: 1x1, 2x1 (vertical), 1x2 (horizontal), and 2x2
export class Block {
  static readonly ONE_BY_ONE = new Block(1, 1);
  static readonly TWO_BY_ONE = new Block(2, 1);
  static readonly ONE_BY_TWO = new Block(1, 2);
  static readonly TWO_BY_TWO = new Block(2, 2);

  private _rows: number;
  private _cols: number;

  private constructor(rows: number, cols: number) {
    this._rows = rows;
    this._cols = cols;
  }

  public height = (): number => this._rows;

  public width = (): number => this._cols;
}
