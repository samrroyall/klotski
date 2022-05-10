import { Block, BlockId } from './Block';
import { Dir, isSamePositionedBlock, oppositeDir, Pos, PositionedBlock } from './PositionedBlock';
const md5 = require('md5');

// A Move is made up of a Dir and a PositionedBlock
export interface Move {
  readonly dirs: Dir[];
  readonly block: Block;
  readonly pos: Pos;
}

export function oppositeMove(m: Move): Move {
  const dirs: Dir[] = [];
  for (let dir of m.dirs) dirs.push(oppositeDir(dir));

  return { block: m.block, pos: m.pos, dirs };
}

enum LogLevel {
  Debug = 0,
  Warn = 1,
  Error = 2,
}

// A Board is essentially a collection of PositionedBlocks with board-related methods -- like
// addBlock(), moveBlock(), allValidMoves(), and isSolved() -- and utility methods that enforce
// rules -- like isValid()., updatePos
export class Board {
  static readonly rows: number = 5;
  static readonly cols: number = 4;
  static readonly winningPos: Pos = { row: 3, col: 1 };
  private static logLevel: LogLevel = LogLevel.Warn;

  readonly blocks: PositionedBlock[];
  readonly grid: (BlockId | 0)[][];

  readonly parent: Board | null = null;
  readonly initialMove: Move | null = null;

  public constructor(board: Board | null = null, move: Move | null = null) {
    // if cloning a prior board, clone its blocks array and grid
    if (board) {
      if (!move) throw Error('An attempt was made to create a child board without a move.');

      this.blocks = [
        ...board.blocks.map(
          (pos_block) => new PositionedBlock(pos_block.block, { ...pos_block.minPos() })
        ),
      ];
      this.grid = [...board.grid.map((row) => [...row])];

      this.parent = board;
      this.initialMove = move;
      this.moveBlock(move);
      return;
    }

    // if creating a fresh board, begin with an empty blocks array and grid
    this.blocks = [];
    this.grid = Array(Board.rows)
      .fill(null)
      .map(() => Array(Board.cols).fill(0));
  }

  private _debug(msg: string): void {
    if (Board.logLevel <= LogLevel.Debug) console.debug(msg);
  }

  private _warn(msg: string): void {
    if (Board.logLevel <= LogLevel.Warn) console.warn(msg);
  }

  public isValid(): boolean {
    // ensure board has exactly two empty spaces
    const cellsFilled = this.blocks.reduce((acc, block) => acc + block.area(), 0);
    if (cellsFilled !== Board.rows * Board.cols - 2) {
      this._warn(`isValid() :: There are not two empty spaces (${cellsFilled}).`);
      return false;
    }
    // ensure board has exactly one 2x2 block
    const numTwoByTwoBlocks = this.blocks.reduce(
      (acc, block) => acc + Number(block.toBlockId() === BlockId.TwoByTwo),
      0
    );
    if (numTwoByTwoBlocks !== 1) {
      this._warn(`isValid() :: There is not one (${numTwoByTwoBlocks}) 2x2 block.`);
      return false;
    }
    return true;
  }

  public isSolved(): boolean {
    const twoByTwoMinPos = this.blocks
      .find((block) => block.toBlockId() === BlockId.TwoByTwo)
      ?.minPos();

    if (!twoByTwoMinPos)
      throw Error('An attempt was made to check the solved status of a board without a 2x2 block.');

    return (
      twoByTwoMinPos.row === Board.winningPos.row && twoByTwoMinPos.col === Board.winningPos.col
    );
  }

