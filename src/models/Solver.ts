import * as global from './global';
import { Grid, Move, PosBlock } from './global';
import { NUM_COLS, NUM_ROWS } from '../constants';

interface Node<T> {
  value: T;
  next: Node<T> | null;
}

class LinkedList<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private size: number;

  public constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  public pushBack(val: T): void {
    const newNode: Node<T> = { value: val, next: null };
    if (!this.tail) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = this.tail.next;
    }
    this.size++;
  }

  public popFront(): T {
    if (!this.head) {
      throw Error('Attempt to pop from empty list.');
    } else if (this.head === this.tail) {
      this.tail = this.tail.next;
    }
    const headVal = this.head.value;
    this.head = this.head.next;
    this.size--;
    return headVal;
  }

  public length = (): number => this.size;

  public isEmpty = (): boolean => this.size === 0;
}

class Queue<T> {
  private queue = new LinkedList<T>();

  public constructor(arr: T[] | null = null) {
    if (arr) {
      arr.forEach((val: T) => this.enqueue(val));
    }
  }

  public enqueue = (val: T): void => this.queue.pushBack(val);

  public dequeue = (): T => this.queue.popFront();

  public isEmpty = (): boolean => this.queue.isEmpty();

  public length = (): number => this.queue.length();
}

export class Board {
  public blocks: PosBlock[];
  public grid: Grid;

  readonly parent: Board | null = null;
  readonly initialMove: Move | null = null;

  public constructor(board: Board | null = null, move: Move | null = null) {
    if (!board) {
      this.blocks = [];
      this.grid = Array(NUM_ROWS)
        .fill(null)
        .map(() => Array(NUM_COLS).fill(0));
    } else if (!move) {
      throw Error('An attempt was made to create a child board without a move.');
    } else {
      // if branching off from a parent board, clone its blocks array and grid...
      this.blocks = [...board.blocks.map((pb) => ({ ...pb }))];
      this.grid = [...board.grid.map((row) => [...row])];
      this.parent = board;
      // ...and make the initial move
      this.initialMove = move;
      const newPos = move.dirs.reduce(
        (acc, d) => global.getNewPosFromDir(acc, d),
        global.getMinPos(move)
      );
      global.moveBlock(this, { ...move }, newPos);
    }
  }
}

export function solveBoard(board: Board): Move[] | null {
  let tail: Board | null = null;
  const queue = new Queue<Board>([board]);
  const hashes = new Set<string>([global.getGridHash(board.grid)]);
  while (!queue.isEmpty()) {
    const currBoard = queue.dequeue();
    // if the current board is solved, we are done
    if (global.boardIsSolved(currBoard)) {
      tail = currBoard;
      break;
    }
    // if not, push child boards to the stack
    for (let move of global.allValidMoves(currBoard)) {
      const childBoard = new Board(currBoard, move);
      const childBoardHash = global.getGridHash(childBoard.grid);
      if (!hashes.has(childBoardHash)) {
        hashes.add(childBoardHash);
        queue.enqueue(childBoard);
      }
    }
  }
  // if no solution was found, return null
  if (!tail) {
    return null;
  }
  // if a solution was found, return the list of moves in the solution
  const moves: Move[] = [];
  while (tail.parent && tail.initialMove) {
    moves.push(tail.initialMove);
    tail = tail.parent;
  }
  // return moves in reverse order
  return moves;
}
