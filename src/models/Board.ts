import { Block, BlockId } from './Block';
import {
  Dir,
  isSamePositionedBlock,
  oppositeDir,
  Pos,
  PositionedBlock,
  getNewPos,
} from './PositionedBlock';
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

// A Board is essentially a collection of PositionedBlocks with board-related methods -- like
// addBlock(), moveBlock(), allValidMoves(), and isSolved() -- and utility methods that enforce
// rules -- like isValid()., updatePos
export class Board {
  static readonly rows: number = 5;
  static readonly cols: number = 4;
  static readonly winningPos: Pos = { row: 3, col: 1 };

  private blocks: PositionedBlock[] = [];
  private grid: (BlockId | 0)[][] = [[]];

  readonly parent: Board | null = null;
  readonly initialMove: Move | null = null;

  public constructor(board: Board | null = null, move: Move | null = null) {
    // if branching off from a parent board, clone its blocks array and grid
    if (board) {
      if (!move) throw Error('An attempt was made to create a child board without a move.');

      this.blocks = board.getBlocks();
      this.grid = board.getGrid();

      this.parent = board;
      this.initialMove = move;
      this.moveBlock(move);
      return;
    }

    this.reset();
  }

  public reset() {
    this.blocks = [];
    this.grid = Array(Board.rows)
      .fill(null)
      .map(() => Array(Board.cols).fill(0));
  }

  public getBlocks = () => [...this.blocks.map((pb) => new PositionedBlock(pb.block, pb.minPos()))];

  public getGrid = () => [...this.grid.map((row) => [...row])];

  public numCellsFilled = (): number => this.blocks.reduce((acc, b) => acc + b.area(), 0);

  public numTwoByTwos = (): number =>
    this.blocks.reduce((acc, b) => acc + Number(b.area() === 4), 0);

  public isValid = (): boolean =>
    this.numCellsFilled() === Board.rows * Board.cols - 2 && this.numTwoByTwos() === 1;

  public isSolved(): boolean {
    const twoByTwoMinPos = this.blocks
      .find((block) => block.toBlockId() === BlockId.TwoByTwo)
      ?.minPos();

    return (
      !!twoByTwoMinPos &&
      twoByTwoMinPos.row === Board.winningPos.row &&
      twoByTwoMinPos.col === Board.winningPos.col
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

  public availablePositions(block: Block, pos: Pos): Pos[] {
    const positions: Pos[] = [];

    const posBlock = new PositionedBlock(block, pos);
    const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
    for (let dir of availableDirs) {
      if (this._moveAvailable(posBlock, dir)) {
        // create temporary moved block and push its position
        const movedPosBlock = new PositionedBlock(posBlock.block, posBlock.minPos());
        movedPosBlock.move(getNewPos(movedPosBlock.minPos(), dir));
        positions.push(movedPosBlock.minPos());
        for (let dir2 of availableDirs.filter((dir) => dir !== oppositeDir(dir))) {
          if (this._moveAvailable(movedPosBlock, dir2)) {
            movedPosBlock.move(getNewPos(movedPosBlock.minPos(), dir2));
            positions.push(movedPosBlock.minPos());
          }
        }
      }
    }

    return positions;
  }

  private _validMoves(posBlock: PositionedBlock): Move[] {
    const moves: Move[] = [];

    const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
    for (let dir of availableDirs) {
      if (this._moveAvailable(posBlock, dir)) {
        // add move of length one to moves array
        moves.push({ block: posBlock.block, pos: posBlock.minPos(), dirs: [dir] });
        const movedBlock = new PositionedBlock(posBlock.block, getNewPos(posBlock.minPos(), dir));
        for (let dir2 of availableDirs.filter((dir) => dir !== oppositeDir(dir))) {
          if (this._moveAvailable(movedBlock, dir2)) {
            // add move of length two to moves array
            moves.push({ block: posBlock.block, pos: posBlock.minPos(), dirs: [dir, dir2] });
          }
        }
      }
    }

    return moves;
  }

  public allValidMoves = () =>
    this.blocks.reduce((acc: Move[], pb) => acc.concat(this._validMoves(pb)), []);

  public getHash = () =>
    md5(this.grid.reduce((acc, row) => row.reduce((acc2, col) => acc2 + col.toString(), acc), ''));

  // Manual Solve Helpers

  private _outOfBounds = (block: PositionedBlock) =>
    [block.minPos(), block.maxPos()].some(
      (pos: Pos) => pos.row < 0 || pos.col < 0 || pos.row >= Board.rows || pos.col >= Board.cols
    );

  private _overlapsBlock(block: PositionedBlock): boolean {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) if (this.grid[row][col]) return true;
    }
    return false;
  }

  private _isValidPlacement = (pb: PositionedBlock) =>
    !(this._outOfBounds(pb) || this._overlapsBlock(pb));

  private _addBlockToGrid(block: PositionedBlock): void {
    const blockId = block.toBlockId();
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) this.grid[row][col] = blockId;
    }
  }

  private _removeBlockFromGrid(block: PositionedBlock): void {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) this.grid[row][col] = 0;
    }
  }

  public addBlock(block: Block, pos: Pos): void {
    const newBlock = new PositionedBlock(block, pos);
    if (!this._isValidPlacement(newBlock)) throw Error('Block placement invalid');

    this.blocks.push(newBlock);
    this._addBlockToGrid(newBlock);
  }

  public moveBlockToPos(posBlock: PositionedBlock, pos: Pos): void {
    const pb = this.blocks.find((pb) => isSamePositionedBlock(pb, posBlock));
    if (!pb) throw Error('An attempt was made to move a block that does not exist on the board.');

    this._removeBlockFromGrid(pb);
    pb.move(pos);
    this._addBlockToGrid(pb);
  }

  public moveBlock(move: Move): void {
    const posBlock = new PositionedBlock(move.block, move.pos);
    const pb = this.blocks.find((pb) => isSamePositionedBlock(pb, posBlock));
    if (!pb) throw Error('An attempt was made to move a block that does not exist on the board.');

    this._removeBlockFromGrid(pb);
    pb.move(getNewPos(pb.minPos(), move.dirs[0]));
    if (move.dirs.length > 1) pb.move(getNewPos(pb.minPos(), move.dirs[1]));
    this._addBlockToGrid(pb);
  }
}