  private _moveAvailable(block: PositionedBlock, dir: Dir): boolean {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    switch (dir) {
      case Dir.Left: {
        const col = minPos.col - 1;
        if (col < 0) return false;

        for (let row = minPos.row; row <= maxPos.row; row++) if (this.grid[row][col]) return false;

        return true;
      }
      case Dir.Right: {
        const col = maxPos.col + 1;
        if (col >= Board.cols) return false;

        for (let row = minPos.row; row <= maxPos.row; row++) if (this.grid[row][col]) return false;

        return true;
      }
      case Dir.Up: {
        const row = minPos.row - 1;
        if (row < 0) return false;

        for (let col = minPos.col; col <= maxPos.col; col++) if (this.grid[row][col]) return false;

        return true;
      }
      case Dir.Down: {
        const row = maxPos.row + 1;
        if (row >= Board.rows) return false;

        for (let col = minPos.col; col <= maxPos.col; col++) if (this.grid[row][col]) return false;

        return true;
      }
    }
  }

  private _validMoves(pos_block: PositionedBlock): Move[] {
    const moves: Move[] = [];
    // Return the possible Moves
    const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
    for (let dir of availableDirs) {
      if (this._moveAvailable(pos_block, dir)) {
        // add move of length one to moves array
        moves.push({ block: pos_block.block, pos: pos_block.minPos(), dirs: [dir] });
        // create temporary moved block
        const movedBlock = new PositionedBlock(pos_block.block, pos_block.minPos());
        movedBlock.move([dir]);
        for (let dir2 of availableDirs.filter((dir) => dir !== oppositeDir(dir))) {
          if (this._moveAvailable(movedBlock, dir2)) {
            // add move of length two to moves array
            moves.push({ block: pos_block.block, pos: pos_block.minPos(), dirs: [dir, dir2] });
          }
        }
      }
    }
    return moves;
  }

  public allValidMoves(): Move[] {
    if (!this.isValid())
      throw Error('An attempt to find all valid moves was made on an invalid board.');

    const valid_moves: Move[] = [];
    for (let block of this.blocks) {
      for (let move of this._validMoves(block)) valid_moves.push(move);
    }

    return valid_moves;
  }

  private _outOfBounds(block: PositionedBlock): boolean {
    const positions = [block.minPos(), block.maxPos()];
    for (let pos of positions) {
      if (pos.row < 0 || pos.col < 0 || pos.row >= Board.rows || pos.col >= Board.cols) {
        return true;
      }
    }
    return false;
  }

  private _overlapsBlock(block: PositionedBlock): boolean {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) {
        if (this.grid[row][col] !== 0) return true;
      }
    }
    return false;
  }

  private _isValidPlacement(newBlock: PositionedBlock): boolean {
    // ensure block is on the board
    if (this._outOfBounds(newBlock)) {
      this._warn(
        `Board.addBlock() :: Block (${newBlock.toString()}) placement is invalid -- out of bounds.`
      );
      return false;
    }
    // ensure block does not overlap another block
    if (this._overlapsBlock(newBlock)) {
      this._warn(
        `Board.addBlock() :: Block (${newBlock.toString()}) placement is invalid -- overlap.`
      );
      return false;
    }
    return true;
  }

  private _addBlockToGrid(block: PositionedBlock): void {
    const blockId = block.toBlockId();
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) {
        this.grid[row][col] = blockId;
      }
    }
  }

  private _removeBlockFromGrid(block: PositionedBlock): void {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) {
        this.grid[row][col] = 0;
      }
    }
  }

  public addBlock(block: Block, pos: Pos): void {
    const newBlock = new PositionedBlock(block, pos);
    // if the block placement is valid, add the block to the boards array and grid
    if (this._isValidPlacement(newBlock)) {
      this.blocks.push(newBlock);
      this._addBlockToGrid(newBlock);
    }
  }

  public moveBlock(move: Move): void {
    const move_pos_block = new PositionedBlock(move.block, move.pos);
    const pos_block = this.blocks.find((pos_block) =>
      isSamePositionedBlock(pos_block, move_pos_block)
    );
    if (!pos_block)
      throw Error(`An attempt was made to move a block that does not exist on the board.`);

    this._removeBlockFromGrid(pos_block);
    pos_block.move(move.dirs);
    this._addBlockToGrid(pos_block);
  }

  public getHash(): string {
    let str = '';
    this.grid.forEach((row) => row.forEach((col) => (str += col.toString())));

    return md5(str);
  }
}
