import { Block } from './Block';
import { PositionedBlock } from './PositionedBlock';
import { Dir, getOppositeDir, Grid, Pos, getNewPosFromDir } from './global';
import { NUM_COLS, NUM_ROWS, WINNING_COL, WINNING_ROW } from '../constants';
const md5 = require('md5');

// A Move is made up of a Block, a Pos associated with the block, and a list of Dirs
// corresponding to the move
export interface Move {
  readonly dirs: Dir[];
  readonly block: Block;
  readonly pos: Pos;
}

// A Board is a collection of PositionedBlocks with board-related methods -- like
// addBlock(), moveBlock(), allValidMoves(), and isSolved() -- and utility methods that enforce
// rules -- like isValid()., updatePos
export class Board {
  static readonly rows: number = NUM_ROWS;
  static readonly cols: number = NUM_COLS;
  static readonly winningPos: Pos = { row: WINNING_ROW, col: WINNING_COL };

  private blocks: PositionedBlock[] = [];
  private grid: Grid = [[]];

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
    // if not, set blocks and grid to defaults
    this.reset();
  }

  public reset() {
    this.blocks = [];
    this.grid = Array(Board.rows)
      .fill(null)
      .map(() => Array(Board.cols).fill(0));
  }

  public getBlocks = () => [...this.blocks.map((pb) => new PositionedBlock(pb.block, pb.minPos()))];

  public setBlocks = (blocks: PositionedBlock[]) => (this.blocks = blocks);

  public getGrid = () => [...this.grid.map((row) => [...row])];

  public setGrid = (grid: Grid) => (this.grid = grid);

  public isSolved(): boolean {
    const twoByTwoMinPos = this.blocks.find((pb) => pb.block.toInt() === 4)?.minPos();

    return (
      twoByTwoMinPos?.row === Board.winningPos.row && twoByTwoMinPos?.col === Board.winningPos.col
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

  private _validMoves(posBlock: PositionedBlock): Move[] {
    const minPos = posBlock.minPos();
    const block = posBlock.block;

    const moves: Move[] = [];
    const availableDirs = [Dir.Left, Dir.Right, Dir.Up, Dir.Down];
    for (let dir of availableDirs) {
      if (this._moveAvailable(posBlock, dir)) {
        // add move of length one to moves array
        moves.push({ block, pos: minPos, dirs: [dir] });
        // add move of length two to moves array
        const movedBlock = new PositionedBlock(block, getNewPosFromDir(minPos, dir));
        for (let dir2 of availableDirs.filter((dir) => dir !== getOppositeDir(dir))) {
          if (this._moveAvailable(movedBlock, dir2))
            moves.push({ block, pos: minPos, dirs: [dir, dir2] });
        }
      }
    }

    return moves;
  }

  public allValidMoves = () =>
    this.blocks.reduce((acc: Move[], pb) => acc.concat(this._validMoves(pb)), []);

  public getHash = () =>
    md5(this.grid.reduce((acc, row) => row.reduce((acc2, col) => acc2 + col.toString(), acc), ''));

  private _addBlockToGrid(block: PositionedBlock): void {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++)
        this.grid[row][col] = block.block.toInt();
    }
  }

  private _removeBlockFromGrid(block: PositionedBlock): void {
    const minPos = block.minPos();
    const maxPos = block.maxPos();
    for (let row = minPos.row; row <= maxPos.row; row++) {
      for (let col = minPos.col; col <= maxPos.col; col++) this.grid[row][col] = 0;
    }
  }

  public moveBlock(move: Move): void {
    const posBlock = new PositionedBlock(move.block, move.pos);
    const pb = this.blocks.find((pb) => pb.isEqual(posBlock));
    if (!pb) throw Error('An attempt was made to move a block that does not exist on the board.');

    this._removeBlockFromGrid(pb);
    move.dirs.map((d) => pb.move(getNewPosFromDir(pb.minPos(), d)));
    this._addBlockToGrid(pb);
  }
}
