// There are four types of blocks in Klotski: 1x1, 2x1 (vertical), 1x2 (horizontal), and 2x2
export class Block {
  static readonly ONE_BY_ONE = new Block(1, 1);
  static readonly TWO_BY_ONE = new Block(2, 1);
  static readonly ONE_BY_TWO = new Block(1, 2);
  static readonly TWO_BY_TWO = new Block(2, 2);

  readonly rows: 1 | 2;
  readonly cols: 1 | 2;

  public constructor(rows: 1 | 2, cols: 1 | 2) {
    this.rows = rows;
    this.cols = cols;
  }

  public area = () => this.rows * this.cols;

  public isEqual = (b: Block) => this.rows === b.rows && this.cols === b.cols;

  public toInt(): 1 | 2 | 3 | 4 {
    if (this.isEqual(Block.ONE_BY_ONE)) return 1;
    else if (this.isEqual(Block.TWO_BY_ONE)) return 2;
    else if (this.isEqual(Block.ONE_BY_TWO)) return 3;
    else return 4;
  }
}
